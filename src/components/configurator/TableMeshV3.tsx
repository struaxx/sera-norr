// ============================================
// SERA NORR - Geometry-First 3D Table Mesh (V3)
// ============================================
// Rules:
// - All dimensions in mm, convert at boundary via mmToM
// - Tabletop origin = center of top surface
// - Leg pivot = floor contact point (bottom center)
// - Legs NEVER scale non-uniformly
// - Clay material for geometry validation

import { useMemo } from 'react';
import * as THREE from 'three';
import { mmToM } from '@/lib/configurator/units';
import { resolveConfiguration, type ResolvedConfiguration } from '@/lib/configurator/engine/resolveConfiguration';
import type { RuleShape, RuleLegStyle } from '@/lib/configurator/rules/productRules';

// ============================================
// PROPS
// ============================================

export interface TableMeshV3Props {
  shape: RuleShape;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  thicknessMm: number;
  legStyle?: RuleLegStyle;
}

// ============================================
// CLAY MATERIAL (neutral matte for geometry validation)
// ============================================

const CLAY_COLOR = '#C8BEB4';
const CLAY_ROUGHNESS = 0.85;
const CLAY_METALNESS = 0;

function ClayMaterial() {
  return (
    <meshStandardMaterial
      color={CLAY_COLOR}
      roughness={CLAY_ROUGHNESS}
      metalness={CLAY_METALNESS}
    />
  );
}

// ============================================
// TABLETOP GEOMETRY
// ============================================

function createTabletopGeometry(
  shape: RuleShape,
  lengthM: number,
  widthM: number,
  thicknessM: number,
): THREE.BufferGeometry {
  switch (shape) {
    case 'round': {
      const r = lengthM / 2;
      return new THREE.CylinderGeometry(r, r, thicknessM, 64);
    }
    case 'oval': {
      // Ellipse extruded
      const ellipse = new THREE.Shape();
      ellipse.absellipse(0, 0, lengthM / 2, widthM / 2, 0, Math.PI * 2, false, 0);
      return new THREE.ExtrudeGeometry(ellipse, {
        depth: thicknessM,
        bevelEnabled: false,
      });
    }
    case 'racetrack': {
      // Capsule/stadium shape
      const shape2d = new THREE.Shape();
      const hw = lengthM / 2;
      const hd = widthM / 2;
      const capR = hd; // semicircle radius = half width
      const straight = hw - capR;
      
      shape2d.moveTo(straight, hd);
      shape2d.lineTo(-straight, hd);
      shape2d.absarc(-straight, 0, capR, Math.PI / 2, -Math.PI / 2, true);
      shape2d.lineTo(straight, -hd);
      shape2d.absarc(straight, 0, capR, -Math.PI / 2, Math.PI / 2, true);
      shape2d.closePath();

      return new THREE.ExtrudeGeometry(shape2d, {
        depth: thicknessM,
        bevelEnabled: false,
      });
    }
    case 'square': {
      return new THREE.BoxGeometry(lengthM, thicknessM, widthM);
    }
    case 'rect':
    default: {
      return new THREE.BoxGeometry(lengthM, thicknessM, widthM);
    }
  }
}

/** Get position & rotation for the tabletop based on shape type */
function getTabletopTransform(
  shape: RuleShape,
  legHeightM: number,
  thicknessM: number,
): { position: [number, number, number]; rotation: [number, number, number] } {
  // For extruded shapes (oval, racetrack) the geometry is on XY plane, depth along Z
  // We need to rotate -90° on X to lay flat, then position
  if (shape === 'oval' || shape === 'racetrack') {
    return {
      position: [0, legHeightM + thicknessM, 0],
      rotation: [-Math.PI / 2, 0, 0],
    };
  }
  // Box-based (rect, square) and cylinder (round) are already correct
  return {
    position: [0, legHeightM + thicknessM / 2, 0],
    rotation: [0, 0, 0],
  };
}

// ============================================
// LEG GEOMETRY
// ============================================

function PedestalLeg({ radiusM, heightM }: { radiusM: number; heightM: number }) {
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radiusM, radiusM, heightM, 48]} />
      <ClayMaterial />
    </mesh>
  );
}

function FlutedPedestalLeg({ radiusM, heightM }: { radiusM: number; heightM: number }) {
  // Fluted = cylinder with fewer segments for faceted look
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radiusM, radiusM * 0.95, heightM, 12, 1]} />
      <ClayMaterial />
    </mesh>
  );
}

function TrestleLeg({ radiusM, heightM, widthM }: { radiusM: number; heightM: number; widthM: number }) {
  // Trestle = flat slab leg
  const slabWidth = widthM * 0.7;
  const slabThickness = radiusM * 2;
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[slabWidth, heightM, slabThickness]} />
      <ClayMaterial />
    </mesh>
  );
}

function FourLegSingle({ radiusM, heightM }: { radiusM: number; heightM: number }) {
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radiusM, radiusM, heightM, 16]} />
      <ClayMaterial />
    </mesh>
  );
}

// ============================================
// LEG RENDERER (rule-driven placement)
// ============================================

function LegsGroup({ resolved }: { resolved: ResolvedConfiguration }) {
  const legHeightM = mmToM(resolved.legHeightMm);
  const legRadiusM = mmToM(resolved.legSizeVariant.radiusMm);
  const widthM = mmToM(resolved.widthMm);

  return (
    <group>
      {resolved.legPlacements.map((placement, i) => {
        const xM = mmToM(placement.x);
        const zM = mmToM(placement.z);

        return (
          <group key={i} position={[xM, 0, zM]}>
            {(resolved.legStyle === 'pedestal' || resolved.legStyle === 'double_pedestal') && (
              <PedestalLeg radiusM={legRadiusM} heightM={legHeightM} />
            )}
            {(resolved.legStyle === 'fluted_pedestal' || resolved.legStyle === 'fluted_double') && (
              <FlutedPedestalLeg radiusM={legRadiusM} heightM={legHeightM} />
            )}
            {resolved.legStyle === 'four_legs' && (
              <FourLegSingle radiusM={legRadiusM} heightM={legHeightM} />
            )}
            {resolved.legStyle === 'trestle' && (
              <TrestleLeg radiusM={legRadiusM} heightM={legHeightM} widthM={widthM} />
            )}
          </group>
        );
      })}
    </group>
  );
}

// ============================================
// GROUND PLANE
// ============================================

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial color="#E8E4E0" roughness={0.95} metalness={0} />
    </mesh>
  );
}

// ============================================
// MAIN TABLE MESH COMPONENT
// ============================================

export function TableMeshV3(props: TableMeshV3Props) {
  const { shape, lengthMm, widthMm, heightMm, thicknessMm, legStyle } = props;

  // Resolve configuration through rule engine
  const resolved = useMemo(() =>
    resolveConfiguration({
      shape,
      lengthMm,
      widthMm,
      heightMm,
      thicknessMm,
      requestedLegStyle: legStyle,
    }),
    [shape, lengthMm, widthMm, heightMm, thicknessMm, legStyle]
  );

  // Convert to meters at scene boundary
  const lengthM = mmToM(lengthMm);
  const widthM = mmToM(widthMm);
  const thicknessM = mmToM(thicknessMm);
  const legHeightM = mmToM(resolved.legHeightMm);

  // Create tabletop geometry
  const topGeometry = useMemo(
    () => createTabletopGeometry(shape, lengthM, widthM, thicknessM),
    [shape, lengthM, widthM, thicknessM]
  );

  const topTransform = getTabletopTransform(shape, legHeightM, thicknessM);

  // Runtime assertions (dev only)
  if (process.env.NODE_ENV === 'development') {
    const topBottomY = topTransform.position[1] - thicknessM / 2;
    const legTopY = legHeightM;
    if (Math.abs(topBottomY - legTopY) > 0.001) {
      console.warn(`[TableMesh] Gap/overlap: topBottom=${topBottomY.toFixed(4)}, legTop=${legTopY.toFixed(4)}`);
    }
  }

  return (
    <group>
      {/* Ground plane at y=0 */}
      <GroundPlane />

      {/* Legs: pivot at floor (y=0) */}
      <LegsGroup resolved={resolved} />

      {/* Tabletop: center of top surface */}
      <mesh
        position={topTransform.position}
        rotation={topTransform.rotation}
        geometry={topGeometry}
        castShadow
        receiveShadow
      >
        <ClayMaterial />
      </mesh>
    </group>
  );
}

// Re-export resolved type for debug overlay
export type { ResolvedConfiguration };
export { resolveConfiguration as resolveForDebug };
