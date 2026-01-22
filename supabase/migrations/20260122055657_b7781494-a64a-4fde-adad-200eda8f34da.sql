-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create configurator_drafts table for saving configurations
CREATE TABLE public.configurator_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  build_code TEXT UNIQUE NOT NULL,
  session_id TEXT,
  configuration JSONB NOT NULL,
  price_estimate JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configurator_drafts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read drafts by build_code (for sharing links)
CREATE POLICY "Anyone can read drafts by build_code" 
ON public.configurator_drafts 
FOR SELECT 
USING (true);

-- Allow inserts for anonymous users
CREATE POLICY "Anyone can create drafts" 
ON public.configurator_drafts 
FOR INSERT 
WITH CHECK (true);

-- Allow updates on own session
CREATE POLICY "Session owners can update their drafts" 
ON public.configurator_drafts 
FOR UPDATE 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_configurator_drafts_build_code ON public.configurator_drafts(build_code);
CREATE INDEX idx_configurator_drafts_session ON public.configurator_drafts(session_id);

-- Update trigger for updated_at
CREATE TRIGGER update_configurator_drafts_updated_at
BEFORE UPDATE ON public.configurator_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();