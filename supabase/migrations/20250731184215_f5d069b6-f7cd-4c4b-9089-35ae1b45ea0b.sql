-- PHASE 1A: DATABASE FOUNDATION REPAIR
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all access" ON public.users;
DROP POLICY IF EXISTS "Allow all access" ON public.leads;
DROP POLICY IF EXISTS "Allow all access" ON public.purchases;
DROP POLICY IF EXISTS "Allow all access" ON public.previews;

-- Create profiles table for user business data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  target_audience TEXT,
  marketing_budget TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table for payment tracking (enhanced from purchases)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  package_type TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  business_data JSONB, -- Store package-specific business details
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ad_templates table for ad management
CREATE TABLE public.ad_templates (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- plumbing, electrical, landscaping, etc.
  template_data JSONB NOT NULL, -- Ad template structure and placeholders
  asset_urls TEXT[], -- Array of image/video URLs
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create downloads table for tracking user downloads
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  ad_template_id INTEGER REFERENCES public.ad_templates(id),
  download_url TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  downloaded_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create proper RLS policies for orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update orders" ON public.orders
  FOR UPDATE USING (true); -- Allow system updates for payment processing

-- Create proper RLS policies for ad_templates (public read)
CREATE POLICY "Ad templates are publicly readable" ON public.ad_templates
  FOR SELECT USING (is_active = true);

-- Create proper RLS policies for downloads
CREATE POLICY "Users can view own downloads" ON public.downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own downloads" ON public.downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix existing table policies with proper user-specific access
CREATE POLICY "Users can view own user record" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own user record" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System can create user records" ON public.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can create previews" ON public.previews
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, business_name, business_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'business_name',
    NEW.raw_user_meta_data->>'business_type'
  );
  
  -- Also create record in users table for compatibility
  INSERT INTO public.users (id, email, is_premium, created_at)
  VALUES (NEW.id, NEW.email, false, now())
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_templates_updated_at
  BEFORE UPDATE ON public.ad_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create performance indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX idx_downloads_order_id ON public.downloads(order_id);
CREATE INDEX idx_ad_templates_category ON public.ad_templates(category);
CREATE INDEX idx_ad_templates_active ON public.ad_templates(is_active);

-- Insert sample ad templates
INSERT INTO public.ad_templates (name, category, template_data, asset_urls) VALUES
('Professional Plumbing Service', 'plumbing', '{"headline": "Need a Plumber? Call {business_name}!", "description": "Professional plumbing services in {city}. Licensed, insured, and available 24/7.", "cta": "Call Now: {phone}"}', ARRAY['/ad-plumbing.jpg']),
('Expert Electrical Work', 'electrical', '{"headline": "Electrical Problems? {business_name} Solves Them!", "description": "Certified electricians serving {city} and surrounding areas. Free estimates!", "cta": "Get Quote: {phone}"}', ARRAY['/ad-electrical.jpg']),
('Landscaping & Lawn Care', 'landscaping', '{"headline": "Transform Your Yard with {business_name}", "description": "Professional landscaping services in {city}. From design to maintenance.", "cta": "Schedule: {phone}"}', ARRAY['/ad-landscaping.jpg']),
('Handyman Services', 'handyman', '{"headline": "Reliable Handyman: {business_name}", "description": "Home repairs and improvements in {city}. No job too small!", "cta": "Book Today: {phone}"}', ARRAY['/ad-handyman.jpg']),
('Construction Company', 'construction', '{"headline": "Quality Construction by {business_name}", "description": "Building dreams in {city}. Residential and commercial projects.", "cta": "Free Estimate: {phone}"}', ARRAY['/ad-construction.jpg']),
('Cleaning Services', 'cleaning', '{"headline": "Spotless Cleaning by {business_name}", "description": "Professional cleaning services in {city}. Residential and commercial.", "cta": "Book Cleaning: {phone}"}', ARRAY['/ad-cleaning.jpg']);