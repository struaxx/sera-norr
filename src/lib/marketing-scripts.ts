/**
 * SERA NORR - Marketing Scripts Manager
 * Loads Meta/Google scripts only with marketing consent
 */

import { getConsent } from './consent';
import { getSegmentData } from './intent';

let scriptsLoaded = false;

/**
 * Load Google Analytics / Tag Manager
 */
const loadGoogleScripts = (): void => {
  // Check if already loaded
  if (document.querySelector('script[src*="googletagmanager"]')) {
    return;
  }
  
  // Google Tag Manager would be loaded here
  // Note: GA4 measurement ID should be configured in environment
  const gaId = import.meta.env.VITE_GA4_ID;
  
  if (!gaId) {
    console.warn('[Marketing] GA4 ID not configured');
    return;
  }
  
  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    anonymize_ip: true,
    send_page_view: false, // We handle page views manually
  });
};

/**
 * Load Meta Pixel
 */
const loadMetaPixel = (): void => {
  // Check if already loaded
  if (window.fbq) {
    return;
  }
  
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  
  if (!pixelId) {
    console.warn('[Marketing] Meta Pixel ID not configured');
    return;
  }
  
  // Meta Pixel base code
  (function(f: Window, b: Document, e: string, v: string) {
    const n = f.fbq = function(...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod.apply(n, args);
      } else {
        n.queue.push(args);
      }
    } as typeof window.fbq;
    
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    
    const s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  
  window.fbq('init', pixelId);
};

/**
 * Initialize marketing scripts based on consent
 */
export const initMarketingScripts = (): void => {
  const consent = getConsent();
  
  if (!consent.marketing) {
    return;
  }
  
  if (scriptsLoaded) {
    return;
  }
  
  loadGoogleScripts();
  loadMetaPixel();
  
  scriptsLoaded = true;
};

/**
 * Send segment event to marketing platforms
 * Only sends aggregate segment data, not raw browsing logs
 */
export const sendMarketingSegmentEvent = (): void => {
  const consent = getConsent();
  
  if (!consent.marketing) {
    return;
  }
  
  const segmentData = getSegmentData();
  
  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'user_segment', {
      intent_level: segmentData.intentLevel,
      travertine_interest: segmentData.interests.travertine,
      viola_interest: segmentData.interests.viola,
      custom_interest: segmentData.interests.custom,
    });
  }
  
  // Send to Meta Pixel
  if (window.fbq) {
    window.fbq('trackCustom', 'UserSegment', {
      intent_level: segmentData.intentLevel,
      interests: Object.keys(segmentData.interests).filter(
        (key) => segmentData.interests[key as keyof typeof segmentData.interests]
      ),
    });
  }
};

/**
 * Handle consent change - stop tracking if opt-out
 */
export const handleConsentChange = (): void => {
  const consent = getConsent();
  
  if (consent.marketing && !scriptsLoaded) {
    initMarketingScripts();
  }
  
  // Note: Full removal of marketing scripts on opt-out would require page reload
  // For now, we just stop sending new events
};

// Listen for consent changes
if (typeof window !== 'undefined') {
  window.addEventListener('consent-change', handleConsentChange);
}

// Type declarations
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      push: (...args: unknown[]) => void;
      loaded: boolean;
      version: string;
    };
    _fbq?: typeof window.fbq;
  }
}
