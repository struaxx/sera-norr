// GA4 Analytics Tracking
// Initialize by adding GA4 script to index.html with your measurement ID
// Updated: Lead form types extended

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Check if GA4 is available
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Track page view
export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (!isGtagAvailable()) return;
  
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// E-commerce: View item
export const trackViewItem = (product: {
  id: string;
  name: string;
  price: number;
  currency: string;
  category?: string;
}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'view_item', {
    currency: product.currency,
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      currency: product.currency,
      item_category: product.category || 'Stone Furniture',
    }],
  });
};

// E-commerce: Add to cart
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  variant?: string;
}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'add_to_cart', {
    currency: product.currency,
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      currency: product.currency,
      quantity: product.quantity,
      item_variant: product.variant,
      item_category: 'Stone Furniture',
    }],
  });
};

// E-commerce: Remove from cart
export const trackRemoveFromCart = (product: {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'remove_from_cart', {
    currency: product.currency,
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      currency: product.currency,
      quantity: product.quantity,
      item_category: 'Stone Furniture',
    }],
  });
};

// E-commerce: View cart
export const trackViewCart = (items: Array<{
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
}>) => {
  if (!isGtagAvailable()) return;

  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const currency = items[0]?.currency || 'EUR';

  window.gtag('event', 'view_cart', {
    currency,
    value: totalValue,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      currency: item.currency,
      quantity: item.quantity,
      item_category: 'Stone Furniture',
    })),
  });
};

// E-commerce: Begin checkout
export const trackBeginCheckout = (items: Array<{
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
}>) => {
  if (!isGtagAvailable()) return;

  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const currency = items[0]?.currency || 'EUR';

  window.gtag('event', 'begin_checkout', {
    currency,
    value: totalValue,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      currency: item.currency,
      quantity: item.quantity,
      item_category: 'Stone Furniture',
    })),
  });
};

// Lead form types
type LeadFormType = 'bespoke' | 'contact' | 'quote' | 'voorstel' | 'lookbook';

// Lead generation: Form submission
export const trackLeadSubmit = (
  formType: LeadFormType,
  details?: {
    productType?: string;
    estimatedValue?: number;
    stone?: string;
    budget?: string;
    interest?: string;
  }
) => {
  // Meta Pixel: het Lead-event waarop advertentiecampagnes optimaliseren.
  // Los van de gtag-guard — de pixel laadt onafhankelijk van GA (na consent).
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_category: formType,
      currency: 'EUR',
      value: details?.estimatedValue || 0,
    });
  }

  if (!isGtagAvailable()) return;

  window.gtag('event', 'generate_lead', {
    form_type: formType,
    currency: 'EUR',
    value: details?.estimatedValue || 0,
    product_type: details?.productType,
  });
};

// Custom: View collection
export const trackViewCollection = (collectionName: string) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'view_item_list', {
    item_list_id: collectionName.toLowerCase(),
    item_list_name: collectionName,
  });
};

// Custom: View material page
export const trackViewMaterial = (materialName: string) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'view_content', {
    content_type: 'material',
    content_id: materialName.toLowerCase(),
    content_name: materialName,
  });
};

// Custom: Configurator interaction
export const trackConfiguratorStart = () => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'configurator_start', {
    event_category: 'engagement',
  });
};

export const trackConfiguratorComplete = (configuration: {
  material: string;
  dimensions: string;
  finish: string;
}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'configurator_complete', {
    event_category: 'engagement',
    material: configuration.material,
    dimensions: configuration.dimensions,
    finish: configuration.finish,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (percentage: number) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'scroll', {
    percent_scrolled: percentage,
  });
};

// Engagement: Click CTA
export const trackCTAClick = (ctaName: string, destination?: string) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'cta_click', {
    cta_name: ctaName,
    destination: destination,
    event_category: 'engagement',
  });
};
