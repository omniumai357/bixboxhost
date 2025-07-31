import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-business-ads.jpg";

const Preview = () => {
  const [businessName, setBusinessName] = useState('Your Business');
  const [previewAd, setPreviewAd] = useState<any>(null);

  useEffect(() => {
    // Check if specific ad was previewed
    const storedAd = localStorage.getItem('previewAd');
    if (storedAd) {
      const ad = JSON.parse(storedAd);
      setPreviewAd(ad);
    }

    // Extract business name from email or use default
    const email = localStorage.getItem('userEmail') || 'user@business.com';
    const domain = email.split('@')[1];
    const name = domain ? domain.split('.')[0] : email.split('@')[0];
    setBusinessName(name.charAt(0).toUpperCase() + name.slice(1));

    // Track preview view
    const trackView = async () => {
      try {
        await supabase.from('previews').insert({
          email: email,
          ad_id: previewAd?.id || 1,
          converted: false,
        });
      } catch (error) {
        console.error('Error tracking preview:', error);
      }
    };

    trackView();
  }, []);

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 py-12">
        <div className="container mx-auto px-4 text-center stagger-animation">
          <div className="inline-flex items-center gap-2 enhanced-glass px-6 py-2 rounded-full mb-6 animate-scale-bounce">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-semibold">Custom Preview Generated</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 animate-gradient-shift">
            Your Custom Ad Preview
          </h1>
          <p className="text-xl text-muted-foreground">
            Personalized for <span className="font-semibold text-primary">{businessName}</span>
          </p>
        </div>
      </div>

      {/* Preview Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto stagger-animation">
          {/* Enhanced Sample Ad Card */}
          <Card className="enhanced-glass mb-8 overflow-hidden hover:scale-105 transition-all duration-500">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={previewAd?.image || heroImage}
                  alt="Custom Ad Preview"
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{businessName}</h3>
                    <p className="text-lg opacity-90">
                      {previewAd?.title || "Professional Services That Deliver Results"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>High-Converting Design</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>AI-Optimized</span>
                  </div>
                  {previewAd && (
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-semibold">${previewAd.price}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 stagger-animation">
            <Card className="enhanced-glass text-center p-6 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2 animate-pulse">16+</div>
              <div className="text-muted-foreground">Premium Ad Variants</div>
            </Card>
            <Card className="enhanced-glass text-center p-6 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-success mb-2 animate-pulse">Pro</div>
              <div className="text-muted-foreground">Quality Design</div>
            </Card>
            <Card className="enhanced-glass text-center p-6 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-warning mb-2 animate-pulse">24h</div>
              <div className="text-muted-foreground">Delivery Time</div>
            </Card>
          </div>

          {/* Enhanced Upgrade CTA */}
          <Card className="enhanced-glass text-center p-8 animate-blur-fade">
            <h2 className="text-3xl font-bold gradient-text mb-4 animate-gradient-shift">Ready to Launch?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              This is just a sample. Upgrade now to unlock your complete ad suite with 16+ variants, 
              custom branding, and professional templates designed specifically for {businessName}.
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-6 text-success font-semibold animate-scale-bounce">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>70% OFF - Pre-Launch Special</span>
            </div>
            
            <Button
              onClick={handleUpgrade}
              size="lg"
              className="bg-gradient-to-r from-primary to-success hover:from-primary-hover hover:to-success text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 ripple-button animate-gradient-shift"
            >
              Upgrade Now - Get Full Suite
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Instant download • Commercial license included
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Preview;