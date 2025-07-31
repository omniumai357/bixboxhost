import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPaymentRequest {
  sessionId: string;
  orderId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Payment verification started');

    // Initialize Supabase service client
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Parse request
    const { sessionId, orderId }: VerifyPaymentRequest = await req.json();
    
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    console.log('🎯 Verifying session:', sessionId);

    // Check if Stripe is configured
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.warn('⚠️ STRIPE_SECRET_KEY not set - returning mock verification');
      
      // Update order status in database (mock)
      if (orderId) {
        await supabaseService
          .from('orders')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
      }

      return new Response(JSON.stringify({ 
        verified: true,
        status: 'completed',
        message: 'Mock payment verification - Stripe not configured'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('📋 Session status:', session.payment_status);

    // Find order in database
    let order = null;
    if (orderId) {
      const { data, error } = await supabaseService
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (!error) {
        order = data;
      }
    } else {
      // Try to find by session ID
      const { data, error } = await supabaseService
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();
      
      if (!error) {
        order = data;
      }
    }

    if (!order) {
      console.warn('⚠️ Order not found for session:', sessionId);
    }

    // Update order status based on payment status
    let orderStatus = 'pending';
    if (session.payment_status === 'paid') {
      orderStatus = 'completed';
    } else if (session.payment_status === 'unpaid') {
      orderStatus = 'cancelled';
    }

    // Update order in database
    if (order) {
      await supabaseService
        .from('orders')
        .update({ 
          status: orderStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      console.log('✅ Order updated:', order.id, 'Status:', orderStatus);
    }

    return new Response(JSON.stringify({
      verified: session.payment_status === 'paid',
      status: orderStatus,
      paymentStatus: session.payment_status,
      sessionId: sessionId,
      orderId: order?.id || null,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Payment verification failed',
      verified: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});