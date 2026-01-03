/**
 * SERA NORR - First-Party Event Tracking Module
 * Privacy-safe tracking with consent management
 */

import { getConsent } from './consent';
import { getSessionId, getDeviceType, getUTMParams, getReferrer } from './session';
import { 
  recordProductView, 
  recordTopicView, 
  recordCTAClick, 
  recordFormSubmit,
  recordMaterialInterest,
  recordSizeInterest,
  recordCustomPageView,
  recordCustomCTAClick,
  getSegmentData 
} from './intent';
import { supabase } from '@/integrations/supabase/client';

// Event types (max 12 core events)
export type EventName =
  | 'page_view'
  | 'collection_view'
  | 'product_view'
  | 'material_interest'
  | 'size_range_interest'
  | 'cta_click'
  | 'lookbook_open'
  | 'lookbook_submit'
  | 'form_start'
  | 'form_submit'
  | 'topic_view'
  | 'faq_open';

// Event property types
export interface PageViewProps {
  page_type: string;
}

export interface CollectionViewProps {
  collection_name: string;
}

export interface ProductViewProps {
  product_id: string;
  material?: string;
  shape?: string;
  size_range?: string;
}

export interface MaterialInterestProps {
  material: string;
}

export interface SizeRangeInterestProps {
  range: string;
}

export interface CTAClickProps {
  cta_type: 'proposal' | 'consult' | 'contact';
}

export interface LookbookOpenProps {
  source: string;
}

export interface LookbookSubmitProps {
  email_opt_in: boolean;
  marketing_opt_in: boolean;
}

export interface FormStartProps {
  form_type: string;
}

export interface FormSubmitProps {
  form_type: string;
}

export interface TopicViewProps {
  topic: 'delivery' | 'warranty' | 'care';
}

export interface FAQOpenProps {
  topic: string;
}

type EventProperties = 
  | PageViewProps 
  | CollectionViewProps 
  | ProductViewProps 
  | MaterialInterestProps
  | SizeRangeInterestProps
  | CTAClickProps
  | LookbookOpenProps
  | LookbookSubmitProps
  | FormStartProps
  | FormSubmitProps
  | TopicViewProps
  | FAQOpenProps
  | Record<string, unknown>;

// Debug mode - disable in production
const DEBUG_MODE = import.meta.env.DEV;

/**
 * Log debug information (only in development)
 */
const debugLog = (message: string, data?: unknown): void => {
  if (DEBUG_MODE) {
    console.log(`[SERA NORR Tracking] ${message}`, data || '');
  }
};

/**
 * Build base event payload with automatic properties
 */
const buildEventPayload = (eventName: EventName, properties: EventProperties) => {
  return {
    event_name: eventName,
    properties: {
      ...properties,
      session_id: getSessionId(),
      timestamp: new Date().toISOString(),
      page_url: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: getReferrer(),
      device_type: getDeviceType(),
      ...getUTMParams(),
    },
  };
};

/**
 * Send event to first-party endpoint
 */
const sendEvent = async (eventName: EventName, properties: EventProperties): Promise<void> => {
  const consent = getConsent();
  
  // Only send if analytics consent is given
  if (!consent.analytics) {
    debugLog(`Event blocked (no analytics consent): ${eventName}`);
    return;
  }
  
  const payload = buildEventPayload(eventName, properties);
  
  debugLog(`Sending event: ${eventName}`, payload);
  
  try {
    const { error } = await supabase.functions.invoke('track-events', {
      body: payload,
    });
    
    if (error) {
      debugLog(`Event send failed: ${eventName}`, error);
    }
  } catch (err) {
    debugLog(`Event send error: ${eventName}`, err);
  }
};

/**
 * Main tracking function
 */
export const track = (eventName: EventName, properties: EventProperties = {}): void => {
  // Update intent scoring based on event type
  switch (eventName) {
    case 'product_view':
      const productProps = properties as ProductViewProps;
      recordProductView(productProps.product_id);
      if (productProps.material) {
        recordMaterialInterest(productProps.material);
      }
      if (productProps.size_range) {
        recordSizeInterest(productProps.size_range);
      }
      break;
      
    case 'material_interest':
      const materialProps = properties as MaterialInterestProps;
      recordMaterialInterest(materialProps.material);
      break;
      
    case 'size_range_interest':
      const sizeProps = properties as SizeRangeInterestProps;
      recordSizeInterest(sizeProps.range);
      break;
      
    case 'topic_view':
      const topicProps = properties as TopicViewProps;
      recordTopicView(topicProps.topic);
      break;
      
    case 'cta_click':
      const ctaProps = properties as CTAClickProps;
      recordCTAClick(ctaProps.cta_type);
      
      // Check for custom interest
      if (ctaProps.cta_type === 'proposal') {
        recordCustomCTAClick();
      }
      break;
      
    case 'form_submit':
      const formProps = properties as FormSubmitProps;
      recordFormSubmit(formProps.form_type);
      break;
      
    case 'page_view':
      const pageProps = properties as PageViewProps;
      if (pageProps.page_type === 'bespoke' || pageProps.page_type === 'custom') {
        recordCustomPageView();
      }
      break;
  }
  
  // Send to backend
  sendEvent(eventName, properties);
};

/**
 * Identify user after email opt-in
 */
export const identify = async (email: string, marketingOptIn: boolean): Promise<void> => {
  const consent = getConsent();
  
  if (!consent.analytics) {
    debugLog('Identify blocked (no analytics consent)');
    return;
  }
  
  const segmentData = getSegmentData();
  
  const payload = {
    email,
    marketing_opt_in: marketingOptIn,
    session_id: getSessionId(),
    ...segmentData,
  };
  
  debugLog('Identifying user', payload);
  
  try {
    const { error } = await supabase.functions.invoke('identify-user', {
      body: payload,
    });
    
    if (error) {
      debugLog('Identify failed', error);
    }
  } catch (err) {
    debugLog('Identify error', err);
  }
};

/**
 * Send segment events to marketing platforms (only with marketing consent)
 */
export const sendMarketingSegment = async (): Promise<void> => {
  const consent = getConsent();
  
  if (!consent.marketing) {
    debugLog('Marketing segment blocked (no marketing consent)');
    return;
  }
  
  const segmentData = getSegmentData();
  
  // Only send aggregate segment data, not raw browsing logs
  const marketingPayload = {
    intent_level: segmentData.intentLevel,
    interests: {
      travertine: segmentData.interests.travertine,
      viola: segmentData.interests.viola,
      custom: segmentData.interests.custom,
    },
  };
  
  debugLog('Sending marketing segment', marketingPayload);
  
  // Integration with Meta/Google would happen here via their APIs
  // For now, we just log the data
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'segment_update', marketingPayload);
  }
};

// Export convenience functions for specific events
export const trackPageView = (pageType: string) => 
  track('page_view', { page_type: pageType });

export const trackCollectionView = (collectionName: string) => 
  track('collection_view', { collection_name: collectionName });

export const trackProductView = (props: ProductViewProps) => 
  track('product_view', props);

export const trackMaterialInterest = (material: string) => 
  track('material_interest', { material });

export const trackSizeRangeInterest = (range: string) => 
  track('size_range_interest', { range });

export const trackCTAClick = (ctaType: 'proposal' | 'consult' | 'contact') => 
  track('cta_click', { cta_type: ctaType });

export const trackLookbookOpen = (source: string) => 
  track('lookbook_open', { source });

export const trackLookbookSubmit = (emailOptIn: boolean, marketingOptIn: boolean) => 
  track('lookbook_submit', { email_opt_in: emailOptIn, marketing_opt_in: marketingOptIn });

export const trackFormStart = (formType: string) => 
  track('form_start', { form_type: formType });

export const trackFormSubmit = (formType: string) => 
  track('form_submit', { form_type: formType });

export const trackTopicView = (topic: 'delivery' | 'warranty' | 'care') => 
  track('topic_view', { topic });

export const trackFAQOpen = (topic: string) => 
  track('faq_open', { topic });
