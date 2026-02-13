// ============================================
// SERA NORR - Product Rules (Single Source of Truth)
// ============================================
// All allowed combinations, placement logic, and constraints
// are defined here. The UI reads from this; never hardcodes.

export type RuleShape = 'round' | 'oval' | 'rect' | 'racetrack' | 'square';

export type RuleLegStyle =
  | 'pedestal'
  | 'double_pedestal'
  | 'four_legs'
  | 'trestle'
  | 'fluted_pedestal'
  | 'fluted_double';

// ============================================
// Leg Size Variants (uniform scale only)
// ============================================

export interface LegSizeVariant {
  id: string;
  label: string;
  radiusMm: number; // cylinder/pedestal radius
  heightMm: number; // leg height (table height - top thickness)
}

export interface LegDefinition {
  id: RuleLegStyle;
  label: string;
  labelNL: string;
  /** Size variants — use fixed models, never non-uniform scale */
  sizeVariants: LegSizeVariant[];
  /** Which shapes this leg style is allowed with */
  compatibleShapes: RuleShape[];
  /** Min table length (mm) required for this style. 0 = no minimum */
  minLengthMm: number;
  /** Price uplift in EUR */
  priceUplift: number;
}

// ============================================
// LEG DEFINITIONS
// ============================================

export const LEG_DEFINITIONS: LegDefinition[] = [
  {
    id: 'pedestal',
    label: 'Pedestal',
    labelNL: 'Pilaar',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 150, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 200, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 250, heightMm: 730 },
      { id: 'XL', label: 'XL', radiusMm: 300, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'oval', 'square', 'racetrack'],
    minLengthMm: 0,
    priceUplift: 0,
  },
  {
    id: 'double_pedestal',
    label: 'Double Pedestal',
    labelNL: 'Dubbele Pilaar',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 140, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 180, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 220, heightMm: 730 },
    ],
    compatibleShapes: ['oval', 'rect', 'racetrack'],
    minLengthMm: 1600,
    priceUplift: 250,
  },
  {
    id: 'four_legs',
    label: 'Four Legs',
    labelNL: 'Vier Poten',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 40, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 50, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 60, heightMm: 730 },
    ],
    compatibleShapes: ['rect', 'square', 'oval', 'racetrack'],
    minLengthMm: 0,
    priceUplift: 0,
  },
  {
    id: 'trestle',
    label: 'Trestle',
    labelNL: 'Schraag',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 30, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 40, heightMm: 730 },
    ],
    compatibleShapes: ['rect', 'oval', 'racetrack'],
    minLengthMm: 1600,
    priceUplift: 350,
  },
  {
    id: 'fluted_pedestal',
    label: 'Fluted Pedestal',
    labelNL: 'Gecanneleerde Pilaar',
    sizeVariants: [
      { id: 'M', label: 'M', radiusMm: 200, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 260, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'oval', 'square'],
    minLengthMm: 0,
    priceUplift: 500,
  },
  {
    id: 'fluted_double',
    label: 'Fluted Double',
    labelNL: 'Gecanneleerd Dubbel',
    sizeVariants: [
      { id: 'M', label: 'M', radiusMm: 160, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 200, heightMm: 730 },
    ],
    compatibleShapes: ['oval', 'rect', 'racetrack'],
    minLengthMm: 1800,
    priceUplift: 750,
  },
];

// ============================================
// SHAPE DEFINITIONS
// ============================================

export interface ShapeDefinition {
  id: RuleShape;
  label: string;
  labelNL: string;
  /** Default leg style for this shape */
  defaultLegStyle: RuleLegStyle;
}

export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  { id: 'round', label: 'Round', labelNL: 'Rond', defaultLegStyle: 'pedestal' },
  { id: 'oval', label: 'Oval', labelNL: 'Ovaal', defaultLegStyle: 'pedestal' },
  { id: 'rect', label: 'Rectangle', labelNL: 'Rechthoek', defaultLegStyle: 'four_legs' },
  { id: 'racetrack', label: 'Racetrack', labelNL: 'Racetrack', defaultLegStyle: 'double_pedestal' },
  { id: 'square', label: 'Square', labelNL: 'Vierkant', defaultLegStyle: 'pedestal' },
];

// ============================================
// HARD RULES
// ============================================

/**
 * Hard rule: Oval ≥ 2000mm MUST use 2-leg config.
 * Returns true if the legStyle is forbidden for the given shape+dims.
 */
export function isForbidden(
  shape: RuleShape,
  lengthMm: number,
  legStyle: RuleLegStyle
): boolean {
  // Oval ≥ 2000mm: single pedestal forbidden → must be double
  if (shape === 'oval' && lengthMm >= 2000) {
    if (legStyle === 'pedestal' || legStyle === 'fluted_pedestal') {
      return true;
    }
  }
  // Racetrack ≥ 2000mm same rule
  if (shape === 'racetrack' && lengthMm >= 2000) {
    if (legStyle === 'pedestal' || legStyle === 'fluted_pedestal') {
      return true;
    }
  }
  return false;
}

/**
 * Get all valid leg styles for a shape+dimensions combo.
 */
export function getValidLegStyles(
  shape: RuleShape,
  lengthMm: number,
): LegDefinition[] {
  return LEG_DEFINITIONS.filter(leg => {
    if (!leg.compatibleShapes.includes(shape)) return false;
    if (lengthMm < leg.minLengthMm) return false;
    if (isForbidden(shape, lengthMm, leg.id)) return false;
    return true;
  });
}

/**
 * Choose the best size variant for a leg given table dimensions.
 * Picks the largest variant whose radius fits with clearance.
 */
export function chooseLegSizeVariant(
  leg: LegDefinition,
  shape: RuleShape,
  lengthMm: number,
  widthMm: number,
): LegSizeVariant {
  const halfMinDim = Math.min(lengthMm, widthMm) / 2;
  const clearance = 80; // minimum mm clearance from edge

  // Find largest variant that fits
  const sorted = [...leg.sizeVariants].sort((a, b) => b.radiusMm - a.radiusMm);
  for (const variant of sorted) {
    if (variant.radiusMm + clearance < halfMinDim) {
      return variant;
    }
  }
  // Fallback to smallest
  return leg.sizeVariants[0];
}

// ============================================
// TEST PRESETS
// ============================================

export interface TestPreset {
  id: string;
  label: string;
  shape: RuleShape;
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  heightMm: number;
  note?: string;
}

export const TEST_PRESETS: TestPreset[] = [
  { id: 'oval-1800', label: 'Oval 1800×900', shape: 'oval', lengthMm: 1800, widthMm: 900, thicknessMm: 20, heightMm: 750 },
  { id: 'oval-2200', label: 'Oval 2200×1100', shape: 'oval', lengthMm: 2200, widthMm: 1100, thicknessMm: 20, heightMm: 750, note: 'Must resolve to 2 legs' },
  { id: 'round-1200', label: 'Round Ø1200', shape: 'round', lengthMm: 1200, widthMm: 1200, thicknessMm: 20, heightMm: 750 },
  { id: 'rect-2400', label: 'Rect 2400×1000', shape: 'rect', lengthMm: 2400, widthMm: 1000, thicknessMm: 20, heightMm: 750 },
  { id: 'racetrack-2400', label: 'Racetrack 2400×1100', shape: 'racetrack', lengthMm: 2400, widthMm: 1100, thicknessMm: 20, heightMm: 750 },
];
