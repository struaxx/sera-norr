-- Fix overly permissive RLS policies on user_profiles and analytics_events tables
-- These policies currently use USING(true) which allows anyone with anon key to access data

-- Drop the incorrect policy on user_profiles
DROP POLICY IF EXISTS "Service role can manage user_profiles" ON public.user_profiles;

-- Create correct restrictive policy that checks for service_role
CREATE POLICY "Service role only access to user_profiles" 
ON public.user_profiles
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Drop the incorrect policy on analytics_events
DROP POLICY IF EXISTS "Service role can manage analytics_events" ON public.analytics_events;

-- Create correct restrictive policy that checks for service_role
CREATE POLICY "Service role only access to analytics_events" 
ON public.analytics_events
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');