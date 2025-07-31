-- Fix security warnings by setting search_path for functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';