-- Add explicit SELECT policy to form_submissions table for service_role only
-- This hardens security by documenting intent and preventing accidental exposure

CREATE POLICY "Service role only can read form submissions"
ON public.form_submissions
FOR SELECT
USING (auth.jwt() ->> 'role' = 'service_role');