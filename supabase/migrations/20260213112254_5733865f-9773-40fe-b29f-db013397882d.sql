-- Fix 1: Restrict configurator_drafts SELECT to service_role only
-- (Edge functions use service_role and bypass RLS, so client reads are blocked)
DROP POLICY "Anyone can read drafts by build_code" ON public.configurator_drafts;

CREATE POLICY "Service role only can read drafts"
ON public.configurator_drafts
FOR SELECT
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Fix 2: Restrict configurator_drafts UPDATE to service_role only
DROP POLICY "Session owners can update their drafts" ON public.configurator_drafts;

CREATE POLICY "Service role only can update drafts"
ON public.configurator_drafts
FOR UPDATE
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);