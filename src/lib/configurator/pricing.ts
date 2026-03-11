// ============================================
// SERA NORR Configurator - Pricing Engine
// ============================================

import type { ConfiguratorState, PriceEstimate } from './types';
import {
  STONE_MATERIALS,
  FINISHES,
  EDGE_PROFILES,
  BASES,
  EXTRAS_PRICING,
  BASE_PRICE_PER_SQM,
} from './config';

/**
 * Calculate estimated price based on configuration
 * Note: This is an estimate only - final price requires atelier consultation
 */
export function calculatePriceEstimate(config: ConfiguratorState): PriceEstimate {
  const { dimensions, shape, stone, finish, edgeProfile, baseType, extras } = config;

  // Calculate surface area in square meters
  let surfaceArea: number;
  
  if (shape === 'round' && dimensions.radius) {
    // πr² for round tables
    surfaceArea = Math.PI * Math.pow(dimensions.radius / 100, 2);
  } else if (shape === 'ellips' || shape === 'ovale') {
    // π × a × b for ellipse/oval (approximation)
    surfaceArea = Math.PI * (dimensions.length / 200) * (dimensions.width / 200);
  } else {
    // length × width for corner and cut-corner
    surfaceArea = (dimensions.length / 100) * (dimensions.width / 100);
  }

  // Base price from surface area
  const basePrice = surfaceArea * BASE_PRICE_PER_SQM;

  // Get multipliers from configurations
  const stoneConfig = STONE_MATERIALS.find(s => s.id === stone);
  const finishConfig = FINISHES.find(f => f.id === finish);
  const edgeConfig = EDGE_PROFILES.find(e => e.id === edgeProfile);
  const baseConfig = BASES.find(b => b.id === baseType);

  const stoneMultiplier = stoneConfig?.priceMultiplier ?? 1;
  const finishMultiplier = finishConfig?.priceMultiplier ?? 1;
  const edgeMultiplier = edgeConfig?.priceMultiplier ?? 1;
  const baseMultiplier = baseConfig?.priceMultiplier ?? 1;

  // Thickness multiplier (thicker = more expensive)
  const thicknessMultiplier = 1 + ((dimensions.thickness - 3) * 0.1);

  // Calculate extras
  let extrasTotal = 0;
  if (extras.sealer) extrasTotal += EXTRAS_PRICING.sealer.price;
  if (extras.delivery) extrasTotal += EXTRAS_PRICING.delivery.price;
  if (extras.installation) extrasTotal += EXTRAS_PRICING.installation.price;
  if (extras.sampleKit) extrasTotal += EXTRAS_PRICING.sampleKit.price;

  // Calculate total estimate
  const materialCost = basePrice * stoneMultiplier * finishMultiplier * thicknessMultiplier;
  const constructionCost = materialCost * edgeMultiplier * baseMultiplier;
  const totalEstimate = constructionCost + extrasTotal;

  // Calculate price range (±15% for estimation variance)
  const variance = 0.15;
  const priceRange = {
    min: Math.round(totalEstimate * (1 - variance) / 100) * 100,
    max: Math.round(totalEstimate * (1 + variance) / 100) * 100,
  };

  return {
    basePrice: Math.round(basePrice),
    stoneMultiplier,
    finishMultiplier,
    edgeMultiplier,
    baseMultiplier,
    extrasTotal,
    totalEstimate: Math.round(totalEstimate / 100) * 100,
    priceRange,
    disclaimer: stone === 'custom' 
      ? 'Prijs voor custom steensoorten op aanvraag' 
      : 'Indicatie, definitieve prijs na intake',
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number, locale: string = 'nl-NL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price range for display
 */
export function formatPriceRange(min: number, max: number, locale: string = 'nl-NL'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} – ${formatter.format(max)}`;
}

/**
 * Get lead time estimate based on configuration complexity
 */
export function getLeadTimeEstimate(config: ConfiguratorState): { min: number; max: number } {
  return { min: 12, max: 16 };
}
