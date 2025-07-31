import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Star, Zap, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const packages = [
  {
    id: "startup",
    name: "Startup",
    price: 49,
    originalPrice: 149,
    description: "Perfect for new businesses",
    badge: null,
    features: [
      "8 Professional Ad Cards",
      "Free Preview Access",
      "Basic Website Template",
      "Commercial License",
      "Email Support"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    id: "enterprise", 
    name: "Enterprise",
    price: 97,
    originalPrice: 297,
    description: "Most popular choice",
    badge: { text: "MOST POPULAR", color: "primary" },
    features: [
      "16 Premium Ad Cards",
      "Free Preview Access", 
      "Pro Website Template",
      "Priority Email Support",
      "Commercial License",
      "A/B Testing Guide"
    ],
    buttonText: "Choose Enterprise",
    buttonVariant: "default" as const
  },
  {
    id: "gold",
    name: "Gold Pro",
    price: 197,
    originalPrice: 597,
    description: "Complete marketing solution",
    badge: { text: "BEST VALUE", color: "success" },
    features: [
      "48 Premium Ad Cards",
      "3 Multilingual Text Ads",
      "2 Holiday Season Ads",
      "Custom Domain (1 Year)",
      "Professional Hosting",
      "Priority Phone Support",
      "Analytics Dashboard",
      "White-label Rights"
    ],
    buttonText: "Go Premium",
    buttonVariant: "default" as const
  },
  {
    id: "platinum",
    name: "Platinum Elite",
    price: 497,
    originalPrice: 1497,
    description: "Ultimate business package",
    badge: { text: "ULTIMATE", color: "warning" },
    features: [
      "60 Premium Ad Cards",
      "5 Multilingual Text Ads", 
      "5 Holiday Season Ads",
      "Custom Domain (2 Years)",
      "Premium Hosting",
      "Dedicated Account Manager",
      "Advanced Analytics Pro",
      "White-label Rights",
      "Custom Branding",
      "API Access"
    ],
    buttonText: "Get Ultimate",
    buttonVariant: "default" as const
  }
];

const PackageComparison = () => {
  const [email, setEmail] = useState('');

  const handlePurchase = async (pkg: typeof packages[0]) => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    try {
      // Track purchase intent in database
      await supabase.from('purchases').insert({
        ad_id: parseInt(pkg.id, 10),
        price: pkg.price,
      });

      // Track lead
      await supabase.from('leads').upsert({
        email,
        status: 'purchase_intent',
        business_type: pkg.name,
      });

      // Manual fulfillment notification
      alert(`Order received! We'll contact ${email} within 24 hours to deliver your ${pkg.name} package.`);
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Something went wrong. Please try again.');
    }
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
        
        {/* Savings Banner */}
        <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full text-success font-semibold">
          <Zap className="w-5 h-5" />
          Pre-Launch Special: Save up to 70% - Limited Time!
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {packages.map((pkg, index) => (
          <Card 
            key={pkg.id}
            className={`glass-card relative transition-all duration-300 hover:scale-105 ${
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
                {index === 3 && <Crown className="w-6 h-6 text-warning mr-2" />}
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

              {/* Email Input */}
              <div className="mb-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your business email"
                  className="w-full"
                />
              </div>

              {/* CTA Button */}
              <Button
                variant={pkg.buttonVariant}
                className={`w-full font-semibold py-3 ${
                  pkg.buttonVariant === "default" 
                    ? "bg-gradient-to-r from-primary to-success hover:from-primary-hover hover:to-success text-white shadow-lg hover:shadow-primary-glow" 
                    : ""
                }`}
                onClick={() => handlePurchase(pkg)}
              >
                {pkg.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center glass-card p-8 rounded-2xl">
        <h3 className="text-2xl font-bold mb-4">Not sure which package is right for you?</h3>
        <p className="text-muted-foreground mb-6">
          Try our free preview to see the quality of our ad cards, or contact our team for personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg">
            Free Preview
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-primary to-success text-white">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PackageComparison;