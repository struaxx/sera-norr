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
// LEG STYLES — 9 concrete styles
// ============================================

export type RuleLegStyle =
  | 'cylindrical'
  | 'cylindrical_fluted'
  | 'conical'
  | 'hourglass'
  | 'quartet_legs'
  | 'v_legs'
  | 'd_legs'
  | 'rounded_legs';

// ============================================
// Leg Category
// ============================================

export type RuleLegCategory = 'pedestal' | 'fixed';

// ============================================
// Leg Size Variants (uniform scale only)
// ============================================

export interface LegSizeVariant {
  id: string;
  label: string;
  radiusMm: number;
  heightMm: number;
}

export interface LegDefinition {
  id: RuleLegStyle;
  label: string;
  labelNL: string;
  category: RuleLegCategory;
  /** Fixed leg count for 'fixed' category. Pedestal uses auto logic. */
  fixedLegCount?: 1 | 2 | 4;
  sizeVariants: LegSizeVariant[];
  compatibleShapes: RuleShape[];
  minLengthMm: number;
  priceUplift: number;
}

// ============================================
// LEG DEFINITIONS (9 styles)
// ============================================

export const LEG_DEFINITIONS: LegDefinition[] = [
  // === Pedestal (auto 1 or 2) ===
  {
    id: 'cylindrical',
    label: 'Cylindrical',
    labelNL: 'Cilindrisch',
    category: 'pedestal',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 120, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 150, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 200, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'ellips', 'ovale'],
    minLengthMm: 0,
    priceUplift: 0,
  },
  {
    id: 'cylindrical_fluted',
    label: 'Cylindrical Fluted',
    labelNL: 'Gecanneleerd',
    category: 'pedestal',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 120, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 150, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 200, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'ellips', 'ovale'],
    minLengthMm: 0,
    priceUplift: 500,
  },
  {
    id: 'conical',
    label: 'Conical',
    labelNL: 'Conisch',
    category: 'pedestal',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 120, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 150, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 200, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'ellips', 'ovale'],
    minLengthMm: 0,
    priceUplift: 250,
  },
  {
    id: 'hourglass',
    label: 'Hourglass',
    labelNL: 'Zandloper',
    category: 'pedestal',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 120, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 150, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 200, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'ellips', 'ovale'],
    minLengthMm: 0,
    priceUplift: 400,
  },

  // === Fixed-count styles ===
  {
    id: 'quartet_legs',
    label: 'Quartet',
    labelNL: 'Quartet',
    category: 'fixed',
    fixedLegCount: 1,
    sizeVariants: [
      { id: 'M', label: 'M', radiusMm: 200, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 260, heightMm: 730 },
    ],
    compatibleShapes: ['round'],
    minLengthMm: 0,
    priceUplift: 350,
  },
  {
    id: 'v_legs',
    label: 'V-Legs',
    labelNL: 'V-Poten',
    category: 'fixed',
    fixedLegCount: 2,
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 40, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 50, heightMm: 730 },
    ],
    compatibleShapes: ['ellips', 'ovale', 'corner', 'cut-corner'],
    minLengthMm: 1600,
    priceUplift: 450,
  },
  {
    id: 'd_legs',
    label: 'D-Legs',
    labelNL: 'D-Poten',
    category: 'fixed',
    fixedLegCount: 2,
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 50, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 60, heightMm: 730 },
    ],
    compatibleShapes: ['ellips', 'ovale', 'corner', 'cut-corner'],
    minLengthMm: 1600,
    priceUplift: 500,
  },
  {
    id: 'rounded_legs',
    label: 'Rounded',
    labelNL: 'Afgerond',
    category: 'pedestal',
    sizeVariants: [
      { id: 'S', label: 'S', radiusMm: 150, heightMm: 730 },
      { id: 'M', label: 'M', radiusMm: 200, heightMm: 730 },
      { id: 'L', label: 'L', radiusMm: 250, heightMm: 730 },
    ],
    compatibleShapes: ['round', 'ellips', 'ovale', 'corner', 'cut-corner'],
    minLengthMm: 0,
    priceUplift: 0,
  },
];

// ============================================
// SHAPE DEFINITIONS
// ============================================

export interface ShapeDefinition {
  id: RuleShape;
  label: string;
  labelNL: string;
  defaultLegStyle: RuleLegStyle;
}

export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  { id: 'ellips', label: 'Ellipse', labelNL: 'Ellips', defaultLegStyle: 'cylindrical' },
  { id: 'round', label: 'Round', labelNL: 'Rond', defaultLegStyle: 'cylindrical' },
  { id: 'ovale', label: 'Oval', labelNL: 'Ovale', defaultLegStyle: 'cylindrical' },
  { id: 'corner', label: 'Rectangle', labelNL: 'Rechthoek', defaultLegStyle: 'rounded_legs' },
  { id: 'cut-corner', label: 'Cut Corner', labelNL: 'Afgeschuind', defaultLegStyle: 'rounded_legs' },
];

// ============================================
// PEDESTAL STYLE CHECK
// ============================================

const PEDESTAL_STYLES: RuleLegStyle[] = ['cylindrical', 'cylindrical_fluted', 'conical', 'hourglass', 'rounded_legs'];

export function isPedestalStyle(style: RuleLegStyle): boolean {
  return PEDESTAL_STYLES.includes(style);
}

// ============================================
// AUTO LEG COUNT (never a UI choice)
// ============================================

export function determineLegCount(
  legStyle: RuleLegStyle,
  shape: RuleShape,
  lengthMm: number,
): number {
  // Fixed-count styles
  const def = LEG_DEFINITIONS.find(l => l.id === legStyle);
  if (def?.category === 'fixed' && def.fixedLegCount != null) {
    return def.fixedLegCount;
  }

  // Pedestal styles: auto 1 or 2
  if (shape === 'round') return 1;
  if ((shape === 'ellips' || shape === 'ovale') && lengthMm >= 2000) return 2;
  return 1;
}

// ============================================
// HARD RULES
// ============================================

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

export function chooseLegSizeVariant(
  leg: LegDefinition,
  _shape: RuleShape,
  lengthMm: number,
  widthMm: number,
): LegSizeVariant {
  const halfMinDim = Math.min(lengthMm, widthMm) / 2;
  const clearance = 80;

  const sorted = [...leg.sizeVariants].sort((a, b) => b.radiusMm - a.radiusMm);
  for (const variant of sorted) {
    if (variant.radiusMm + clearance < halfMinDim) {
      return variant;
    }
  }
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
