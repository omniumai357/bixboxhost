import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, ShoppingCart, Zap } from 'lucide-react';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="container mx-auto max-w-2xl py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">BIZBOX.HOST</h1>
          </div>
        </div>

        {/* Cancellation Card */}
        <Card className="enhanced-glass animate-scale-bounce">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-orange-600">Payment Cancelled</CardTitle>
            <CardDescription className="text-lg">
              No worries! Your payment was cancelled and no charges were made.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {orderId && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Order ID:</strong> {orderId.slice(0, 8)}...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  This order has been cancelled and can be retried anytime.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold text-center">What would you like to do?</h3>
              
              <div className="grid gap-3">
                <Link to="/#packages">
                  <Button className="w-full bg-gradient-to-r from-primary to-success hover:from-primary-hover hover:to-success">
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    Try Again - View Packages
                  </Button>
                </Link>
                
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                
                <Link to="/">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Return Home
                  </Button>
                </Link>
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="pt-6 border-t space-y-4">
              <h4 className="font-semibold text-center">Why Choose Our Ad Packages?</h4>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Professional design quality guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>24-hour delivery via email</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Commercial license included</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>No monthly fees - one-time purchase</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card className="enhanced-glass mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Need Help Deciding?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our team is here to help you choose the perfect ad package for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm">
                  View Examples
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancelled;