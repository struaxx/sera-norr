// ============================================
// SERA NORR Leg Library - CMS Data
// ============================================

import type { TableShape } from './types';

// ============================================
// Types
// ============================================

export type LegCategory = 'core' | 'architectural' | 'sculptural';

export interface LegStyle {
  id: string;
  name: string;
  category: LegCategory;
  descriptionShort: { nl: string; en: string };
  priceUplift: number; // EUR added to base price
  compatibleShapes: TableShape[];
  minLength?: number; // Minimum length in cm (for non-round)
  minDiameter?: number; // Minimum diameter in cm (for round)
  isActiveInConfigurator: boolean;
  sortOrder: number;
  model3DRef?: string; // Optional 3D model reference
}

// ============================================
// Leg Library - 11 Styles
// ============================================

export const LEG_LIBRARY: LegStyle[] = [
  // ============ Core (Group A) ============
  {
    id: 'pillar-leg',
    name: 'Pillar Leg',
    category: 'core',
    descriptionShort: {
      nl: 'Klassieke cilindrische poot — tijdloos minimaal',
      en: 'Classic cylindrical leg — timelessly minimal',
    },
    priceUplift: 0,
    compatibleShapes: ['ellips', 'ovale', 'round', 'corner', 'cut-corner'],
    isActiveInConfigurator: true,
    sortOrder: 1,
    model3DRef: 'pillar',
  },
  {
    id: 'cone-leg',
    name: 'Cone Leg',
    category: 'core',
    descriptionShort: {
      nl: 'Tapse kegelvorm — sculptuur en elegantie',
      en: 'Tapered cone shape — sculptural elegance',
    },
    priceUplift: 250,
    compatibleShapes: ['ellips', 'ovale', 'round'],
    minLength: 160,
    minDiameter: 130,
    isActiveInConfigurator: true,
    sortOrder: 2,
    model3DRef: 'cone',
  },
  {
    id: 'block-frame',
    name: 'Block Frame',
    category: 'core',
    descriptionShort: {
      nl: 'Massieve blokvorm onderstel — architectonisch',
      en: 'Solid block frame base — architectural',
    },
    priceUplift: 400,
    compatibleShapes: ['corner', 'cut-corner', 'ellips', 'ovale'],
    minLength: 200,
    isActiveInConfigurator: true,
    sortOrder: 3,
    model3DRef: 'block',
  },
  {
    id: 'edge-frame',
    name: 'Edge Frame',
    category: 'core',
    descriptionShort: {
      nl: 'Strak frame aan de rand — modern industrieel',
      en: 'Sleek edge-mounted frame — modern industrial',
    },
    priceUplift: 500,
    compatibleShapes: ['corner', 'cut-corner'],
    minLength: 200,
    isActiveInConfigurator: true,
    sortOrder: 4,
    model3DRef: 'edge',
  },

  // ============ Architectural (Group B) ============
  {
    id: 'rock-beam',
    name: 'Rock Beam',
    category: 'architectural',
    descriptionShort: {
      nl: 'Ruwe balkstructuur — statement piece',
      en: 'Raw beam structure — statement piece',
    },
    priceUplift: 650,
    compatibleShapes: ['corner', 'cut-corner', 'ellips'],
    minLength: 220,
    isActiveInConfigurator: true,
    sortOrder: 5,
    model3DRef: 'rock-beam',
  },
  {
    id: 'hexa-beam',
    name: 'Hexa Beam',
    category: 'architectural',
    descriptionShort: {
      nl: 'Zeshoekige balken — geometrisch design',
      en: 'Hexagonal beams — geometric design',
    },
    priceUplift: 600,
    compatibleShapes: ['corner', 'cut-corner', 'ellips', 'ovale'],
    minLength: 200,
    isActiveInConfigurator: true,
    sortOrder: 6,
    model3DRef: 'hexa-beam',
  },
  {
    id: 'twin-fold',
    name: 'Twin Fold',
    category: 'architectural',
    descriptionShort: {
      nl: 'Dubbele gevouwen plaat — sculpturaal staal',
      en: 'Double folded plate — sculptural steel',
    },
    priceUplift: 550,
    compatibleShapes: ['corner', 'cut-corner'],
    minLength: 200,
    isActiveInConfigurator: true,
    sortOrder: 7,
    model3DRef: 'twin-fold',
  },
  {
    id: 'angle-corner',
    name: 'Angle Corner',
    category: 'architectural',
    descriptionShort: {
      nl: 'Hoekige frame constructie — brutalist',
      en: 'Angular corner construction — brutalist',
    },
    priceUplift: 500,
    compatibleShapes: ['corner', 'cut-corner'],
    minLength: 200,
    isActiveInConfigurator: true,
    sortOrder: 8,
    model3DRef: 'angle-corner',
  },

  // ============ Sculptural (Group C) ============
  {
    id: 'twist-base',
    name: 'Twist Base',
    category: 'sculptural',
    descriptionShort: {
      nl: 'Gedraaide sculptuur — organische elegantie',
      en: 'Twisted sculpture — organic elegance',
    },
    priceUplift: 750,
    compatibleShapes: ['round', 'ovale'],
    minLength: 200,
    minDiameter: 130,
    isActiveInConfigurator: true,
    sortOrder: 9,
    model3DRef: 'twist',
  },
  {
    id: 'slope-base',
    name: 'Slope Base',
    category: 'sculptural',
    descriptionShort: {
      nl: 'Hellende sokkel — architecturale dynamiek',
      en: 'Sloping pedestal — architectural dynamism',
    },
    priceUplift: 650,
    compatibleShapes: ['ellips', 'ovale', 'corner', 'cut-corner'],
    minLength: 200,
    isActiveInConfigurator: true,
    sortOrder: 10,
    model3DRef: 'slope',
  },
  {
    id: 'fluted-base',
    name: 'Fluted Base',
    category: 'sculptural',
    descriptionShort: {
      nl: 'Gegroefde kolom — klassiek verfijnd',
      en: 'Fluted column — classically refined',
    },
    priceUplift: 700,
    compatibleShapes: ['round', 'ovale'],
    minLength: 200,
    minDiameter: 130,
    isActiveInConfigurator: true,
    sortOrder: 11,
    model3DRef: 'fluted',
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
  diameter?: number
): boolean {
  const leg = getLegById(legId);
  if (!leg) return false;

  // Check shape compatibility
  if (!leg.compatibleShapes.includes(shape)) {
    return false;
  }

  // Check size requirements
  if (shape === 'round') {
    // For round, check diameter (which is length * 2 for radius-based storage, or direct diameter)
    const effectiveDiameter = diameter || length;
    if (leg.minDiameter && effectiveDiameter < leg.minDiameter) {
      return false;
    }
  } else {
    // For non-round shapes, check length
    if (leg.minLength && length < leg.minLength) {
      return false;
    }
  }

  return true;
}

export function getLegPriceUplift(legId: string): number {
  const leg = getLegById(legId);
  return leg?.priceUplift ?? 0;
}

// Legacy type mapping for backward compatibility
export type LegType = string;

// Map new leg IDs to legacy base types for backward compatibility
export function mapLegToLegacyBase(legId: string): 'modern' | 'monolith' | 'architectural' {
  const leg = getLegById(legId);
  if (!leg) return 'modern';
  
  switch (leg.category) {
    case 'core':
      return legId === 'pillar-leg' ? 'modern' : 'monolith';
    case 'architectural':
      return 'architectural';
    case 'sculptural':
      return 'monolith';
    default:
      return 'modern';
  }
}

// ============================================
// Category Labels
// ============================================

export const LEG_CATEGORY_LABELS: Record<LegCategory, { nl: string; en: string }> = {
  core: { nl: 'Basis', en: 'Core' },
  architectural: { nl: 'Architectonisch', en: 'Architectural' },
  sculptural: { nl: 'Sculpturaal', en: 'Sculptural' },
};
