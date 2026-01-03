/**
 * SERA NORR - Intent Scoring & Segment Tags Module
 * Privacy-safe intent scoring and interest tagging
 */

const INTENT_KEY = 'seranorr_intent';
const INTERESTS_KEY = 'seranorr_interests';

// Intent score increments
const SCORE_INCREMENTS = {
  product_view: 1,
  product_view_repeat: 2,
  topic_view: 3, // delivery/warranty/care
  cta_click_proposal: 5,
  cta_click_consult: 5,
  form_submit_proposal: 8,
} as const;

// Intent level thresholds
const INTENT_THRESHOLDS = {
  low: { min: 0, max: 4 },
  medium: { min: 5, max: 9 },
  high: { min: 10, max: Infinity },
} as const;

export type IntentLevel = 'low' | 'medium' | 'high';

export interface IntentData {
  score: number;
  productViews: number;
  lastViewedProduct: string | null;
  updatedAt: number;
}

export interface InterestTags {
  travertine: boolean;
  viola: boolean;
  custom: boolean;
  sizeInterests: string[];
  materials: string[];
  updatedAt: number;
}

interface MaterialEventCount {
  [material: string]: number;
}

interface SizeEventCount {
  [size: string]: number;
}

// In-memory counters for session
let materialCounts: MaterialEventCount = {};
let sizeCounts: SizeEventCount = {};
let hasViewedCustomPage = false;
let hasClickedCustomCTA = false;

/**
 * Get intent data from localStorage
 */
export const getIntentData = (): IntentData => {
  if (typeof window === 'undefined') {
    return {
      score: 0,
      productViews: 0,
      lastViewedProduct: null,
      updatedAt: Date.now(),
    };
  }

  try {
    const stored = localStorage.getItem(INTENT_KEY);
    if (!stored) {
      return {
        score: 0,
        productViews: 0,
        lastViewedProduct: null,
        updatedAt: Date.now(),
      };
    }
    return JSON.parse(stored);
  } catch {
    return {
      score: 0,
      productViews: 0,
      lastViewedProduct: null,
      updatedAt: Date.now(),
    };
  }
};

/**
 * Save intent data to localStorage
 */
const saveIntentData = (data: IntentData): void => {
  try {
    localStorage.setItem(INTENT_KEY, JSON.stringify(data));
  } catch {
    // localStorage not available
  }
};

/**
 * Get interest tags from localStorage
 */
export const getInterestTags = (): InterestTags => {
  if (typeof window === 'undefined') {
    return {
      travertine: false,
      viola: false,
      custom: false,
      sizeInterests: [],
      materials: [],
      updatedAt: Date.now(),
    };
  }

  try {
    const stored = localStorage.getItem(INTERESTS_KEY);
    if (!stored) {
      return {
        travertine: false,
        viola: false,
        custom: false,
        sizeInterests: [],
        materials: [],
        updatedAt: Date.now(),
      };
    }
    return JSON.parse(stored);
  } catch {
    return {
      travertine: false,
      viola: false,
      custom: false,
      sizeInterests: [],
      materials: [],
      updatedAt: Date.now(),
    };
  }
};

/**
 * Save interest tags to localStorage
 */
const saveInterestTags = (tags: InterestTags): void => {
  try {
    localStorage.setItem(INTERESTS_KEY, JSON.stringify(tags));
  } catch {
    // localStorage not available
  }
};

/**
 * Get intent level based on score
 */
export const getIntentLevel = (): IntentLevel => {
  const { score } = getIntentData();
  
  if (score >= INTENT_THRESHOLDS.high.min) return 'high';
  if (score >= INTENT_THRESHOLDS.medium.min) return 'medium';
  return 'low';
};

/**
 * Increment intent score
 */
export const incrementScore = (type: keyof typeof SCORE_INCREMENTS): void => {
  const data = getIntentData();
  data.score += SCORE_INCREMENTS[type];
  data.updatedAt = Date.now();
  saveIntentData(data);
};

/**
 * Record product view and update intent
 */
export const recordProductView = (productId: string): void => {
  const data = getIntentData();
  
  // First view or repeat view?
  if (data.productViews === 0) {
    data.score += SCORE_INCREMENTS.product_view;
  } else {
    data.score += SCORE_INCREMENTS.product_view_repeat;
  }
  
  data.productViews += 1;
  data.lastViewedProduct = productId;
  data.updatedAt = Date.now();
  saveIntentData(data);
};

/**
 * Record topic view (delivery/warranty/care)
 */
export const recordTopicView = (topic: 'delivery' | 'warranty' | 'care'): void => {
  incrementScore('topic_view');
};

/**
 * Record CTA click
 */
export const recordCTAClick = (type: 'proposal' | 'consult' | 'contact'): void => {
  if (type === 'proposal' || type === 'consult') {
    incrementScore(type === 'proposal' ? 'cta_click_proposal' : 'cta_click_consult');
  }
};

/**
 * Record form submission
 */
export const recordFormSubmit = (formType: string): void => {
  if (formType === 'proposal' || formType === 'voorstel' || formType === 'bespoke') {
    incrementScore('form_submit_proposal');
  }
};

/**
 * Record material interest
 */
export const recordMaterialInterest = (material: string): void => {
  const normalizedMaterial = material.toLowerCase();
  materialCounts[normalizedMaterial] = (materialCounts[normalizedMaterial] || 0) + 1;
  
  const tags = getInterestTags();
  
  // Check for travertine interest (2+ events)
  if (normalizedMaterial.includes('travertin') && materialCounts[normalizedMaterial] >= 2) {
    tags.travertine = true;
  }
  
  // Check for viola/VANTA interest (2+ events)
  if ((normalizedMaterial.includes('viola') || normalizedMaterial.includes('vanta') || normalizedMaterial.includes('calacatta')) 
      && materialCounts[normalizedMaterial] >= 2) {
    tags.viola = true;
  }
  
  // Track all materials with 2+ views
  if (materialCounts[normalizedMaterial] >= 2 && !tags.materials.includes(normalizedMaterial)) {
    tags.materials.push(normalizedMaterial);
  }
  
  tags.updatedAt = Date.now();
  saveInterestTags(tags);
};

/**
 * Record size range interest
 */
export const recordSizeInterest = (sizeRange: string): void => {
  sizeCounts[sizeRange] = (sizeCounts[sizeRange] || 0) + 1;
  
  // Add to interests if 2+ events for same range
  if (sizeCounts[sizeRange] >= 2) {
    const tags = getInterestTags();
    if (!tags.sizeInterests.includes(sizeRange)) {
      tags.sizeInterests.push(sizeRange);
      tags.updatedAt = Date.now();
      saveInterestTags(tags);
    }
  }
};

/**
 * Record custom page view
 */
export const recordCustomPageView = (): void => {
  hasViewedCustomPage = true;
  checkCustomInterest();
};

/**
 * Record custom CTA click
 */
export const recordCustomCTAClick = (): void => {
  hasClickedCustomCTA = true;
  checkCustomInterest();
};

/**
 * Check and update custom interest tag
 */
const checkCustomInterest = (): void => {
  if (hasViewedCustomPage && hasClickedCustomCTA) {
    const tags = getInterestTags();
    tags.custom = true;
    tags.updatedAt = Date.now();
    saveInterestTags(tags);
  }
};

/**
 * Get all segment data for identification
 */
export const getSegmentData = () => {
  const intentData = getIntentData();
  const interestTags = getInterestTags();
  const intentLevel = getIntentLevel();
  
  return {
    intentLevel,
    intentScore: intentData.score,
    lastViewedProduct: intentData.lastViewedProduct,
    interests: {
      travertine: interestTags.travertine,
      viola: interestTags.viola,
      custom: interestTags.custom,
      sizes: interestTags.sizeInterests,
      materials: interestTags.materials,
    },
  };
};

/**
 * Reset intent data (for testing)
 */
export const resetIntent = (): void => {
  try {
    localStorage.removeItem(INTENT_KEY);
    localStorage.removeItem(INTERESTS_KEY);
    materialCounts = {};
    sizeCounts = {};
    hasViewedCustomPage = false;
    hasClickedCustomCTA = false;
  } catch {
    // localStorage not available
  }
};
