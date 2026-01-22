// ============================================
// /bespoke now redirects to /atelier
// This preserves SEO and prevents broken links
// ============================================

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Bespoke() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Preserve any query params during redirect
    const queryString = searchParams.toString();
    const targetUrl = queryString ? `/atelier?${queryString}` : '/atelier';
    navigate(targetUrl, { replace: true });
  }, [navigate, searchParams]);

  // Return null - user will be redirected immediately
  return null;
}
