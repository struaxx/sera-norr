// ============================================
// SERA NORR - Configuration Resolver Engine
// ============================================
// Input: shape + dims + optional legStyle
// Output: fully resolved, valid configuration

import {
  type RuleShape,
  type RuleLegStyle,
  type LegDefinition,
  type LegSizeVariant,
  LEG_DEFINITIONS,
  SHAPE_DEFINITIONS,
  getValidLegStyles,
  isForbidden,
  chooseLegSizeVariant,
} from '../rules/productRules';

// ============================================
// RESOLVED CONFIGURATION OUTPUT
// ============================================

export interface LegPlacement {
  x: number; // mm offset from center
  z: number; // mm offset from center
}

export interface ResolvedConfiguration {
  // Identity
  shape: RuleShape;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  thicknessMm: number;

  // Resolved leg
  legStyle: RuleLegStyle;
  legDefinition: LegDefinition;
  legSizeVariant: LegSizeVariant;
  legCount: number;
  legPlacements: LegPlacement[];

  // Computed values
  clearanceMm: number;
  legHeightMm: number;

  // Validity
  isValid: boolean;
  warnings: string[];
  /** If the requested leg was auto-switched */
  wasAutoSwitched: boolean;
  autoSwitchReason?: string;
}

// ============================================
// PLACEMENT FORMULAS
// ============================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeClearance(legRadiusMm: number): number {
  return Math.max(80, legRadiusMm * 1.2);
}

function computePedestalPlacement(
  _shape: RuleShape,
  _lengthMm: number,
  _widthMm: number,
  _legRadiusMm: number,
): LegPlacement[] {
  // Center pedestal
  return [{ x: 0, z: 0 }];
}

function computeDoublePedestalPlacement(
  _shape: RuleShape,
  lengthMm: number,
  _widthMm: number,
  legRadiusMm: number,
): LegPlacement[] {
  const clearance = computeClearance(legRadiusMm);
  const maxOffset = lengthMm / 2 - clearance - legRadiusMm;
  const zOffset = clamp(lengthMm * 0.25, 320, maxOffset);
  return [
    { x: 0, z: -zOffset },
    { x: 0, z: zOffset },
  ];
}

function computeFourLegsPlacement(
  _shape: RuleShape,
  lengthMm: number,
  widthMm: number,
  legRadiusMm: number,
): LegPlacement[] {
  const clearance = computeClearance(legRadiusMm);
  const maxXOffset = widthMm / 2 - clearance - legRadiusMm;
  const maxZOffset = lengthMm / 2 - clearance - legRadiusMm;
  const xOffset = clamp(widthMm * 0.22, 220, maxXOffset);
  const zOffset = clamp(lengthMm * 0.28, 260, maxZOffset);
  return [
    { x: -xOffset, z: -zOffset },
    { x: xOffset, z: -zOffset },
    { x: -xOffset, z: zOffset },
    { x: xOffset, z: zOffset },
  ];
}

function computeTrestlePlacement(
  _shape: RuleShape,
  lengthMm: number,
  _widthMm: number,
  legRadiusMm: number,
): LegPlacement[] {
  // Trestle = two slab-legs at each end (similar to double pedestal placement)
  const clearance = computeClearance(legRadiusMm);
  const maxOffset = lengthMm / 2 - clearance - legRadiusMm;
  const zOffset = clamp(lengthMm * 0.30, 350, maxOffset);
  return [
    { x: 0, z: -zOffset },
    { x: 0, z: zOffset },
  ];
}

function computePlacements(
  legStyle: RuleLegStyle,
  shape: RuleShape,
  lengthMm: number,
  widthMm: number,
  legRadiusMm: number,
): LegPlacement[] {
  switch (legStyle) {
    case 'pedestal':
    case 'fluted_pedestal':
      return computePedestalPlacement(shape, lengthMm, widthMm, legRadiusMm);
    case 'double_pedestal':
    case 'fluted_double':
      return computeDoublePedestalPlacement(shape, lengthMm, widthMm, legRadiusMm);
    case 'four_legs':
      return computeFourLegsPlacement(shape, lengthMm, widthMm, legRadiusMm);
    case 'trestle':
      return computeTrestlePlacement(shape, lengthMm, widthMm, legRadiusMm);
    default:
      return computePedestalPlacement(shape, lengthMm, widthMm, legRadiusMm);
  }
}

// ============================================
// MAIN RESOLVER
// ============================================

export interface ResolveInput {
  shape: RuleShape;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  thicknessMm: number;
  requestedLegStyle?: RuleLegStyle;
}

export function resolveConfiguration(input: ResolveInput): ResolvedConfiguration {
  const { shape, lengthMm, widthMm, heightMm, thicknessMm } = input;
  const warnings: string[] = [];
  let wasAutoSwitched = false;
  let autoSwitchReason: string | undefined;

  // 1. Get valid leg styles for this shape+dims
  const validStyles = getValidLegStyles(shape, lengthMm);

  // 2. Determine leg style
  let resolvedStyle: RuleLegStyle;
  const requested = input.requestedLegStyle;

  if (requested && validStyles.find(l => l.id === requested)) {
    // Requested style is valid
    resolvedStyle = requested;
  } else if (requested) {
    // Requested style is NOT valid → auto-switch
    wasAutoSwitched = true;
    const def = LEG_DEFINITIONS.find(l => l.id === requested);

    if (def && isForbidden(shape, lengthMm, requested)) {
      autoSwitchReason = `${def.label} is not allowed for ${shape} ≥${lengthMm}mm. Auto-switched.`;
    } else if (def && !def.compatibleShapes.includes(shape)) {
      autoSwitchReason = `${def.label} is not compatible with ${shape}. Auto-switched.`;
    } else if (def && lengthMm < def.minLengthMm) {
      autoSwitchReason = `${def.label} requires min length ${def.minLengthMm}mm. Auto-switched.`;
    } else {
      autoSwitchReason = `Requested leg style not valid. Auto-switched.`;
    }
    warnings.push(autoSwitchReason);

    // Pick default for shape
    const shapeDef = SHAPE_DEFINITIONS.find(s => s.id === shape);
    const fallback = shapeDef?.defaultLegStyle;
    if (fallback && validStyles.find(l => l.id === fallback)) {
      resolvedStyle = fallback;
    } else {
      resolvedStyle = validStyles[0]?.id ?? 'pedestal';
    }
  } else {
    // No request → use shape default
    const shapeDef = SHAPE_DEFINITIONS.find(s => s.id === shape);
    const fallback = shapeDef?.defaultLegStyle;
    if (fallback && validStyles.find(l => l.id === fallback)) {
      resolvedStyle = fallback;
    } else {
      resolvedStyle = validStyles[0]?.id ?? 'pedestal';
    }
  }

  // 3. Get leg definition
  const legDef = LEG_DEFINITIONS.find(l => l.id === resolvedStyle)!;

  // 4. Choose size variant
  const sizeVariant = chooseLegSizeVariant(legDef, shape, lengthMm, widthMm);

  // 5. Compute leg height
  const legHeightMm = heightMm - thicknessMm;

  // 6. Compute placements
  const placements = computePlacements(
    resolvedStyle,
    shape,
    lengthMm,
    widthMm,
    sizeVariant.radiusMm,
  );

  // 7. Compute clearance
  const clearanceMm = computeClearance(sizeVariant.radiusMm);

  // 8. Validate: no floating, no clipping
  for (const p of placements) {
    const halfL = lengthMm / 2;
    const halfW = widthMm / 2;
    // Check leg doesn't extend beyond table edge
    if (Math.abs(p.z) + sizeVariant.radiusMm > halfL) {
      warnings.push(`Leg at z=${p.z}mm extends beyond table length.`);
    }
    if (Math.abs(p.x) + sizeVariant.radiusMm > halfW) {
      warnings.push(`Leg at x=${p.x}mm extends beyond table width.`);
    }
  }

  const isValid = warnings.length === 0;

  return {
    shape,
    lengthMm,
    widthMm,
    heightMm,
    thicknessMm,
    legStyle: resolvedStyle,
    legDefinition: legDef,
    legSizeVariant: sizeVariant,
    legCount: placements.length,
    legPlacements: placements,
    clearanceMm,
    legHeightMm,
    isValid,
    warnings,
    wasAutoSwitched,
    autoSwitchReason,
  };
}
