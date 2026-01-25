// ============================================
// SERA NORR Configurator - Modular Pricing Engine V2
// ============================================
// "Vanaf" pricing system with transparent uplifts

import type { ConfiguratorState } from './types';
import { FINISHES, EDGE_PROFILES, BASES } from './config';
import { getStoneById, type StoneLibraryEntry } from './stone-library';

// ============================================
// PRICE CONFIGURATION
// ============================================

// Base prices per stone tier (for a standard 200x100 table)
export const STONE_BASE_PRICES: Record<string, number> = {
  // Tier: Signature (entry)
  'signature': 4800,
  // Tier: Atelier (mid)
  'atelier': 6200,
  // Tier: Icon (premium)
  'icon': 8500,
  // Custom stone
  'custom': 0, // Price on request
};

// Size uplift factors (relative to 200x100 base)
export const SIZE_UPLIFTS: Record<string, number> = {
  // Ellips
  'ellips-200x100': 1.0,
  'ellips-220x100': 1.12,
  'ellips-240x110': 1.28,
  'ellips-260x110': 1.40,
  // Ovale
  'ovale-200x100': 1.0,
  'ovale-220x100': 1.12,
  'ovale-240x110': 1.28,
  'ovale-260x110': 1.40,
  // Round
  'round-120': 0.72,
  'round-130': 0.85,
  'round-150': 1.0,
  'round-160': 1.15,
  // Corner (baseline)
  'corner-200x100': 1.0,
  'corner-220x100': 1.10,
  'corner-240x100': 1.20,
  // Cut-corner (small uplift for extra machining)
  'cut-corner-200x100': 1.05,
  'cut-corner-220x100': 1.15,
  'cut-corner-240x100': 1.26,
};

// Thickness uplift
export const THICKNESS_UPLIFTS: Record<number, number> = {
  2: 1.0,   // 20mm standard
  3: 1.25,  // 30mm premium
};

// Base type uplifts
export const BASE_UPLIFTS: Record<string, number> = {
  'modern': 1.0,        // Cylindrical (included)
  'monolith': 1.35,     // Sculpted Cone
  'architectural': 1.20, // Pedestal Block
};

// Finish uplifts
export const FINISH_UPLIFTS: Record<string, number> = {
  'honed': 1.0,
  'polished': 1.08,
  'matte': 1.0,
};

// Edge profile uplifts
export const EDGE_UPLIFTS: Record<string, number> = {
  'straight': 1.0,
  'beveled': 1.05,
  'rounded': 1.08,
  'bullnose': 1.12,
};

// ============================================
// PRICE CALCULATION
// ============================================

export interface ModularPriceEstimate {
  stoneBasePrice: number;
  sizeUplift: number;
  thicknessUplift: number;
  baseUplift: number;
  finishUplift: number;
  edgeUplift: number;
  totalMultiplier: number;
  vanafPrice: number;
  isCustomStone: boolean;
  disclaimer: string;
}

/**
 * Calculate "vanaf" price using modular uplift system
 */
export function calculateModularPrice(config: ConfiguratorState): ModularPriceEstimate {
  // Get stone info
  const stone = getStoneById(config.stone);
  const isCustomStone = config.stone === 'custom' || !stone;
  
  // Get stone base price by tier
  const stoneTier = stone?.tier || 'signature';
  const stoneBasePrice = STONE_BASE_PRICES[stoneTier] || STONE_BASE_PRICES.signature;
  
  // Calculate size key
  const sizeKey = getSizeKey(config);
  const sizeUplift = SIZE_UPLIFTS[sizeKey] || 1.0;
  
  // Thickness uplift
  const thicknessUplift = THICKNESS_UPLIFTS[config.dimensions.thickness] || 1.0;
  
  // Base uplift
  const baseUplift = BASE_UPLIFTS[config.baseType] || 1.0;
  
  // Finish uplift
  const finishUplift = FINISH_UPLIFTS[config.finish] || 1.0;
  
  // Edge uplift
  const edgeUplift = EDGE_UPLIFTS[config.edgeProfile] || 1.0;
  
  // Total multiplier
  const totalMultiplier = sizeUplift * thicknessUplift * baseUplift * finishUplift * edgeUplift;
  
  // Calculate final price
  const vanafPrice = isCustomStone ? 0 : Math.round((stoneBasePrice * totalMultiplier) / 100) * 100;
  
  return {
    stoneBasePrice,
    sizeUplift,
    thicknessUplift,
    baseUplift,
    finishUplift,
    edgeUplift,
    totalMultiplier,
    vanafPrice,
    isCustomStone,
    disclaimer: isCustomStone 
      ? 'Prijs op aanvraag' 
      : 'Definitieve offerte na slab-keuze & transport.',
  };
}

/**
 * Get size key for uplift lookup
 */
function getSizeKey(config: ConfiguratorState): string {
  const { shape, dimensions } = config;
  
  if (shape === 'round' && dimensions.radius) {
    const diameter = dimensions.radius * 2;
    return `round-${diameter}`;
  }
  
  return `${shape}-${dimensions.length}x${dimensions.width}`;
}

/**
 * Format price for display
 */
export function formatVanafPrice(price: number, locale: string = 'nl-NL'): string {
  if (price === 0) return 'Op aanvraag';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get lead time estimate based on configuration
 */
export function getModularLeadTime(config: ConfiguratorState): { min: number; max: number } {
  const stone = getStoneById(config.stone);
  const isIcon = stone?.tier === 'icon';
  const isCutCorner = config.shape === 'cut-corner';
  const isCustom = config.stone === 'custom';
  
  if (isCustom) {
    return { min: 16, max: 24 };
  }
  
  if (isIcon || isCutCorner) {
    return { min: 14, max: 18 };
  }
  
  return { min: 10, max: 14 };
}
