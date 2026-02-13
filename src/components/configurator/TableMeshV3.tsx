// ============================================
// SERA NORR - Geometry-First 3D Table Mesh (V3)
// ============================================
// Rules:
// - All dimensions in mm, convert at boundary via mmToM
// - Tabletop origin = center of top surface
// - Leg pivot = floor contact point (bottom center)
// - Legs NEVER scale non-uniformly
// - Pedestal/double_pedestal = tapered cones (wider bottom, narrower top)
// - Stone texture applied to full monolith (top + legs)

import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { mmToM } from '@/lib/configurator/units';
import { resolveConfiguration, type ResolvedConfiguration } from '@/lib/configurator/engine/resolveConfiguration';
import { get3DTexture, getTextureScale } from '@/lib/configurator/texture-resolver';
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
  stoneId?: string;
}

// ============================================
// CONE TAPER RATIO
// ============================================
// From the reference photo: bottom is wider, top is narrower
// Ratio = topRadius / bottomRadius ≈ 0.55
const CONE_TAPER_RATIO = 0.55;

// ============================================
// STONE MATERIAL (monolith: same texture on top + legs)
// ============================================

function StoneMaterial({ stoneId, repeatX = 2, repeatY = 2 }: { stoneId: string; repeatX?: number; repeatY?: number }) {
  const texturePath = get3DTexture(stoneId);
  const texture = useTexture(texturePath);

  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture, repeatX, repeatY]);

  return (
    <meshStandardMaterial
      map={texture}
      roughness={0.35}
      metalness={0.05}
      envMapIntensity={1.2}
    />
  );
}

// Fallback clay for stones without textures
function ClayMaterial() {
  return (
    <meshStandardMaterial
      color="#C8BEB4"
      roughness={0.85}
      metalness={0}
    />
  );
}

function MonolithMaterial({ stoneId, repeatX, repeatY }: { stoneId?: string; repeatX?: number; repeatY?: number }) {
  if (stoneId) {
    return <StoneMaterial stoneId={stoneId} repeatX={repeatX} repeatY={repeatY} />;
  }
  return <ClayMaterial />;
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
      const shape2d = new THREE.Shape();
      const hw = lengthM / 2;
      const hd = widthM / 2;
      const capR = hd;
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
  if (shape === 'oval' || shape === 'racetrack') {
    return {
      position: [0, legHeightM + thicknessM, 0],
      rotation: [-Math.PI / 2, 0, 0],
    };
  }
  return {
    position: [0, legHeightM + thicknessM / 2, 0],
    rotation: [0, 0, 0],
  };
}

// ============================================
// LEG GEOMETRY
// ============================================

/** Tapered cone pedestal — wider at bottom, narrower at top (like the reference photo) */
function ConePedestalLeg({ radiusM, heightM, stoneId }: { radiusM: number; heightM: number; stoneId?: string }) {
  const bottomRadius = radiusM;
  const topRadius = radiusM * CONE_TAPER_RATIO;

  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[topRadius, bottomRadius, heightM, 48]} />
      <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
    </mesh>
  );
}

/** Fluted cone pedestal — faceted tapered cone */
function FlutedConeLeg({ radiusM, heightM, stoneId }: { radiusM: number; heightM: number; stoneId?: string }) {
  const bottomRadius = radiusM;
  const topRadius = radiusM * CONE_TAPER_RATIO;

  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[topRadius, bottomRadius, heightM, 12, 1]} />
      <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
    </mesh>
  );
}

function TrestleLeg({ radiusM, heightM, widthM, stoneId }: { radiusM: number; heightM: number; widthM: number; stoneId?: string }) {
  const slabWidth = widthM * 0.7;
  const slabThickness = radiusM * 2;
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[slabWidth, heightM, slabThickness]} />
      <MonolithMaterial stoneId={stoneId} repeatX={1} repeatY={2} />
    </mesh>
  );
}

function FourLegSingle({ radiusM, heightM, stoneId }: { radiusM: number; heightM: number; stoneId?: string }) {
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radiusM, radiusM, heightM, 16]} />
      <MonolithMaterial stoneId={stoneId} repeatX={0.5} repeatY={1.5} />
    </mesh>
  );
}

// ============================================
// LEG RENDERER (rule-driven placement)
// ============================================

function LegsGroup({ resolved, stoneId }: { resolved: ResolvedConfiguration; stoneId?: string }) {
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
              <ConePedestalLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {(resolved.legStyle === 'fluted_pedestal' || resolved.legStyle === 'fluted_double') && (
              <FlutedConeLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {resolved.legStyle === 'four_legs' && (
              <FourLegSingle radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {resolved.legStyle === 'trestle' && (
              <TrestleLeg radiusM={legRadiusM} heightM={legHeightM} widthM={widthM} stoneId={stoneId} />
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
  const { shape, lengthMm, widthMm, heightMm, thicknessMm, legStyle, stoneId } = props;

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

  // Texture repeat based on stone scale and table size
  const textureScale = stoneId ? getTextureScale(stoneId) : 0.6;
  const topRepeatX = Math.max(1, lengthM / textureScale);
  const topRepeatY = Math.max(1, widthM / textureScale);

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
      <LegsGroup resolved={resolved} stoneId={stoneId} />

      {/* Tabletop: center of top surface */}
      <mesh
        position={topTransform.position}
        rotation={topTransform.rotation}
        geometry={topGeometry}
        castShadow
        receiveShadow
      >
        <MonolithMaterial stoneId={stoneId} repeatX={topRepeatX} repeatY={topRepeatY} />
      </mesh>
    </group>
  );
}

// Re-export resolved type for debug overlay
export type { ResolvedConfiguration };
export { resolveConfiguration as resolveForDebug };
