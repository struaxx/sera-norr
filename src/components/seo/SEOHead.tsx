import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  noindex?: boolean;
  structuredData?: object;
  titleEn?: string;
  descriptionEn?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  type = 'website',
  image = 'https://sera-norr.com/og-image.jpg',
  noindex = false,
  structuredData,
  titleEn,
  descriptionEn,
}: SEOHeadProps) {
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'nl';
  const canonicalUrl = `https://sera-norr.com${location.pathname}`;
  const fullTitle = title.includes('SERA NORR') ? title : `${title} | SERA NORR`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);
    if (noindex) updateMeta('robots', 'noindex,nofollow');

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Hreflang links
    const updateHreflang = (hreflang: string, href: string) => {
      let link = document.querySelector(`link[hreflang="${hreflang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    const langParam = currentLang === 'en' ? '?lang=en' : '';
    updateHreflang('nl', canonicalUrl);
    updateHreflang('en', `${canonicalUrl}${canonicalUrl.includes('?') ? '&' : '?'}lang=en`);
    updateHreflang('x-default', canonicalUrl);

    // Open Graph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', type, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:image', image, true);
    updateMeta('og:site_name', 'SERA NORR', true);
    updateMeta('og:locale', currentLang === 'nl' ? 'nl_NL' : 'en_GB', true);
    updateMeta('og:locale:alternate', currentLang === 'nl' ? 'en_GB' : 'nl_NL', true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Structured data
    if (structuredData) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[data-seo="structured-data"]');
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'structured-data');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup structured data on unmount
      const existingScript = document.querySelector('script[data-seo="structured-data"]');
      if (existingScript) existingScript.remove();
    };
  }, [fullTitle, description, keywords, type, image, canonicalUrl, noindex, structuredData, currentLang]);

  return null;
}

// Organization structured data for the site with stable @id
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://sera-norr.com/#organization',
  name: 'SERA NORR',
  alternateName: 'SERA NORR Online Atelier',
  url: 'https://sera-norr.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://sera-norr.com/logo.png',
    caption: 'SERA NORR logo',
  },
  image: 'https://sera-norr.com/og-image.jpg',
  description: 'SERA NORR is een online atelier voor maatwerk meubels in natuursteen (travertin, marmer en geselecteerde steensoorten). Ontworpen in Nederland.',
  slogan: 'Online atelier voor maatwerk natuursteenmeubels',
  foundingLocation: {
    '@type': 'Place',
    name: 'Nederland',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Netherlands',
  },
  contactPoint: {
    '@type': 'ContactPoint',
  email: 'info@sera-norr.com',
  telephone: '+31 6 83 99 11 58',
    contactType: 'customer service',
    availableLanguage: ['Dutch', 'English'],
  },
  sameAs: [
    'https://www.instagram.com/seranorr/',
    'https://www.pinterest.com/seranorr/',
  ],
  knowsAbout: [
    'Natural stone furniture',
    'Bespoke furniture design',
    'Travertine tables',
    'Marble furniture',
    'Calacatta Viola marble',
  ],
};

// WebSite structured data with stable @id
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://sera-norr.com/#website',
  name: 'SERA NORR',
  alternateName: 'SERA NORR Online Atelier',
  url: 'https://sera-norr.com',
  description: 'Online atelier voor maatwerk meubels in natuursteen. Travertin, marmer en geselecteerde steensoorten.',
  publisher: {
    '@id': 'https://sera-norr.com/#organization',
  },
  inLanguage: ['nl', 'en'],
};

// Combined base schema for all pages
export const baseSchema = {
  '@context': 'https://schema.org',
  '@graph': [organizationSchema, websiteSchema],
};

// Product structured data generator
export function generateProductSchema(product: {
  title: string;
  description: string;
  price: string;
  currency: string;
  image: string;
  handle: string;
  available?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    url: `https://sera-norr.com/product/${product.handle}`,
    brand: {
      '@type': 'Brand',
      name: 'SERA NORR',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.available 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'SERA NORR',
      },
    },
    material: 'Natural Stone',
    manufacturer: {
      '@type': 'Organization',
      name: 'SERA NORR',
    },
  };
}

// Breadcrumb structured data generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://sera-norr.com${item.url}`,
    })),
  };
}

// LocalBusiness schema for contact page (online atelier)
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': 'https://sera-norr.com/#business',
  name: 'SERA NORR Online Atelier',
  image: 'https://sera-norr.com/og-image.jpg',
  url: 'https://sera-norr.com',
  email: 'info@sera-norr.com',
  telephone: '+31 6 83 99 11 58',
  description: 'Online atelier voor maatwerk meubels in natuursteen. Travertin, marmer en geselecteerde steensoorten. Ontworpen in Nederland.',
  areaServed: {
    '@type': 'Country',
    name: 'Netherlands',
  },
  priceRange: '€€€€',
  parentOrganization: {
    '@id': 'https://sera-norr.com/#organization',
  },
};

// FAQ structured data generator
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Collection/Category structured data generator
export function generateCollectionSchema(collection: {
  name: string;
  description: string;
  image: string;
  url: string;
  products?: { name: string; url: string; image?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    image: collection.image,
    url: collection.url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: collection.products?.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: product.url,
      })),
    },
  };
}
