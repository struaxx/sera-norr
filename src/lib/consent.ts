/**
 * SERA NORR - Consent Management Module
 * Privacy-first consent handling with categories: Necessary, Analytics, Marketing
 */

export interface ConsentState {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CONSENT_KEY = 'seranorr_consent';
const CONSENT_VERSION = 1;

// Default consent state - only necessary enabled by default
const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

/**
 * Get current consent state from localStorage
 */
export const getConsent = (): ConsentState => {
  if (typeof window === 'undefined') return defaultConsent;
  
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return defaultConsent;
    
    const parsed = JSON.parse(stored);
    // Ensure necessary is always true
    return {
      ...defaultConsent,
      ...parsed,
      necessary: true,
    };
  } catch {
    return defaultConsent;
  }
};

/**
 * Check if user has made a consent decision
 */
export const hasConsentDecision = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored !== null;
  } catch {
    return false;
  }
};

/**
 * Save consent state to localStorage
 */
export const setConsent = (consent: Partial<ConsentState>): ConsentState => {
  const newConsent: ConsentState = {
    ...getConsent(),
    ...consent,
    necessary: true, // Always ensure necessary is true
    timestamp: Date.now(),
  };
  
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      ...newConsent,
      version: CONSENT_VERSION,
    }));
  } catch {
    // localStorage not available
  }
  
  // Notify listeners of consent change
  window.dispatchEvent(new CustomEvent('consent-change', { detail: newConsent }));
  
  return newConsent;
};

/**
 * Accept all consent categories
 */
export const acceptAll = (): ConsentState => {
  return setConsent({
    necessary: true,
    analytics: true,
    marketing: true,
  });
};

/**
 * Accept only necessary cookies
 */
export const acceptNecessaryOnly = (): ConsentState => {
  return setConsent({
    necessary: true,
    analytics: false,
    marketing: false,
  });
};

/**
 * Reset consent (for testing or preference management)
 */
export const resetConsent = (): void => {
  try {
    localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent('consent-change', { detail: defaultConsent }));
  } catch {
    // localStorage not available
  }
};

/**
 * Consent object for easy access in components
 */
export const consent = {
  get analytics() {
    return getConsent().analytics;
  },
  get marketing() {
    return getConsent().marketing;
  },
  get necessary() {
    return true;
  },
};
