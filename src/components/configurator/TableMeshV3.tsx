// ============================================
// SERA NORR - Geometry-First 3D Table Mesh (V3)
// ============================================
// Rules:
// - All dimensions in mm, convert at boundary via mmToM
// - Tabletop origin = center of top surface
// - Leg pivot = floor contact point (bottom center)
// - Legs NEVER scale non-uniformly
// - Stone texture applied to full monolith (top + legs)
// AXIS CONVENTION:
// X = length (longest), Z = width (depth), Y = height (up)

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
const CONE_TAPER_RATIO = 0.65;

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
// PLANAR UV FIX
// ============================================
// After creating ExtrudeGeometry, overwrite UVs with planar top-down projection
// to eliminate zebra-stripe artifacts.

function applyPlanarUV(geometry: THREE.BufferGeometry, lengthM: number, widthM: number) {
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  if (!pos || !uv) return;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Map x,y (shape plane) to 0..1 UV
    uv.setXY(i, x / lengthM + 0.5, y / widthM + 0.5);
  }
  uv.needsUpdate = true;
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
    case 'ellips': {
      // True ellipse
      const ellipse = new THREE.Shape();
      ellipse.absellipse(0, 0, lengthM / 2, widthM / 2, 0, Math.PI * 2, false, 0);
      const geo = new THREE.ExtrudeGeometry(ellipse, {
        depth: thicknessM,
        bevelEnabled: false,
      });
      applyPlanarUV(geo, lengthM, widthM);
      return geo;
    }
    case 'ovale': {
      // Stadium/racetrack shape — explicit point-by-point to avoid absarc direction bugs
      const shape2d = new THREE.Shape();
      const hw = lengthM / 2;
      const hd = widthM / 2;
      const capR = Math.min(hd, hw); // cap radius = half depth
      const straight = hw - capR;
      const arcSegments = 32;

      // Start top-left, go clockwise
      shape2d.moveTo(-straight, hd);
      shape2d.lineTo(straight, hd);

      // Right semicircle (top to bottom)
      for (let i = 1; i <= arcSegments; i++) {
        const angle = Math.PI / 2 - (Math.PI * i / arcSegments);
        shape2d.lineTo(straight + capR * Math.cos(angle), capR * Math.sin(angle));
      }

      // Bottom edge (right to left)
      shape2d.lineTo(-straight, -hd);

      // Left semicircle (bottom to top)
      for (let i = 1; i <= arcSegments; i++) {
        const angle = -Math.PI / 2 + (Math.PI * i / arcSegments);
        shape2d.lineTo(-straight + capR * Math.cos(angle), capR * Math.sin(angle));
      }
      shape2d.closePath();

      const geo = new THREE.ExtrudeGeometry(shape2d, {
        depth: thicknessM,
        bevelEnabled: false,
      });
      applyPlanarUV(geo, lengthM, widthM);
      return geo;
    }
    case 'corner': {
      // Rounded rectangle
      const cornerRadius = Math.min(lengthM, widthM) * 0.05;
      const rr = new THREE.Shape();
      const hw = lengthM / 2;
      const hd = widthM / 2;
      const cr = cornerRadius;

      rr.moveTo(-hw + cr, -hd);
      rr.lineTo(hw - cr, -hd);
      rr.absarc(hw - cr, -hd + cr, cr, -Math.PI / 2, 0, false);
      rr.lineTo(hw, hd - cr);
      rr.absarc(hw - cr, hd - cr, cr, 0, Math.PI / 2, false);
      rr.lineTo(-hw + cr, hd);
      rr.absarc(-hw + cr, hd - cr, cr, Math.PI / 2, Math.PI, false);
      rr.lineTo(-hw, -hd + cr);
      rr.absarc(-hw + cr, -hd + cr, cr, Math.PI, Math.PI * 1.5, false);
      rr.closePath();

      const geo = new THREE.ExtrudeGeometry(rr, {
        depth: thicknessM,
        bevelEnabled: false,
      });
      applyPlanarUV(geo, lengthM, widthM);
      return geo;
    }
    case 'cut-corner': {
      // Chamfered rectangle (45° cut corners)
      const chamfer = Math.min(lengthM, widthM) * 0.1;
      const cc = new THREE.Shape();
      const hw = lengthM / 2;
      const hd = widthM / 2;

      cc.moveTo(-hw + chamfer, -hd);
      cc.lineTo(hw - chamfer, -hd);
      cc.lineTo(hw, -hd + chamfer);
      cc.lineTo(hw, hd - chamfer);
      cc.lineTo(hw - chamfer, hd);
      cc.lineTo(-hw + chamfer, hd);
      cc.lineTo(-hw, hd - chamfer);
      cc.lineTo(-hw, -hd + chamfer);
      cc.closePath();

      const geo = new THREE.ExtrudeGeometry(cc, {
        depth: thicknessM,
        bevelEnabled: false,
      });
      applyPlanarUV(geo, lengthM, widthM);
      return geo;
    }
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
  // ExtrudeGeometry shapes need rotation to lie flat (XZ plane)
  if (shape === 'ellips' || shape === 'ovale' || shape === 'corner' || shape === 'cut-corner') {
    return {
      position: [0, legHeightM + thicknessM, 0],
      rotation: [-Math.PI / 2, 0, 0],
    };
  }
  // CylinderGeometry (round) is already Y-axis aligned
  return {
    position: [0, legHeightM + thicknessM / 2, 0],
    rotation: [0, 0, 0],
  };
}

// ============================================
// LEG GEOMETRY
// ============================================

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
      <boxGeometry args={[slabThickness, heightM, slabWidth]} />
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
            {resolved.legStyle === 'pedestal' && (
              <ConePedestalLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {resolved.legStyle === 'fluted' && (
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

  const lengthM = mmToM(lengthMm);
  const widthM = mmToM(widthMm);
  const thicknessM = mmToM(thicknessMm);
  const legHeightM = mmToM(resolved.legHeightMm);

  const textureScale = stoneId ? getTextureScale(stoneId) : 0.6;
  const topRepeatX = Math.max(1, lengthM / textureScale);
  const topRepeatY = Math.max(1, widthM / textureScale);

  const topGeometry = useMemo(
    () => createTabletopGeometry(shape, lengthM, widthM, thicknessM),
    [shape, lengthM, widthM, thicknessM]
  );

  const topTransform = getTabletopTransform(shape, legHeightM, thicknessM);

  return (
    <group>
      <GroundPlane />
      <LegsGroup resolved={resolved} stoneId={stoneId} />
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

export type { ResolvedConfiguration };
export { resolveConfiguration as resolveForDebug };
