-- Create analytics_events table for storing all tracking events
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_url TEXT,
  referrer TEXT,
  device_type TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_analytics_events_session ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Create user_profiles table for identified users
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  session_id TEXT,
  marketing_opt_in BOOLEAN DEFAULT false,
  intent_level TEXT DEFAULT 'low',
  intent_score INTEGER DEFAULT 0,
  last_viewed_product TEXT,
  interest_tags TEXT[] DEFAULT '{}',
  first_identified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for email lookups
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_intent_level ON public.user_profiles(intent_level);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for edge functions)
CREATE POLICY "Service role can manage analytics_events" ON public.analytics_events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage user_profiles" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);