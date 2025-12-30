-- Create table for form submissions (leads)
CREATE TABLE public.form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'voorstel', 'lookbook', 'bespoke')),
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    honeypot TEXT, -- Spam prevention field
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy: Public insert (anyone can submit forms)
CREATE POLICY "Anyone can submit forms"
ON public.form_submissions
FOR INSERT
WITH CHECK (true);

-- Create policy: Only admins can view submissions (via service role)
-- No SELECT policy for anon - submissions are only accessible via backend

-- Create index for querying by form type and date
CREATE INDEX idx_form_submissions_type_created ON public.form_submissions (form_type, created_at DESC);

-- Create index for rate limiting by email
CREATE INDEX idx_form_submissions_email_created ON public.form_submissions (email, created_at DESC);