// ============================================================
// PRICING CONFIG, PLACEHOLDER VALUES
// Replace the VUL_IN numbers with real figures from actual quotes.
// These drive the INDICATIVE RANGE shown in the configurator.
// The exact price is always determined per order via supplier quote.
// ============================================================

// Indicative starting price per stone, for the SMALLEST standard
// configuration in that stone (smallest size, 1 leg, polished).
// Source these from your real sent quotes later.
export const STONE_BASE_PRICE: Record<string, number> = {
  'classic-cloudy':  2950,   // VUL_IN, travertijn, goedkoopst
  'tiramisu':        2950,   // VUL_IN, travertijn
  'light-emprador':  3800,   // VUL_IN, marmer
  'dark-emperador':  3800,   // VUL_IN, marmer
  'calacatta-viola': 4500,   // VUL_IN, premium marmer, duurst
};

// How much the indicative price scales with surface area.
// Base size reference = 2.0 m² (e.g. 200x100cm).
// Larger tables scale up proportionally to surface area.
export const BASE_SURFACE_M2 = 2.0;          // reference surface
export const SURFACE_SCALING = 1.0;          // VUL_IN, 1.0 = linear with m²

// Surcharge per extra leg beyond the first (indicative).
export const EXTRA_LEG_SURCHARGE = 600;      // VUL_IN, per extra leg

// Finish surcharges (these you already know).
export const FINISH_SURCHARGE: Record<string, number> = {
  gepolijst:  0,
  gezoet:     200,
  geborsteld: 150,
};

// Range width: the indicative range is shown as [low, high] around
// the computed midpoint. E.g. 0.12 = ±12%.
export const RANGE_SPREAD = 0.12;            // VUL_IN, ±12%

// ============================================================
// Calculation, do not edit below unless logic changes
// ============================================================

export interface PriceInput {
  stoneId: string;
  lengthMm: number;
  widthMm: number;
  legCount: number;
  finish: string;
}

export interface PriceRange {
  low: number;
  high: number;
  mid: number;
}

const roundTo = (n: number, step = 50) => Math.round(n / step) * step;

export const computeRange = (input: PriceInput): PriceRange => {
  const base = STONE_BASE_PRICE[input.stoneId] ?? STONE_BASE_PRICE['classic-cloudy'];

  // surface in m² (mm → m)
  const surfaceM2 = (input.lengthMm / 1000) * (input.widthMm / 1000);
  const surfaceFactor = 1 + ((surfaceM2 - BASE_SURFACE_M2) / BASE_SURFACE_M2) * SURFACE_SCALING;

  const legCost = Math.max(0, input.legCount - 1) * EXTRA_LEG_SURCHARGE;
  const finishCost = FINISH_SURCHARGE[input.finish] ?? 0;

  const mid = base * Math.max(0.5, surfaceFactor) + legCost + finishCost;

  return {
    low:  roundTo(mid * (1 - RANGE_SPREAD)),
    high: roundTo(mid * (1 + RANGE_SPREAD)),
    mid:  roundTo(mid),
  };
};