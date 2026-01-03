/**
 * SERA NORR - Tracking Hook
 * Easy-to-use hook for integrating tracking across components
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  trackCollectionView,
  trackProductView,
  trackMaterialInterest,
  trackCTAClick,
  trackTopicView,
  trackFAQOpen,
  type ProductViewProps,
} from '@/lib/tracking';

// Map routes to page types
const getPageType = (pathname: string): string => {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/collections/')) return 'collection_detail';
  if (pathname === '/collections') return 'collections';
  if (pathname.startsWith('/product/')) return 'product_detail';
  if (pathname === '/bespoke') return 'bespoke';
  if (pathname === '/about') return 'about';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/materials') return 'materials';
  if (pathname.startsWith('/materials/')) return 'material_detail';
  if (pathname === '/voorstel') return 'proposal';
  if (pathname === '/lookbook') return 'lookbook';
  if (pathname === '/care') return 'care';
  if (pathname === '/journal') return 'journal';
  if (pathname === '/shipping') return 'shipping';
  if (pathname === '/privacy') return 'privacy';
  if (pathname === '/terms') return 'terms';
  return 'other';
};

/**
 * Hook for automatic page view tracking
 */
export const usePageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    const pageType = getPageType(location.pathname);
    trackPageView(pageType);
  }, [location.pathname]);
};

/**
 * Hook for collection page tracking
 */
export const useCollectionTracking = (collectionName: string | undefined) => {
  useEffect(() => {
    if (collectionName) {
      trackCollectionView(collectionName);
    }
  }, [collectionName]);
};

/**
 * Hook for product page tracking
 */
export const useProductTracking = (product: ProductViewProps | null) => {
  useEffect(() => {
    if (product) {
      trackProductView(product);
    }
  }, [product?.product_id]);
};

/**
 * Hook for CTA click tracking
 */
export const useCTATracking = () => {
  const trackProposal = useCallback(() => {
    trackCTAClick('proposal');
  }, []);
  
  const trackConsult = useCallback(() => {
    trackCTAClick('consult');
  }, []);
  
  const trackContact = useCallback(() => {
    trackCTAClick('contact');
  }, []);
  
  return { trackProposal, trackConsult, trackContact };
};

/**
 * Hook for material interest tracking
 */
export const useMaterialTracking = () => {
  const trackMaterial = useCallback((material: string) => {
    trackMaterialInterest(material);
  }, []);
  
  return { trackMaterial };
};

/**
 * Hook for topic view tracking (care/delivery/warranty pages)
 */
export const useTopicTracking = (topic: 'delivery' | 'warranty' | 'care' | null) => {
  useEffect(() => {
    if (topic) {
      trackTopicView(topic);
    }
  }, [topic]);
};

/**
 * Hook for FAQ tracking
 */
export const useFAQTracking = () => {
  const trackFAQ = useCallback((topic: string) => {
    trackFAQOpen(topic);
  }, []);
  
  return { trackFAQ };
};
