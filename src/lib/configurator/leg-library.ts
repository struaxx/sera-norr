// ============================================
// SERA NORR Leg Library - Maps to productRules.ts
// ============================================
// This file provides CMS-style metadata and helper functions
// for the 9 leg styles defined in productRules.ts.

import type { TableShape } from './types';
import type { RuleLegStyle } from './rules/productRules';
import { LEG_DEFINITIONS } from './rules/productRules';

// ============================================
// Types
// ============================================

export type LegCategory = 'pedestal' | 'fixed';

export interface LegStyle {
  id: RuleLegStyle;
  name: string;
  category: LegCategory;
  descriptionShort: { nl: string; en: string };
  priceUplift: number;
  compatibleShapes: TableShape[];
  isActiveInConfigurator: boolean;
  sortOrder: number;
}

// ============================================
// Leg Library - 9 Styles (synced with productRules)
// ============================================

export const LEG_LIBRARY: LegStyle[] = [
  // === Pedestal ===
  {
    id: 'cylindrical',
    name: 'Cylindrical',
    category: 'pedestal',
    descriptionShort: {
      nl: 'Klassieke cilindrische kolom — tijdloos minimaal',
      en: 'Classic cylindrical column — timelessly minimal',
    },
    priceUplift: 0,
    compatibleShapes: ['round', 'ellips', 'ovale', 'corner'],
    isActiveInConfigurator: true,
    sortOrder: 1,
  },
  {
    id: 'cylindrical_fluted',
    name: 'Cylindrical Fluted',
    category: 'pedestal',
    descriptionShort: {
      nl: 'Gecanneleerde kolom — klassiek verfijnd',
      en: 'Fluted column — classically refined',
    },
    priceUplift: 500,
    compatibleShapes: ['round', 'ellips', 'ovale', 'corner'],
    isActiveInConfigurator: true,
    sortOrder: 2,
  },
  {
    id: 'conical',
    name: 'Conical',
    category: 'pedestal',
    descriptionShort: {
      nl: 'Tapse kegelvorm — sculptuur en elegantie',
      en: 'Tapered cone shape — sculptural elegance',
    },
    priceUplift: 250,
    compatibleShapes: ['round', 'ellips', 'ovale', 'corner'],
    isActiveInConfigurator: true,
    sortOrder: 3,
  },
  {
    id: 'hourglass',
    name: 'Hourglass',
    category: 'pedestal',
    descriptionShort: {
      nl: 'Zandlopervorm — organisch en opvallend',
      en: 'Hourglass shape — organic and striking',
    },
    priceUplift: 400,
    compatibleShapes: ['round', 'ellips', 'ovale', 'corner'],
    isActiveInConfigurator: true,
    sortOrder: 4,
  },

  // === Fixed ===
  {
    id: 'quartet_legs',
    name: 'Quartet',
    category: 'fixed',
    descriptionShort: {
      nl: 'Centrale ronde base — voor ronde tafels',
      en: 'Central round base — for round tables',
    },
    priceUplift: 350,
    compatibleShapes: ['round'],
    isActiveInConfigurator: false,
    sortOrder: 5,
  },
  {
    id: 'v_legs',
    name: 'V-Legs',
    category: 'fixed',
    descriptionShort: {
      nl: 'V-vormige staanders — modern statement',
      en: 'V-shaped supports — modern statement',
    },
    priceUplift: 450,
    compatibleShapes: ['ellips', 'ovale', 'corner', 'cut-corner'],
    isActiveInConfigurator: true,
    sortOrder: 6,
  },
  {
    id: 'd_legs',
    name: 'D-Legs',
    category: 'fixed',
    descriptionShort: {
      nl: 'D-profiel staanders — architectonisch',
      en: 'D-profile supports — architectural',
    },
    priceUplift: 500,
    compatibleShapes: ['ellips', 'ovale', 'corner', 'cut-corner'],
    isActiveInConfigurator: true,
    sortOrder: 7,
  },
  {
    id: 'rounded_legs',
    name: 'Rounded',
    category: 'pedestal',
    descriptionShort: {
      nl: 'Afgeronde poten — zachte elegantie',
      en: 'Rounded legs — soft elegance',
    },
    priceUplift: 0,
    compatibleShapes: ['round', 'ellips', 'ovale', 'corner', 'cut-corner'],
    isActiveInConfigurator: false,
    sortOrder: 8,
  },
];

// ============================================
// Helper Functions
// ============================================

export function getLegById(id: string): LegStyle | undefined {
  return LEG_LIBRARY.find(leg => leg.id === id);
}

export function getLegsByCategory(category: LegCategory): LegStyle[] {
  return LEG_LIBRARY.filter(leg => leg.category === category && leg.isActiveInConfigurator)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveLegs(): LegStyle[] {
  return LEG_LIBRARY.filter(leg => leg.isActiveInConfigurator)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function isLegCompatible(
  legId: string,
  shape: TableShape,
  length: number,
  diameter?: number,
): boolean {
  const leg = getLegById(legId);
  if (!leg) return false;
  if (!leg.compatibleShapes.includes(shape)) return false;
  return true;
}

export function getLegPriceUplift(legId: string): number {
  const leg = getLegById(legId);
  return leg?.priceUplift ?? 0;
}

// Legacy type mapping for backward compatibility
export type LegType = string;

export function mapLegToLegacyBase(legId: string): 'modern' | 'monolith' | 'architectural' {
  const leg = getLegById(legId);
  if (!leg) return 'modern';
  return leg.category === 'pedestal' ? 'monolith' : 'modern';
}

// ============================================
// Category Labels
// ============================================

export const LEG_CATEGORY_LABELS: Record<LegCategory, { nl: string; en: string }> = {
  pedestal: { nl: 'Pedestal', en: 'Pedestal' },
  fixed: { nl: 'Vast', en: 'Fixed' },
};
