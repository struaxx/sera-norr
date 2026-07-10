// Public Supabase connection details.
//
// These are safe to expose in the browser: the "publishable" (anon) key is
// designed to be shipped in the client bundle and is already present in the
// public production build. The values fall back to the SERA NORR project so the
// site builds and runs without any environment configuration (handy for simple
// static hosts). To point the site at your own Supabase backend, set the
// VITE_SUPABASE_* environment variables at build time.

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://unngatxeencjfnqaqbld.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVubmdhdHhlZW5jamZucWFxYmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMjA0NjIsImV4cCI6MjA4MjY5NjQ2Mn0.vE8UnlmFPl93GHhKZpb1b_m7pLfit2tyvS7wBh8v_YU";
