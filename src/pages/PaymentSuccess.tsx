import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, ArrowRight, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderDetails {
  id: string;
  package_type: string;
  amount: number;
  status: string;
  business_data: any;
  created_at: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      setVerifying(true);
      try {
        // Verify payment with Stripe
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId, orderId }
        });

        if (error) {
          console.error('Payment verification error:', error);
          toast({
            title: "Verification Error",
            description: "Could not verify payment status. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        console.log('Payment verification result:', data);

        // Fetch order details using existing tables for now
        if (data.orderId || orderId) {
          // Since orders table types aren't available yet, we'll use purchases table temporarily
          const { data: orderData, error: orderError } = await supabase
            .from('purchases')
            .select('*')
            .eq('id', data.orderId || orderId)
            .single();

          if (!orderError && orderData) {
            // Map purchases data to order format
            setOrder({
              id: orderData.id,
              package_type: 'starter', // Default until we have proper orders table
              amount: orderData.price || 8900,
              status: 'completed',
              business_data: null,
              created_at: orderData.created_at
            });
          }
        }

        if (data.verified) {
          toast({
            title: "Payment Confirmed! 🎉",
            description: "Your ad package has been successfully purchased.",
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Verification Error",
          description: "Could not verify payment. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId, toast]);

  const getPackageDetails = (packageType: string) => {
    switch (packageType) {
      case 'starter':
        return {
          name: 'Starter Package',
          description: '5 Custom Ad Cards',
          features: ['5 Professional Ad Cards', 'High-Resolution Downloads', 'Commercial License', '24/7 Support']
        };
      case 'professional':
        return {
          name: 'Professional Package',
          description: '15 Custom Ad Cards',
          features: ['15 Professional Ad Cards', 'High-Resolution Downloads', 'Multiple Formats', 'Commercial License', 'Priority Support']
        };
      case 'enterprise':
        return {
          name: 'Enterprise Package',
          description: '50 Custom Ad Cards + Landing Page',
          features: ['50 Professional Ad Cards', 'Custom Landing Page', 'Multiple Formats', 'Commercial License', 'VIP Support', 'Custom Branding']
        };
      default:
        return {
          name: 'Ad Package',
          description: 'Professional advertising materials',
          features: ['Professional Ad Cards', 'High-Resolution Downloads', 'Commercial License']
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-pulse rounded-lg bg-muted h-12 w-12 mx-auto mb-4"></div>
              {verifying ? (
                <p className="text-muted-foreground">Verifying your payment...</p>
              ) : (
                <p className="text-muted-foreground">Loading...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionId && !orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Invalid Access</CardTitle>
            <CardDescription>No payment session found</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const packageDetails = order ? getPackageDetails(order.package_type) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold gradient-text">BIZBOX.HOST</h1>
          </div>
        </div>

        {/* Success Card */}
        <Card className="enhanced-glass mb-8 animate-scale-bounce">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-success animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold text-success">Payment Successful! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Thank you for your purchase. Your professional ad package is being prepared.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          {order && packageDetails && (
            <Card className="enhanced-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Package:</span>
                  <Badge className="bg-primary/20 text-primary">
                    {packageDetails.name}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Amount:</span>
                  <span className="text-xl font-bold">${(order.amount / 100).toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Status:</span>
                  <Badge className="bg-success/20 text-success">
                    {order.status === 'completed' ? 'Paid' : order.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Order ID:</span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {order.id.slice(0, 8)}...
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">What you get:</h4>
                  <ul className="space-y-1">
                    {packageDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="enhanced-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Order Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Our team is preparing your custom ad cards with your business information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Email Notification</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive download links via email within 24 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Download & Use</h4>
                    <p className="text-sm text-muted-foreground">
                      Download your professional ad cards and start marketing your business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Link to="/dashboard" className="block">
                  <Button className="w-full">
                    View My Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full">
                    Return Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Card */}
        <Card className="enhanced-glass mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is here to help you get the most out of your ad package.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm">
                  View FAQ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;