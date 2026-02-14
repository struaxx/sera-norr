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
  chooseLegSizeVariant,
  determineLegCount,
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
// AXIS CONVENTION:
// X = length axis (horizontal, longest dimension)
// Z = width axis (depth)
// Y = height (up)

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeClearance(legRadiusMm: number): number {
  return Math.max(80, legRadiusMm * 1.2);
}

function computeSinglePedestalPlacement(): LegPlacement[] {
  return [{ x: 0, z: 0 }];
}

function computeDoublePedestalPlacement(
  lengthMm: number,
  legRadiusMm: number,
): LegPlacement[] {
  const clearance = computeClearance(legRadiusMm);
  const maxOffset = lengthMm / 2 - clearance - legRadiusMm;
  const xOffset = clamp(lengthMm * 0.25, 320, maxOffset);
  return [
    { x: -xOffset, z: 0 },
    { x: xOffset, z: 0 },
  ];
}

function computeFourLegsPlacement(
  lengthMm: number,
  widthMm: number,
  legRadiusMm: number,
): LegPlacement[] {
  const clearance = computeClearance(legRadiusMm);
  const maxXOffset = lengthMm / 2 - clearance - legRadiusMm;
  const maxZOffset = widthMm / 2 - clearance - legRadiusMm;
  const xOffset = clamp(lengthMm * 0.28, 260, maxXOffset);
  const zOffset = clamp(widthMm * 0.22, 220, maxZOffset);
  return [
    { x: -xOffset, z: -zOffset },
    { x: xOffset, z: -zOffset },
    { x: -xOffset, z: zOffset },
    { x: xOffset, z: zOffset },
  ];
}

function computeTrestlePlacement(
  lengthMm: number,
  legRadiusMm: number,
): LegPlacement[] {
  const clearance = computeClearance(legRadiusMm);
  const maxOffset = lengthMm / 2 - clearance - legRadiusMm;
  const xOffset = clamp(lengthMm * 0.30, 350, maxOffset);
  return [
    { x: -xOffset, z: 0 },
    { x: xOffset, z: 0 },
  ];
}

function computePlacements(
  legStyle: RuleLegStyle,
  legCount: number,
  lengthMm: number,
  widthMm: number,
  legRadiusMm: number,
): LegPlacement[] {
  if (legStyle === 'four_legs') {
    return computeFourLegsPlacement(lengthMm, widthMm, legRadiusMm);
  }
  if (legStyle === 'trestle') {
    return computeTrestlePlacement(lengthMm, legRadiusMm);
  }
  // Pedestal or Fluted: 1 or 2 based on legCount
  if (legCount === 1) {
    return computeSinglePedestalPlacement();
  }
  return computeDoublePedestalPlacement(lengthMm, legRadiusMm);
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
    resolvedStyle = requested;
  } else if (requested) {
    wasAutoSwitched = true;
    const def = LEG_DEFINITIONS.find(l => l.id === requested);
    if (def && !def.compatibleShapes.includes(shape)) {
      autoSwitchReason = `${def.label} is not compatible with ${shape}. Auto-switched.`;
    } else if (def && lengthMm < def.minLengthMm) {
      autoSwitchReason = `${def.label} requires min length ${def.minLengthMm}mm. Auto-switched.`;
    } else {
      autoSwitchReason = `Requested leg style not valid. Auto-switched.`;
    }
    warnings.push(autoSwitchReason);

    const shapeDef = SHAPE_DEFINITIONS.find(s => s.id === shape);
    const fallback = shapeDef?.defaultLegStyle;
    if (fallback && validStyles.find(l => l.id === fallback)) {
      resolvedStyle = fallback;
    } else {
      resolvedStyle = validStyles[0]?.id ?? 'pedestal';
    }
  } else {
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

  // 4. Auto-determine leg count
  const legCount = determineLegCount(resolvedStyle, shape, lengthMm);

  // 5. Choose size variant
  const sizeVariant = chooseLegSizeVariant(legDef, shape, lengthMm, widthMm);

  // 6. Compute leg height
  const legHeightMm = heightMm - thicknessMm;

  // 7. Compute placements
  const placements = computePlacements(
    resolvedStyle,
    legCount,
    lengthMm,
    widthMm,
    sizeVariant.radiusMm,
  );

  // 8. Compute clearance
  const clearanceMm = computeClearance(sizeVariant.radiusMm);

  // 9. Validate
  for (const p of placements) {
    const halfL = lengthMm / 2;
    const halfW = widthMm / 2;
    if (Math.abs(p.x) + sizeVariant.radiusMm > halfL) {
      warnings.push(`Leg at x=${p.x}mm extends beyond table length.`);
    }
    if (Math.abs(p.z) + sizeVariant.radiusMm > halfW) {
      warnings.push(`Leg at z=${p.z}mm extends beyond table width.`);
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
    legCount,
    legPlacements: placements,
    clearanceMm,
    legHeightMm,
    isValid,
    warnings,
    wasAutoSwitched,
    autoSwitchReason,
  };
}
