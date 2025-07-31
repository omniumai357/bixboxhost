import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Building,
  Star
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: 'starter' | 'professional' | 'enterprise';
}

interface PackageInfo {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlight?: string;
}

const PACKAGES: Record<string, PackageInfo> = {
  starter: {
    name: 'Starter Package',
    price: 89,
    description: '5 Custom Ad Cards',
    features: [
      '5 Professional Ad Cards',
      'High-Resolution Downloads',
      'Commercial License',
      'Email Support'
    ]
  },
  professional: {
    name: 'Professional Package',
    price: 197,
    description: '15 Custom Ad Cards',
    features: [
      '15 Professional Ad Cards',
      'Multiple Format Options',
      'High-Resolution Downloads',
      'Commercial License',
      'Priority Support'
    ],
    highlight: 'Most Popular'
  },
  enterprise: {
    name: 'Enterprise Package',
    price: 497,
    description: '50 Custom Ad Cards + Landing Page',
    features: [
      '50 Professional Ad Cards',
      'Custom Landing Page',
      'Multiple Format Options',
      'High-Resolution Downloads',
      'Commercial License',
      'VIP Support',
      'Custom Branding Options'
    ],
    highlight: 'Best Value'
  }
};

const PaymentModal = ({ isOpen, onClose, selectedPackage = 'professional' }: PaymentModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPackage, setCurrentPackage] = useState(selectedPackage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [businessData, setBusinessData] = useState({
    businessName: '',
    industry: '',
    phone: '',
    website: ''
  });

  const packageInfo = PACKAGES[currentPackage];

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          packageType: currentPackage,
          businessData: businessData
        }
      });

      if (error) {
        throw error;
      }

      if (data.url === '#') {
        toast({
          title: "Demo Mode",
          description: data.message || "Stripe not configured - this is a demo",
        });
        return;
      }

      // Redirect to Stripe Checkout
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Opening secure checkout in a new tab...",
      });

      // Close modal after successful redirect
      onClose();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create payment session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl enhanced-glass animate-scale-bounce max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Package Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Choose Your Package</h3>
            
            <div className="space-y-3">
              {Object.entries(PACKAGES).map(([key, pkg]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    currentPackage === key 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setCurrentPackage(key as typeof currentPackage)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {pkg.name}
                          {pkg.highlight && (
                            <Badge className="bg-primary/20 text-primary">
                              {pkg.highlight}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${pkg.price}</div>
                        <div className="text-sm text-muted-foreground">one-time</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success" />
                          {feature}
                        </div>
                      ))}
                      {pkg.features.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{pkg.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Business Information & Checkout */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Business Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name *</Label>
                  <Input
                    id="business-name"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your Business Name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={businessData.industry}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g. Restaurant, Plumbing"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={businessData.website}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{packageInfo.name}</div>
                    <div className="text-sm text-muted-foreground">{packageInfo.description}</div>
                  </div>
                  <div className="text-xl font-bold">${packageInfo.price}</div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${packageInfo.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    One-time payment • No subscription
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !businessData.businessName}
                  className="w-full bg-gradient-to-r from-primary to-success hover:from-primary-hover hover:to-success text-white font-semibold py-3 ripple-button transition-all duration-300 hover:scale-105"
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard className="mr-2 w-4 h-4" />
                      Secure Checkout - ${packageInfo.price}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Instant Download
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Commercial License
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;