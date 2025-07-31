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
    name: "Starter",
    price: 89.99,
    originalPrice: 179,
    description: "Perfect for small businesses just getting started",
    badge: null,
    features: [
      "1 Premium Ad Copy Clone",
      "Business Customization", 
      "48-Hour Delivery",
      "Commercial License",
      "Email Support"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    id: "professional", 
    name: "Business",
    price: 197,
    originalPrice: 397,
    description: "Most popular choice for growing businesses",
    badge: { text: "MOST POPULAR", color: "primary" },
    features: [
      "5 Premium Ad Copy Clones",
      "AI-Powered Business Analysis",
      "24-Hour Priority Delivery",
      "Advanced Design Options",
      "Priority Support", 
      "Commercial License",
      "Social Media Optimization"
    ],
    buttonText: "Launch Now", 
    buttonVariant: "default" as const
  },
  {
    id: "enterprise",
    name: "Enterprise", 
    price: 497,
    originalPrice: 997,
    description: "Complete solution for established businesses",
    badge: { text: "BEST VALUE", color: "success" },
    features: [
      "15 Premium Ad Copy Clones",
      "White-Label Branding Rights",
      "Dedicated Account Manager",
      "Advanced Analytics",
      "12-hour Delivery", 
      "Commercial License",
      "Unlimited Revisions",
      "Multi-platform Optimization"
    ],
    buttonText: "Level Up",
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
          Launch Ads That Print Money
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
        <h3 className="text-2xl font-bold mb-4">Ready to Launch Ads That Print Money?</h3>
        <p className="text-muted-foreground mb-6">
          Get your custom ad copy that converts browsers into buyers. Start printing money today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-animation">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-[#FF006E] to-[#FB5607] hover:from-[#FF006E]/90 hover:to-[#FB5607]/90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 animate-gradient-shift"
            onClick={() => window.location.href = '/preview'}
          >
            Get a Free Quote →
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