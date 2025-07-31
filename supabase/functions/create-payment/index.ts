import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  packageType: 'starter' | 'professional' | 'enterprise';
  businessData?: {
    businessName?: string;
    industry?: string;
    phone?: string;
    website?: string;
  };
}

const PACKAGE_PRICES = {
  starter: 8900, // $89.00 in cents
  professional: 19700, // $197.00 in cents
  enterprise: 49700, // $497.00 in cents
};

const PACKAGE_NAMES = {
  starter: 'Starter Ad Package - 5 Custom Ad Cards',
  professional: 'Professional Ad Package - 15 Custom Ad Cards',
  enterprise: 'Enterprise Ad Package - 50 Custom Ad Cards + Landing Page',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Payment creation started');

    // Initialize Supabase client for auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Initialize Supabase service client for database operations
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const user = userData.user;
    console.log('✅ User authenticated:', user.email);

    // Parse request body
    const { packageType, businessData }: PaymentRequest = await req.json();
    
    if (!packageType || !PACKAGE_PRICES[packageType]) {
      throw new Error('Invalid package type');
    }

    const amount = PACKAGE_PRICES[packageType];
    const packageName = PACKAGE_NAMES[packageType];
    
    console.log('💰 Package details:', { packageType, amount, packageName });

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.warn('⚠️ STRIPE_SECRET_KEY not set - using placeholder');
      // Return mock response for development
      return new Response(JSON.stringify({ 
        url: '#',
        message: 'Stripe not configured - add STRIPE_SECRET_KEY to test payments',
        orderId: crypto.randomUUID()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Check if Stripe customer exists
    const customers = await stripe.customers.list({ 
      email: user.email || '', 
      limit: 1 
    });
    
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('✅ Existing Stripe customer found:', customerId);
    } else {
      console.log('🆕 New customer will be created by Stripe');
    }

    // Create order record in database
    const orderData = {
      user_id: user.id,
      email: user.email || '',
      package_type: packageType,
      amount: amount,
      status: 'pending',
      business_data: businessData || null,
    };

    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('❌ Database error:', orderError);
      throw new Error('Failed to create order record');
    }

    console.log('✅ Order created in database:', order.id);

    // Create Stripe checkout session
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email || '',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageName,
              description: `Professional advertising package for ${businessData?.businessName || 'your business'}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${origin}/payment-cancelled?order_id=${order.id}`,
      metadata: {
        order_id: order.id,
        user_id: user.id,
        package_type: packageType,
      },
    });

    // Update order with Stripe session ID
    await supabaseService
      .from('orders')
      .update({ stripe_payment_intent_id: session.id })
      .eq('id', order.id);

    console.log('✅ Stripe session created:', session.id);

    return new Response(JSON.stringify({ 
      url: session.url,
      orderId: order.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Payment creation error:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Payment creation failed' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});