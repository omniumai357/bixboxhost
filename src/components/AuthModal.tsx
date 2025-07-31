import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Zap } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'default-password-123',
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // Create new user if login fails
        const randomPassword = password || crypto.randomUUID();
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: randomPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          alert('Failed to create account: ' + signUpError.message);
          setIsSubmitting(false);
          return;
        }
      }

      // Store email for preview personalization
      localStorage.setItem('userEmail', email);

      // Track lead in database
      await supabase.from('leads').upsert({
        email,
        status: 'preview_requested',
      });

      // Close modal and navigate to preview
      onClose();
      window.location.href = '/preview';
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md enhanced-glass animate-scale-bounce">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
            Get My Custom Ads
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 stagger-animation">
          <p className="text-muted-foreground">
            Instant access in 60 seconds. See exactly what your business ads will look like.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.business@email.com"
                className="transition-all duration-300 focus:scale-105"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Create Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank for auto-generated"
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-success hover:from-primary-hover hover:to-success text-white font-semibold py-3 ripple-button transition-all duration-300 hover:scale-105 animate-gradient-shift"
            >
              {isSubmitting ? (
                'Processing...'
              ) : (
                <>
                  Get My Ads Preview
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;