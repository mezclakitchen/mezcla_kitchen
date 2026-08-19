-- Leads table for Mezcla Circle / Newsletter
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    source VARCHAR(50) DEFAULT 'newsletter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow admin service role to read/write freely
CREATE POLICY "Enable read access for service role" ON public.leads FOR SELECT TO service_role USING (true);
CREATE POLICY "Enable write access for service role" ON public.leads FOR ALL TO service_role USING (true);
CREATE POLICY "Enable write access for anon" ON public.leads FOR INSERT TO anon WITH CHECK (true);
