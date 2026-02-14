// ============================================
// SERA NORR - Product Rules (Single Source of Truth)
// ============================================
// All allowed combinations, placement logic, and constraints
// are defined here. The UI reads from this; never hardcodes.

// ============================================
// SHAPES — matches UI TableShape exactly
// ============================================

export type RuleShape = 'ellips' | 'round' | 'ovale' | 'corner' | 'cut-corner';

// ============================================
// LEG STYLES — simplified: 4 styles, auto 1-or-2
// ============================================

export type RuleLegStyle = 'pedestal' | 'fluted' | 'four_legs' | 'trestle';

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
// LEG DEFINITIONS (4 styles)
// ============================================

export const LEG_DEFINITIONS: LegDefinition[] = [
  {
    id: 'pedestal',
    label: 'Pedestal',
    labelNL: 'Pilaar',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 120, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 150, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 200, heightMm: 730 },
      { id: 'XL', label: 'XL', radiusMm: 250, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'ellips', 'ovale'],
    minLengthMm: 0,
    priceUplift: 0,
  },
  {
    id: 'fluted',
    label: 'Fluted',
    labelNL: 'Gecanneleerd',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 150, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 200, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 260, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'ellips', 'ovale'],
    minLengthMm: 0,
    priceUplift: 500,
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
    compatibleShapes: ['corner', 'cut-corner', 'ovale', 'ellips'],
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
    compatibleShapes: ['corner', 'cut-corner', 'ovale', 'ellips'],
    minLengthMm: 1600,
    priceUplift: 350,
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
  { id: 'ellips', label: 'Ellipse', labelNL: 'Ellips', defaultLegStyle: 'pedestal' },
  { id: 'round', label: 'Round', labelNL: 'Rond', defaultLegStyle: 'pedestal' },
  { id: 'ovale', label: 'Oval', labelNL: 'Ovale', defaultLegStyle: 'pedestal' },
  { id: 'corner', label: 'Rectangle', labelNL: 'Rechthoek', defaultLegStyle: 'four_legs' },
  { id: 'cut-corner', label: 'Cut Corner', labelNL: 'Afgeschuind', defaultLegStyle: 'four_legs' },
];

// ============================================
// AUTO LEG COUNT
// ============================================

/**
 * Determine how many legs based on shape + length.
 * Pedestal/Fluted: 1 for round or small tables, 2 for large ellips/ovale.
 * Four legs: always 4.
 * Trestle: always 2.
 */
export function determineLegCount(
  legStyle: RuleLegStyle,
  shape: RuleShape,
  lengthMm: number,
): number {
  if (legStyle === 'four_legs') return 4;
  if (legStyle === 'trestle') return 2;

  // Pedestal or Fluted: auto 1 or 2
  if (shape === 'round') return 1;
  if ((shape === 'ellips' || shape === 'ovale') && lengthMm >= 2000) return 2;
  if (shape === 'corner' || shape === 'cut-corner') return 4; // shouldn't happen but fallback
  return 1;
}

// ============================================
// HARD RULES
// ============================================

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
    return true;
  });
}

/**
 * Choose the best size variant for a leg given table dimensions.
 * Picks the largest variant whose radius fits with clearance.
 */
export function chooseLegSizeVariant(
  leg: LegDefinition,
  _shape: RuleShape,
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
  { id: 'ellips-1800', label: 'Ellips 1800×900', shape: 'ellips', lengthMm: 1800, widthMm: 900, thicknessMm: 20, heightMm: 750 },
  { id: 'ellips-2200', label: 'Ellips 2200×1100', shape: 'ellips', lengthMm: 2200, widthMm: 1100, thicknessMm: 20, heightMm: 750, note: 'Auto 2 legs' },
  { id: 'round-1200', label: 'Round Ø1200', shape: 'round', lengthMm: 1200, widthMm: 1200, thicknessMm: 20, heightMm: 750 },
  { id: 'corner-2400', label: 'Corner 2400×1000', shape: 'corner', lengthMm: 2400, widthMm: 1000, thicknessMm: 20, heightMm: 750 },
  { id: 'ovale-2400', label: 'Ovale 2400×1100', shape: 'ovale', lengthMm: 2400, widthMm: 1100, thicknessMm: 20, heightMm: 750 },
];
