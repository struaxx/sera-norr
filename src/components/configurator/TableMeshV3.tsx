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
  if (shape === 'round') {
    // CylinderGeometry is centered on its origin
    return {
      position: [0, legHeightM + thicknessM / 2, 0],
      rotation: [0, 0, 0],
    };
  }
  // ExtrudeGeometry extrudes from z=0 to z=depth; rotation -PI/2 maps +Z to -Y
  // So bottom face = position.y - depth, top face = position.y
  // We want bottom face at legHeightM → position.y = legHeightM + thicknessM
  return {
    position: [0, legHeightM + thicknessM, 0],
    rotation: [-Math.PI / 2, 0, 0],
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

// --- Cylindrical Fluted: single scalloped column with continuous texture ---
function CylindricalFlutedLeg({ radiusM, heightM, stoneId }: LegProps) {
  const fluteCount = 20;
  const fluteDepth = radiusM * 0.15;

  const geo = useMemo(() => {
    const angularSegments = fluteCount * 12;
    const heightSegments = 2;
    
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let iy = 0; iy <= heightSegments; iy++) {
      const v = iy / heightSegments;
      const y = v * heightM;

      for (let ix = 0; ix <= angularSegments; ix++) {
        const u = ix / angularSegments;
        const angle = u * Math.PI * 2;
        
        // Convex flute profile: rounded bulges with sharp narrow grooves
        const phase = (angle * fluteCount) % (Math.PI * 2);
        const normalized = phase / (Math.PI * 2); // 0..1 per flute
        // Cosine gives convex bulge; pow sharpens the groove at edges
        const bulge = Math.cos((normalized - 0.5) * Math.PI); // 1 at center, 0 at edge
        const sharpBulge = Math.pow(Math.max(bulge, 0), 0.6); // flatten top, keep sharp dip
        const r = (radiusM - fluteDepth) + fluteDepth * sharpBulge;
        
        positions.push(Math.cos(angle) * r, y, Math.sin(angle) * r);
        
        // Approximate outward normal
        const nx = Math.cos(angle);
        const nz = Math.sin(angle);
        normals.push(nx, 0, nz);
        
        uvs.push(u, v);
      }
    }

    // Top cap center
    const topCenterIdx = positions.length / 3;
    positions.push(0, heightM, 0);
    normals.push(0, 1, 0);
    uvs.push(0.5, 0.5);

    // Bottom cap center
    const bottomCenterIdx = positions.length / 3;
    positions.push(0, 0, 0);
    normals.push(0, -1, 0);
    uvs.push(0.5, 0.5);

    // Side faces
    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < angularSegments; ix++) {
        const a = iy * (angularSegments + 1) + ix;
        const b = a + 1;
        const c = a + (angularSegments + 1);
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    // Top cap
    const topRow = heightSegments * (angularSegments + 1);
    for (let ix = 0; ix < angularSegments; ix++) {
      indices.push(topCenterIdx, topRow + ix, topRow + ix + 1);
    }

    // Bottom cap
    for (let ix = 0; ix < angularSegments; ix++) {
      indices.push(bottomCenterIdx, ix + 1, ix);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    return geometry;
  }, [radiusM, heightM, fluteCount, fluteDepth]);

  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <MonolithMaterial stoneId={stoneId} repeatX={2} repeatY={2} />
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

// --- Hourglass: sculpted waist profile, single LatheGeometry ---
function HourglassLeg({ radiusM, heightM, stoneId }: LegProps) {
  const geo = useMemo(() => {
    const R = radiusM;
    const H = heightM;

    // Reference: jar/bowl silhouette
    // Straight column with rounded bottom, subtle neck, wide bowl/dish on top
    const profile: [number, number][] = [
      [0.00, 0.90],  // bottom center — rounded fillet
      [0.03, 0.96],  // fillet rising
      [0.06, 1.00],  // reach full column radius
      [0.70, 1.00],  // straight column end
      [0.76, 0.94],  // neck starts — subtle inward curve
      [0.80, 0.88],  // neck deepest point
      [0.84, 0.92],  // neck recovering
      [0.88, 1.05],  // bowl flare begins
      [0.92, 1.22],  // bowl expanding
      [0.96, 1.36],  // bowl nearly full width
      [1.00, 1.42],  // bowl rim — wide dish to meet tabletop
    ];

    // Build smooth curve by subdividing between profile points
    const points: THREE.Vector2[] = [];
    const totalPts = 80;

    for (let i = 0; i <= totalPts; i++) {
      const t = i / totalPts;

      // Find segment
      let seg = profile.length - 2;
      for (let s = 0; s < profile.length - 1; s++) {
        if (t <= profile[s + 1][0]) { seg = s; break; }
      }

      const [y0, r0] = profile[seg];
      const [y1, r1] = profile[seg + 1];
      const localT = y1 === y0 ? 0 : (t - y0) / (y1 - y0);
      const smooth = localT * localT * (3 - 2 * localT);
      const r = (r0 + (r1 - r0) * smooth) * R;

      points.push(new THREE.Vector2(r, t * H));
    }

    const g = new THREE.LatheGeometry(points, 32);
    g.computeVertexNormals();
    return g;
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

// --- V-Legs: two broad stone panels forming a V (< >) from top view ---
// Panels are placed side by side with a gap, NOT overlapping.
// Each panel is a wide flat slab rotated outward from center.
function VLeg({ radiusM, heightM, stoneId, cornerIndex }: LegProps & { cornerIndex: number }) {
  const slabThickness = radiusM * 0.5;  // substantial stone panel
  const slabWidth = radiusM * 5;        // broad panel
  const vHalfAngle = 38 * (Math.PI / 180); // wider V opening for more spread

  // Gap between inner edges so they don't cross
  const gap = slabThickness * 0.3;

  // cornerIndex 0 = left (<), cornerIndex 1 = right (>)
  const sign = cornerIndex === 0 ? 1 : -1;

  return (
    <group>
      {/* Slab A - front */}
      <mesh
        position={[
          sign * Math.sin(vHalfAngle) * slabWidth * 0.5,
          heightM / 2,
          gap + Math.cos(vHalfAngle) * slabWidth * 0.5
        ]}
        rotation={[0, sign * vHalfAngle, 0]}
        castShadow receiveShadow
      >
        <boxGeometry args={[slabThickness, heightM, slabWidth]} />
        <MonolithMaterial stoneId={stoneId} repeatX={1} repeatY={2} />
      </mesh>
      {/* Slab B - back (mirrored on Z) */}
      <mesh
        position={[
          sign * Math.sin(vHalfAngle) * slabWidth * 0.5,
          heightM / 2,
          -(gap + Math.cos(vHalfAngle) * slabWidth * 0.5)
        ]}
        rotation={[0, -sign * vHalfAngle, 0]}
        castShadow receiveShadow
      >
        <boxGeometry args={[slabThickness, heightM, slabWidth]} />
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

// --- Curved Legs: concave cone with waist + subtle top flare (matches travertine reference) ---
function CurvedLeg({ radiusM, heightM, stoneId }: LegProps) {
  const geo = useMemo(() => {
    const segments = 64;
    const points: THREE.Vector2[] = [];
    // Profile: wide base → concave inward → narrow waist at ~65% → subtle flare to top
    const baseRadius = radiusM * 1.6;
    const waistRadius = radiusM * 0.6;
    const topRadius = radiusM * 1.0;
    const waistPos = 0.65; // waist at 65% height

    for (let i = 0; i <= segments; i++) {
      const t = i / segments; // 0 = bottom, 1 = top
      let r: number;
      if (t <= waistPos) {
        // Base to waist: concave inward curve
        const u = t / waistPos;
        // Concave: slow start, fast middle, slow end
        const curve = Math.pow(u, 0.6);
        r = baseRadius + (waistRadius - baseRadius) * curve;
      } else {
        // Waist to top: subtle outward flare
        const u = (t - waistPos) / (1 - waistPos);
        const curve = Math.pow(u, 0.5);
        r = waistRadius + (topRadius - waistRadius) * curve;
      }
      points.push(new THREE.Vector2(Math.max(r, radiusM * 0.2), t * heightM));
    }
    return new THREE.LatheGeometry(points, 48);
  }, [radiusM, heightM]);

  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
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
              <CurvedLeg radiusM={legRadiusM} heightM={legHeightM} stoneId={stoneId} />
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
