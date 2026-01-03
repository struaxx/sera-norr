/**
 * SERA NORR - Session Management Module
 * Generates and manages pseudonymous session IDs
 */

const SESSION_KEY = 'seranorr_session';
const SESSION_EXPIRY_DAYS = 30;

interface SessionData {
  id: string;
  createdAt: number;
  lastActivity: number;
}

/**
 * Generate a random UUID v4
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Check if session is expired (30 days of inactivity)
 */
const isSessionExpired = (session: SessionData): boolean => {
  const expiryMs = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - session.lastActivity > expiryMs;
};

/**
 * Get or create session
 */
export const getSession = (): SessionData => {
  if (typeof window === 'undefined') {
    return {
      id: generateUUID(),
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };
  }

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    
    if (stored) {
      const session: SessionData = JSON.parse(stored);
      
      // Check if expired
      if (isSessionExpired(session)) {
        // Create new session
        return createNewSession();
      }
      
      // Update last activity
      session.lastActivity = Date.now();
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    }
    
    return createNewSession();
  } catch {
    return createNewSession();
  }
};

/**
 * Create a new session
 */
const createNewSession = (): SessionData => {
  const session: SessionData = {
    id: generateUUID(),
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };
  
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage not available
  }
  
  return session;
};

/**
 * Get session ID
 */
export const getSessionId = (): string => {
  return getSession().id;
};

/**
 * Update session activity
 */
export const updateSessionActivity = (): void => {
  getSession(); // This automatically updates lastActivity
};

/**
 * Get device type based on viewport
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Get UTM parameters from URL
 */
export const getUTMParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });
  
  return utmParams;
};

/**
 * Get referrer (sanitized)
 */
export const getReferrer = (): string => {
  if (typeof window === 'undefined') return '';
  
  try {
    const referrer = document.referrer;
    if (!referrer) return '';
    
    // Only return domain, not full URL for privacy
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return '';
  }
};
