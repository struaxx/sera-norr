// ============================================
// SERA NORR - Geometry-First 3D Table Mesh (V3)
// ============================================
// 9 leg styles, rule-driven placement, monolith textures
// AXIS: X = length, Z = width, Y = height (up)

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
// CONSTANTS
// ============================================
const CONE_TAPER_RATIO = 0.65;
const HOURGLASS_WAIST_RATIO = 0.4;

// ============================================
// STONE MATERIAL
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

function applyPlanarUV(geometry: THREE.BufferGeometry, lengthM: number, widthM: number) {
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  if (!pos || !uv) return;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
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
      const ellipse = new THREE.Shape();
      ellipse.absellipse(0, 0, lengthM / 2, widthM / 2, 0, Math.PI * 2, false, 0);
      const geo = new THREE.ExtrudeGeometry(ellipse, { depth: thicknessM, bevelEnabled: false });
      applyPlanarUV(geo, lengthM, widthM);
      return geo;
    }
    case 'ovale': {
      const shape2d = new THREE.Shape();
      const hw = lengthM / 2;
      const hd = widthM / 2;
      const capR = Math.min(hd, hw);
      const straight = hw - capR;
      const arcSegments = 32;

      shape2d.moveTo(-straight, hd);
      shape2d.lineTo(straight, hd);
      for (let i = 1; i <= arcSegments; i++) {
        const angle = Math.PI / 2 - (Math.PI * i / arcSegments);
        shape2d.lineTo(straight + capR * Math.cos(angle), capR * Math.sin(angle));
      }
      shape2d.lineTo(-straight, -hd);
      for (let i = 1; i <= arcSegments; i++) {
        const angle = -Math.PI / 2 - (Math.PI * i / arcSegments);
        shape2d.lineTo(-straight + capR * Math.cos(angle), capR * Math.sin(angle));
      }
      shape2d.closePath();

      const geo = new THREE.ExtrudeGeometry(shape2d, { depth: thicknessM, bevelEnabled: false });
      applyPlanarUV(geo, lengthM, widthM);
      return geo;
    }
    case 'corner': {
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

      const geo = new THREE.ExtrudeGeometry(rr, { depth: thicknessM, bevelEnabled: false });
      applyPlanarUV(geo, lengthM, widthM);
      return geo;
    }
    case 'cut-corner': {
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

      const geo = new THREE.ExtrudeGeometry(cc, { depth: thicknessM, bevelEnabled: false });
      applyPlanarUV(geo, lengthM, widthM);
      return geo;
    }
    default: {
      return new THREE.BoxGeometry(lengthM, thicknessM, widthM);
    }
  }
}

function getTabletopTransform(
  shape: RuleShape,
  legHeightM: number,
  thicknessM: number,
): { position: [number, number, number]; rotation: [number, number, number] } {
  if (shape === 'ellips' || shape === 'ovale' || shape === 'corner' || shape === 'cut-corner') {
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
// LEG GEOMETRY COMPONENTS (9 styles)
// ============================================

interface LegProps {
  radiusM: number;
  heightM: number;
  stoneId?: string;
}

// --- Cylindrical: straight cylinder, equal top/bottom radius ---
function CylindricalLeg({ radiusM, heightM, stoneId }: LegProps) {
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radiusM, radiusM, heightM, 48]} />
      <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
    </mesh>
  );
}

// --- Cylindrical Fluted: 12-sided cylinder ---
function CylindricalFlutedLeg({ radiusM, heightM, stoneId }: LegProps) {
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radiusM, radiusM, heightM, 12, 1]} />
      <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
    </mesh>
  );
}

// --- Conical: tapered cone ---
function ConicalLeg({ radiusM, heightM, stoneId }: LegProps) {
  const topRadius = radiusM * CONE_TAPER_RATIO;
  return (
    <mesh position={[0, heightM / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[topRadius, radiusM, heightM, 48]} />
      <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
    </mesh>
  );
}

// --- Hourglass: organic baluster shape (wide-narrow-bulb-narrow-wide) ---
function HourglassLeg({ radiusM, heightM, stoneId }: LegProps) {
  const geo = useMemo(() => {
    // Lathe profile: series of bulbous curves like reference photo
    const points: THREE.Vector2[] = [];
    const segments = 48;
    const R = radiusM;
    
    // Profile from bottom (y=0) to top (y=heightM):
    // Wide base -> narrow waist -> wide bulb -> narrow neck -> wide top
    for (let i = 0; i <= segments; i++) {
      const t = i / segments; // 0..1 bottom to top
      const y = t * heightM;
      
      // Organic profile using sin waves
      // Base bulge (0-0.2), waist (0.2-0.35), belly bulge (0.35-0.65), neck (0.65-0.8), top bulge (0.8-1.0)
      let r: number;
      if (t < 0.15) {
        // Base: wide, slight taper up
        r = R * (0.95 + 0.05 * Math.cos(t / 0.15 * Math.PI));
      } else if (t < 0.3) {
        // Narrow waist
        const wt = (t - 0.15) / 0.15;
        r = R * (0.55 + 0.4 * Math.cos(wt * Math.PI));
      } else if (t < 0.7) {
        // Central bulb (belly)
        const bt = (t - 0.3) / 0.4;
        r = R * (0.55 + 0.5 * Math.sin(bt * Math.PI));
      } else if (t < 0.85) {
        // Narrow neck
        const nt = (t - 0.7) / 0.15;
        r = R * (0.55 + 0.4 * Math.cos((1 - nt) * Math.PI));
      } else {
        // Top: widens to meet tabletop
        const tt = (t - 0.85) / 0.15;
        r = R * (0.55 + 0.35 * Math.sin(tt * Math.PI * 0.5));
      }
      
      points.push(new THREE.Vector2(Math.max(r, R * 0.15), y));
    }
    
    return new THREE.LatheGeometry(points, 48);
  }, [radiusM, heightM]);

  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
    </mesh>
  );
}

// --- Quartet: single central drum base (round tables only) ---
function QuartetLeg({ radiusM, heightM, stoneId }: LegProps) {
  // Low, wide drum
  const drumHeight = heightM;
  const drumRadius = radiusM * 1.5;
  return (
    <mesh position={[0, drumHeight / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[drumRadius, drumRadius, drumHeight, 48]} />
      <MonolithMaterial stoneId={stoneId} repeatX={2} repeatY={2} />
    </mesh>
  );
}

// --- V-Legs: two thick stone slabs meeting at apex, opening outward < > ---
// Slabs touch at inner tip and fan outward. No crossing.
function VLeg({ radiusM, heightM, stoneId, cornerIndex }: LegProps & { cornerIndex: number }) {
  const slabThickness = radiusM * 0.4;  // thin like real stone panels
  const slabLength = radiusM * 7;       // wide broad slabs
  const vHalfAngle = 22 * (Math.PI / 180); // tighter V for clean meeting point

  // Each slab pivots from the apex (inner edge toward table center)
  // Offset each slab along Z so they meet at center, fan outward
  const pivotOffset = (slabLength / 2) * Math.sin(vHalfAngle);

  // cornerIndex 0 = left (<), cornerIndex 1 = right (>)
  const sign = cornerIndex === 0 ? 1 : -1;

  return (
    <group>
      {/* Slab A */}
      <mesh
        position={[
          sign * (slabLength / 2) * (1 - Math.cos(vHalfAngle)) * 0.5,
          heightM / 2,
          pivotOffset
        ]}
        rotation={[0, sign * vHalfAngle, 0]}
        castShadow receiveShadow
      >
        <boxGeometry args={[slabThickness, heightM, slabLength]} />
        <MonolithMaterial stoneId={stoneId} repeatX={1} repeatY={2} />
      </mesh>
      {/* Slab B (mirrored on Z) */}
      <mesh
        position={[
          sign * (slabLength / 2) * (1 - Math.cos(vHalfAngle)) * 0.5,
          heightM / 2,
          -pivotOffset
        ]}
        rotation={[0, -sign * vHalfAngle, 0]}
        castShadow receiveShadow
      >
        <boxGeometry args={[slabThickness, heightM, slabLength]} />
        <MonolithMaterial stoneId={stoneId} repeatX={1} repeatY={2} />
      </mesh>
    </group>
  );
}

// --- D-Legs: half-cylinder (D-profile), flat side facing center ---
function DLeg({ radiusM, heightM, stoneId, cornerIndex }: LegProps & { cornerIndex: number }) {
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(radiusM * 1.5, radiusM * 1.5, heightM, 24, 1, false, 0, Math.PI);
    return g;
  }, [radiusM, heightM]);

  // Rotate flat side toward center
  const rotY = cornerIndex === 0 ? Math.PI / 2 : -Math.PI / 2;

  return (
    <mesh position={[0, heightM / 2, 0]} rotation={[0, rotY, 0]} geometry={geo} castShadow receiveShadow>
      <MonolithMaterial stoneId={stoneId} repeatX={1} repeatY={1.5} />
    </mesh>
  );
}

// --- Rounded Legs: cylinder with sphere on bottom ---
function RoundedLeg({ radiusM, heightM, stoneId }: LegProps) {
  const cylHeight = heightM - radiusM;
  return (
    <group>
      <mesh position={[0, radiusM + cylHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radiusM, radiusM, cylHeight, 16]} />
        <MonolithMaterial stoneId={stoneId} repeatX={0.5} repeatY={1.5} />
      </mesh>
      <mesh position={[0, radiusM, 0]} castShadow receiveShadow>
        <sphereGeometry args={[radiusM, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <MonolithMaterial stoneId={stoneId} repeatX={0.5} repeatY={0.5} />
      </mesh>
    </group>
  );
}

// --- Curved Legs: slightly curved cylinder using tube geometry ---
function CurvedLeg({ radiusM, heightM, stoneId, cornerIndex }: LegProps & { cornerIndex: number }) {
  const geo = useMemo(() => {
    // Subtle outward curve
    const curveDir = cornerIndex < 2 ? -1 : 1;
    const xBow = cornerIndex % 2 === 0 ? -0.02 : 0.02;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(xBow * heightM, heightM * 0.5, curveDir * 0.015 * heightM),
      new THREE.Vector3(0, heightM, 0),
    );
    return new THREE.TubeGeometry(curve, 16, radiusM, 12, false);
  }, [radiusM, heightM, cornerIndex]);

  return (
    <mesh geometry={geo} castShadow receiveShadow>
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

  return (
    <group>
      {resolved.legPlacements.map((placement, i) => {
        const xM = mmToM(placement.x);
        const zM = mmToM(placement.z);
        const style = resolved.legStyle;

        return (
          <group key={i} position={[xM, 0, zM]}>
            {style === 'cylindrical' && (
              <CylindricalLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {style === 'cylindrical_fluted' && (
              <CylindricalFlutedLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {style === 'conical' && (
              <ConicalLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {style === 'hourglass' && (
              <HourglassLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {style === 'quartet_legs' && (
              <QuartetLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {style === 'v_legs' && (
              <VLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} cornerIndex={i} />
            )}
            {style === 'd_legs' && (
              <DLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} cornerIndex={i} />
            )}
            {style === 'rounded_legs' && (
              <RoundedLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
            )}
            {style === 'curved_legs' && (
              <CurvedLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} cornerIndex={i} />
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
