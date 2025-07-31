import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap, Star } from "lucide-react";
import heroImage from "@/assets/hero-business-ads.jpg";
import AuthModal from "./AuthModal";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 12,
    minutes: 45,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-purple-600/70 to-success/80"></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 enhanced-glass rounded-full float-animation"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 enhanced-glass rounded-full float-animation" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 enhanced-glass rounded-full float-animation" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-8 h-8 enhanced-glass rounded-full float-animation" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-14 h-14 enhanced-glass rounded-full float-animation" style={{ animationDelay: '1.5s' }}></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Enhanced Pre-Launch Badge */}
        <div className="inline-flex items-center gap-2 enhanced-glass px-6 py-3 rounded-full mb-8 text-white animate-scale-bounce">
          <Zap className="w-5 h-5 text-warning animate-pulse" />
          <span className="font-semibold">Pre-Launch Special - 70% OFF</span>
          <Star className="w-5 h-5 text-warning animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Professional Ad Cards
          <span className="block gradient-text">That Convert</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Get stunning, AI-powered advertising cards and landing pages for your service business. 
          No design skills needed. Start converting customers in minutes.
        </p>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-white/80">Businesses Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">98%</div>
            <div className="text-white/80">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">$2M+</div>
            <div className="text-white/80">Revenue Generated</div>
          </div>
        </div>

        {/* Enhanced Countdown Timer */}
        <div className="enhanced-glass p-8 rounded-2xl mb-8 max-w-2xl mx-auto animate-blur-fade">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-warning animate-pulse" />
            <span className="text-lg font-semibold text-foreground">Launch Special Ends In:</span>
          </div>
          <div className="flex items-center justify-center gap-6 stagger-animation">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="text-4xl font-bold text-primary mb-1 transition-all duration-500 hover:scale-110">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-success hover:from-primary-hover hover:to-success text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 ripple-button animate-gradient-shift"
            onClick={() => setIsModalOpen(true)}
          >
            Get My Custom Ads
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="enhanced-glass border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-4 text-lg rounded-full ripple-button transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = '#packages'}
          >
            View Packages
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex items-center justify-center gap-8 text-white/70">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Instant Download</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Commercial License</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
      
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default HeroSection;