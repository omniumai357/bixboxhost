-- Fix critical security vulnerabilities by adding proper admin access controls

-- Create admin-only SELECT policy for leads table
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email IN ('admin@bizbox.host', 'support@bizbox.host')
  )
);

-- Create admin-only SELECT policy for previews table  
CREATE POLICY "Admins can view all previews"
ON public.previews
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email IN ('admin@bizbox.host', 'support@bizbox.host')
  )
);

-- Create admin-only UPDATE policy for leads table
CREATE POLICY "Admins can update leads"
ON public.leads
FOR UPDATE  
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email IN ('admin@bizbox.host', 'support@bizbox.host')
  )
);

-- Create admin-only UPDATE policy for previews table
CREATE POLICY "Admins can update previews"
ON public.previews  
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email IN ('admin@bizbox.host', 'support@bizbox.host')
  )
);

-- Add admin role column to profiles for better admin management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create index for better performance on admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email_auth ON public.profiles(email) WHERE role = 'admin';