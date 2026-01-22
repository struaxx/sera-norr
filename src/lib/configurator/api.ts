// ============================================
// Configurator API Client
// ============================================

import { supabase } from '@/integrations/supabase/client';
import type { ConfiguratorState, PriceEstimate } from './types';

const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sera-norr-session');
  if (!sessionId) {
    sessionId = `ses_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('sera-norr-session', sessionId);
  }
  return sessionId;
};

interface SaveConfigResponse {
  success: boolean;
  buildCode?: string;
  savedAt?: string;
  priceEstimate?: PriceEstimate;
  error?: string;
}

interface LoadConfigResponse {
  success: boolean;
  configuration?: ConfiguratorState;
  priceEstimate?: PriceEstimate;
  savedAt?: string;
  error?: string;
}

interface QuoteResponse {
  success: boolean;
  dossierRef?: string;
  message?: string;
  estimatedResponse?: string;
  error?: string;
}

/**
 * Save configuration to backend
 */
export async function saveConfiguration(config: ConfiguratorState): Promise<SaveConfigResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('configurator-api', {
      body: { configuration: config },
      headers: { 'x-session-id': getSessionId() },
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Save configuration error:', err);
    return { success: false, error: 'Configuratie kon niet worden opgeslagen' };
  }
}

/**
 * Load configuration by build code
 */
export async function loadConfiguration(buildCode: string): Promise<LoadConfigResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('configurator-api', {
      body: {},
      headers: { 'x-session-id': getSessionId() },
    });

    // Need to use query params for load action
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/configurator-api?action=load&buildCode=${encodeURIComponent(buildCode)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId(),
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      }
    );

    return await response.json();
  } catch (err) {
    console.error('Load configuration error:', err);
    return { success: false, error: 'Configuratie kon niet worden geladen' };
  }
}

/**
 * Calculate price on server (for verification)
 */
export async function calculatePriceServer(config: ConfiguratorState): Promise<PriceEstimate | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/configurator-api?action=calculate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ configuration: config }),
      }
    );

    const data = await response.json();
    if (data.success) {
      return {
        basePrice: data.basePrice,
        stoneMultiplier: 1,
        finishMultiplier: 1,
        edgeMultiplier: 1,
        baseMultiplier: 1,
        extrasTotal: data.breakdown?.extras ?? 0,
        totalEstimate: data.totalEstimate,
        priceRange: data.priceRange,
        disclaimer: 'Indicatie, definitieve prijs na intake',
      };
    }
    return null;
  } catch (err) {
    console.error('Calculate price error:', err);
    return null;
  }
}

/**
 * Submit quote request
 */
export async function requestQuote(request: {
  buildCode: string;
  configuration: ConfiguratorState;
  priceEstimate: { min: number; max: number; total: number };
  contact: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    notes?: string;
  };
  inspirationItems?: string[];
}): Promise<QuoteResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/configurator-api?action=quote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId(),
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(request),
      }
    );

    return await response.json();
  } catch (err) {
    console.error('Request quote error:', err);
    return { success: false, error: 'Aanvraag kon niet worden verzonden' };
  }
}
