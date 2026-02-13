// ============================================
// SERA NORR - Unit Conversion Utilities
// ============================================
// Single source of truth: all dimensions stored in mm.
// Convert to meters ONLY at the 3D scene boundary.

/** Convert millimeters to meters for Three.js scene */
export function mmToM(mm: number): number {
  return mm / 1000;
}

/** Convert meters to millimeters (inverse, for reading scene back) */
export function mToMm(m: number): number {
  return m * 1000;
}

/** Format mm as human-readable string */
export function formatMm(mm: number): string {
  if (mm >= 1000) {
    const m = mm / 1000;
    return Number.isInteger(m) ? `${m}m` : `${m.toFixed(1)}m`;
  }
  return `${mm}mm`;
}

/** Format mm as cm for display */
export function formatAsCm(mm: number): string {
  return `${mm / 10} cm`;
}
