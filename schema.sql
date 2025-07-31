-- 💾 BIZBOX.HOST SUPABASE SCHEMA BACKUP
-- Generated: 2024-01-31
-- Project: krirjygnsufvlipqhltt

-- users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE
);

-- leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  business_type TEXT,
  ad_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- purchases table
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  ad_id INTEGER,
  price NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- previews table
CREATE TABLE public.previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ad_id INTEGER,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.previews ENABLE ROW LEVEL SECURITY;

-- Create basic policies (allow all for now, tighten later)
CREATE POLICY "Allow all access" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all access" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow all access" ON public.purchases FOR ALL USING (true);
CREATE POLICY "Allow all access" ON public.previews FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_previews_email ON public.previews(email);
CREATE INDEX idx_previews_viewed_at ON public.previews(viewed_at);