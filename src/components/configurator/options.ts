import type { RuleShape, RuleLegStyle } from '@/lib/configurator/rules/productRules';

export interface StoneOption {
  id: string;
  label: string;
  family: 'travertijn' | 'marmer';
  texture: string;
}

export const STONE_OPTIONS: StoneOption[] = [
  { id: 'classic-cloudy',  label: 'Classic Cloudy',  family: 'travertijn', texture: '/textures/stones/classic-cloudy-seamless.jpg?v=2' },
  { id: 'tiramisu',        label: 'Tiramisu',        family: 'travertijn', texture: '/textures/stones/tiramisu-seamless.jpg' },
  { id: 'light-emprador',  label: 'Light Emperador', family: 'marmer',     texture: '/textures/stones/light-emperador-seamless.jpg?v=2' },
  { id: 'dark-emperador',  label: 'Dark Emperador',  family: 'marmer',     texture: '/textures/stones/dark-emperador-seamless.jpg' },
  { id: 'calacatta-viola', label: 'Calacatta Viola', family: 'marmer',     texture: '/textures/stones/calacatta-viola-seamless.jpg' },
];

// ============================================
// PRODUCTSOORT
// Een salontafel is bij SERA NORR een massieve sokkel (plinth): het blok
// zelf is de tafel. Dat is een ander product dan een blad op een onderstel,
// dus het krijgt eigen maten, hoogte en prijsbasis.
// ============================================

export type ProductType = 'eettafel' | 'salontafel' | 'bijzettafel';

export interface ProductTypeOption {
  id: ProductType;
  label: string;
  /** Bouwwijze: blad op onderstel, of massieve sokkel. */
  base: 'legs' | 'plinth';
  /** Standaard tafelhoogte in mm. */
  heightMm: number;
}

// Oplopend in prijs. De configurator opent op het eerste type, dus de eerste
// prijs die een bezoeker ziet is de instapprijs; wie een grotere tafel kiest
// ziet het bedrag meelopen in plaats van meteen op het hoogste bedrag te
// beginnen.
export const PRODUCT_TYPE_OPTIONS: ProductTypeOption[] = [
  // Een compact blok naast de bank. Op dit formaat is het geen salontafel
  // meer, dus het krijgt een eigen naam in plaats van als goedkoopste
  // salontafel te worden aangeboden.
  { id: 'bijzettafel', label: 'Bijzettafel', base: 'plinth', heightMm: 450 },
  { id: 'salontafel',  label: 'Salontafel',  base: 'plinth', heightMm: 350 },
  { id: 'eettafel',    label: 'Eettafel',    base: 'legs',   heightMm: 750 },
];

export const getProductType = (id: ProductType): ProductTypeOption =>
  PRODUCT_TYPE_OPTIONS.find((p) => p.id === id) ?? PRODUCT_TYPE_OPTIONS[0];

// Salontafel-sokkel: eigen maatbereik. Een sokkel is laag en gedrongen,
// dus andere verhoudingen dan een eettafelblad.
export const PLINTH_SIZE_RANGES: Record<'corner' | 'round', SizeRange> = {
  corner: {
    // Ondergrens op 100 x 60: kleiner dan dat is het geen salontafel meer
    // maar een bijzettafel, en die staat als eigen product in het aanbod.
    length: { min: 1000, max: 1800, default: 1200 },
    width:  { min: 600,  max: 1000, default: 700 },
    step: 100,
  },
  round: {
    length: { min: 700, max: 1200, default: 900 },
    width:  { min: 700, max: 1200, default: 900 },
    step: 100,
    diameterOnly: true,
  },
};

// Bijzettafel: een compact blok, ongeveer kubusvormig, naast de bank.
export const SIDE_TABLE_SIZE_RANGES: Record<'corner' | 'round', SizeRange> = {
  corner: {
    // Bovengrens op 50 cm: daarboven is het geen bijzettafel meer en zou de
    // prijs bovendien boven een kleine salontafel uitkomen.
    length: { min: 350, max: 500, default: 450 },
    width:  { min: 350, max: 500, default: 450 },
    step: 50,
  },
  round: {
    length: { min: 350, max: 500, default: 450 },
    width:  { min: 350, max: 500, default: 450 },
    step: 50,
    diameterOnly: true,
  },
};

/** Vormen die als sokkel leverbaar zijn. */
export const PLINTH_SHAPES: RuleShape[] = ['corner', 'round'];

export interface ShapeOption {
  id: RuleShape;
  label: string;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'round',  label: 'Rond' },
  { id: 'ovale',  label: 'Ovaal' },
  { id: 'ellips', label: 'Ellips' },
  { id: 'corner', label: 'Rechthoek' },
];

export type LegCount = 1 | 2;

export interface LegStyleOption {
  id: RuleLegStyle;
  label: string;
  category: 'pedestal' | 'fixed';
}

export const LEG_STYLE_OPTIONS: LegStyleOption[] = [
  { id: 'cylindrical',         label: 'Cilindrisch',   category: 'pedestal' },
  { id: 'cylindrical_fluted',  label: 'Gecanneleerd',  category: 'pedestal' },
  { id: 'conical',             label: 'Conisch',       category: 'pedestal' },
  { id: 'hourglass',           label: 'Zandloper',     category: 'pedestal' },
  { id: 'v_legs',              label: 'V-poten',       category: 'fixed' },
  { id: 'd_legs',              label: 'D-poten',       category: 'fixed' },
];

/**
 * Product rules:
 * - Round table: 1 central pedestal leg only (thicker for stability).
 * - Ovale / Ellips / Corner: customer picks legCount.
 *   - 1 = single thick central pedestal (any pedestal style)
 *   - 2 = two pedestals spaced apart (any pedestal style) OR
 *         two fixed-style legs (v_legs / d_legs), these render as
 *         a pair in the 3D model (fixedLegCount: 2).
 */

export const getValidLegCounts = (shape: RuleShape): LegCount[] => {
  if (shape === 'round') return [1];
  return [1, 2];
};

export const getValidLegStyles = (
  shape: RuleShape,
  legCount: LegCount
): LegStyleOption[] => {
  // 1 poot (of round): alleen pedestal-stijlen
  if (shape === 'round' || legCount === 1) {
    return LEG_STYLE_OPTIONS.filter(o => o.category === 'pedestal');
  }
  // 2 poten: pedestal-stijlen + V-poten + D-poten (fixed-pair)
  return LEG_STYLE_OPTIONS;
};

// ============================================
// SIZE RANGES per vorm (mm, stap 100)
// Eén bron van waarheid voor sliders + URL-clamping
// ============================================

export interface SizeRange {
  length: { min: number; max: number; default: number };
  width:  { min: number; max: number; default: number };
  step: number;
  /** true = één diameter-slider; width volgt length */
  diameterOnly?: boolean;
}

export const SIZE_RANGES: Record<RuleShape, SizeRange> = {
  corner: {
    length: { min: 1400, max: 3200, default: 2000 },
    width:  { min: 700,  max: 1300, default: 900 },
    step: 100,
  },
  'cut-corner': {
    length: { min: 1400, max: 3200, default: 2000 },
    width:  { min: 700,  max: 1300, default: 900 },
    step: 100,
  },
  ovale: {
    length: { min: 1400, max: 3000, default: 2000 },
    width:  { min: 800,  max: 1300, default: 1000 },
    step: 100,
  },
  ellips: {
    length: { min: 1400, max: 3000, default: 2000 },
    width:  { min: 800,  max: 1300, default: 1000 },
    step: 100,
  },
  round: {
    length: { min: 800, max: 1700, default: 1200 },
    width:  { min: 800, max: 1700, default: 1200 },
    step: 100,
    diameterOnly: true,
  },
};

export const getSizeRange = (shape: RuleShape): SizeRange => SIZE_RANGES[shape];

/**
 * Maatbereik afhankelijk van productsoort. Een salontafel-sokkel heeft een
 * eigen, kleiner bereik dan een eettafelblad.
 */
export const getSizeRangeFor = (productType: ProductType, shape: RuleShape): SizeRange => {
  const key = shape === 'round' ? 'round' : 'corner';
  if (productType === 'bijzettafel') return SIDE_TABLE_SIZE_RANGES[key];
  if (productType === 'salontafel') return PLINTH_SIZE_RANGES[key];
  return SIZE_RANGES[shape];
};

/**
 * Clamp tegen het bereik van de gekozen productsoort. Een sokkel is kleiner
 * dan een eettafelblad; klemmen tegen het eettafelbereik zou een geldige
 * salontafelmaat ten onrechte terugzetten.
 */
export const clampSizeFor = (
  productType: ProductType,
  shape: RuleShape,
  lengthMm: number,
  widthMm: number
): { lengthMm: number; widthMm: number } => {
  const r = getSizeRangeFor(productType, shape);
  const def = { lengthMm: r.length.default, widthMm: r.width.default };

  const lengthOk = Number.isFinite(lengthMm) && lengthMm >= r.length.min && lengthMm <= r.length.max;
  const widthOk = Number.isFinite(widthMm) && widthMm >= r.width.min && widthMm <= r.width.max;
  if (!lengthOk || !widthOk) return def;
  if (r.diameterOnly) return { lengthMm, widthMm: lengthMm };
  return { lengthMm, widthMm };
};

export const getDefaultSizeFor = (
  productType: ProductType,
  shape: RuleShape
): { lengthMm: number; widthMm: number } => {
  const r = getSizeRangeFor(productType, shape);
  return { lengthMm: r.length.default, widthMm: r.width.default };
};

export const getDefaultSize = (shape: RuleShape): { lengthMm: number; widthMm: number } => {
  const r = SIZE_RANGES[shape];
  return { lengthMm: r.length.default, widthMm: r.width.default };
};

/**
 * Clamp/normalize een (lengthMm, widthMm) paar tegen de range van een vorm.
 * - NaN of buiten range → val terug op default van die vorm.
 * - Geldige waarden blijven behouden (essentieel voor vormwissel-UX).
 * - Voor diameterOnly-vormen wordt width gelijk gemaakt aan length.
 */
export const clampSize = (
  shape: RuleShape,
  lengthMm: number,
  widthMm: number
): { lengthMm: number; widthMm: number } => {
  const r = SIZE_RANGES[shape];
  const def = getDefaultSize(shape);

  const lengthOk = Number.isFinite(lengthMm) && lengthMm >= r.length.min && lengthMm <= r.length.max;
  const widthOk  = Number.isFinite(widthMm)  && widthMm  >= r.width.min  && widthMm  <= r.width.max;

  if (!lengthOk || !widthOk) return def;
  if (r.diameterOnly) return { lengthMm, widthMm: lengthMm };
  return { lengthMm, widthMm };
};