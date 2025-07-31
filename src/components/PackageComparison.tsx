import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PaymentModal from "./PaymentModal";
import { useToast } from "@/hooks/use-toast";

const packages = [
  {
    id: "starter",
    name: "Starter Package",
    price: 89,
    originalPrice: 299,
    description: "Perfect for new businesses",
    badge: null,
    features: [
      "5 Professional Ad Cards",
      "High-Resolution Downloads",
      "Commercial License",
      "Email Support",
      "24-Hour Delivery"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    id: "professional", 
    name: "Professional Package",
    price: 197,
    originalPrice: 497,
    description: "Most popular choice",
    badge: { text: "MOST POPULAR", color: "primary" },
    features: [
      "15 Professional Ad Cards",
      "Multiple Format Options",
      "High-Resolution Downloads", 
      "Commercial License",
      "Priority Support",
      "24-Hour Delivery"
    ],
    buttonText: "Choose Professional",
    buttonVariant: "default" as const
  },
  {
    id: "enterprise",
    name: "Enterprise Package",
    price: 497,
    originalPrice: 997,
    description: "Complete marketing solution",
    badge: { text: "BEST VALUE", color: "success" },
    features: [
      "50 Professional Ad Cards",
      "Custom Landing Page",
      "Multiple Format Options",
      "High-Resolution Downloads",
      "Commercial License",
      "VIP Support",
      "Custom Branding Options",
      "24-Hour Delivery"
    ],
    buttonText: "Go Enterprise",
    buttonVariant: "default" as const
  }
];

const PackageComparison = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'professional' | 'enterprise' | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePurchase = (pkg: typeof packages[0]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase a package.",
        variant: "destructive",
      });
      return;
    }

    setSelectedPackage(pkg.id as 'starter' | 'professional' | 'enterprise');
    setShowPaymentModal(true);
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto" id="packages">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Choose Your Package
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Select the perfect package for your business needs. All packages include commercial licenses and instant download.
        </p>
        
        {/* Enhanced Savings Banner */}
        <div className="inline-flex items-center gap-2 enhanced-glass px-6 py-3 rounded-full text-success font-semibold animate-scale-bounce">
          <Zap className="w-5 h-5 animate-pulse" />
          Pre-Launch Special: Save up to 70% - Limited Time!
        </div>
      </div>

      {/* Enhanced Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12 stagger-animation">
        {packages.map((pkg, index) => (
          <Card 
            key={pkg.id}
            className={`enhanced-glass relative transition-all duration-300 hover:scale-105 hover:shadow-elegant ripple-button ${
              pkg.badge?.color === "primary" ? "ring-2 ring-primary ring-opacity-50" : ""
            }`}
          >
            {/* Badge */}
            {pkg.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge 
                  className={`px-4 py-1 font-bold text-xs ${
                    pkg.badge.color === "primary" ? "bg-primary text-primary-foreground" :
                    pkg.badge.color === "success" ? "bg-success text-success-foreground" :
                    "bg-warning text-warning-foreground"
                  }`}
                >
                  {pkg.badge.text}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                {index === 0 && <Star className="w-6 h-6 text-muted-foreground mr-2" />}
                {index === 1 && <Zap className="w-6 h-6 text-primary mr-2" />}
                {index === 2 && <Crown className="w-6 h-6 text-success mr-2" />}
                <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">${pkg.price}</span>
                  <span className="text-lg text-muted-foreground line-through">${pkg.originalPrice}</span>
                </div>
                <div className="text-sm text-success font-semibold">
                  Save ${pkg.originalPrice - pkg.price} ({Math.round((pkg.originalPrice - pkg.price) / pkg.originalPrice * 100)}% off)
                </div>
              </div>
              
              <p className="text-muted-foreground">{pkg.description}</p>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Features List */}
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={pkg.buttonVariant}
                className={`w-full font-semibold py-3 ripple-button transition-all duration-300 hover:scale-105 ${
                  pkg.buttonVariant === "default" 
                    ? "bg-gradient-to-r from-primary to-success hover:from-primary-hover hover:to-success text-white shadow-lg hover:shadow-primary-glow animate-gradient-shift" 
                    : "hover:shadow-md"
                }`}
                onClick={() => handlePurchase(pkg)}
              >
                {pkg.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Bottom CTA */}
      <div className="text-center enhanced-glass p-8 rounded-2xl animate-blur-fade">
        <h3 className="text-2xl font-bold mb-4">Not sure which package is right for you?</h3>
        <p className="text-muted-foreground mb-6">
          Try our free preview to see the quality of our ad cards, or contact our team for personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-animation">
          <Button variant="outline" size="lg" className="ripple-button transition-all duration-300 hover:scale-105">
            Free Preview
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-primary to-success text-white ripple-button transition-all duration-300 hover:scale-105 animate-gradient-shift">
            Contact Sales
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedPackage={selectedPackage || 'professional'}
      />
    </section>
  );
};

export default PackageComparison;