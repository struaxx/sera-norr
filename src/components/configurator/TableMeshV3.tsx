// ============================================
// SERA NORR - Geometry-First 3D Table Mesh (V3)
// ============================================
// 9 leg styles, rule-driven placement, monolith textures
// AXIS: X = length, Z = width, Y = height (up)

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useTexture, useGLTF } from '@react-three/drei';
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

// --- Hourglass: loaded from GLB model ---
const HOURGLASS_GLB_PATH = '/models/hourglass-leg.glb';

function HourglassFullTable({ 
  lengthM, widthM, heightM, stoneId 
}: { 
  lengthM: number; widthM: number; heightM: number; stoneId?: string 
}) {
  const { scene } = useGLTF(HOURGLASS_GLB_PATH);

  const scaledScene = useMemo(() => {
    const clone = scene.clone(true);

    // Compute bounding box of the GLB model
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);

    // Scale to match configured table dimensions
    // GLB has its own proportions — scale X to match length, Z to match width, Y to match height
    const scaleX = lengthM / size.x;
    const scaleY = heightM / size.y;
    const scaleZ = widthM / size.z;

    clone.scale.set(scaleX, scaleY, scaleZ);

    // Position: bottom at y=0, centered on x/z
    clone.position.set(
      -center.x * scaleX,
      -box.min.y * scaleY,
      -center.z * scaleZ
    );

    return clone;
  }, [scene, lengthM, widthM, heightM]);

  // Apply stone texture to all meshes
  const texturePath = get3DTexture(stoneId ?? 'calacatta-viola');
  const texture = useTexture(texturePath);

  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.colorSpace = THREE.SRGBColorSpace;

    scaledScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.3,
          metalness: 0.05,
          envMapIntensity: 0.6,
        });
      }
    });
  }, [scaledScene, texture, stoneId]);

  return <primitive object={scaledScene} />;
}

// Preload GLB
useGLTF.preload(HOURGLASS_GLB_PATH);

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

// --- D-Legs: half-cylinder — curved outside, flat inside, wider/bigger ---
function DLeg({ radiusM, heightM, stoneId, cornerIndex }: LegProps & { cornerIndex: number }) {
  const geo = useMemo(() => {
    const r = radiusM * 2.5; // wider/bigger
    // D-shape from top: half circle (curved outside) + flat chord (inside facing center)
    const shape2d = new THREE.Shape();
    const segments = 32;

    // Flat side: straight line along Z axis (inner side)
    shape2d.moveTo(0, -r);
    shape2d.lineTo(0, r);

    // Curved side: semicircle (outer side)
    for (let i = 1; i <= segments; i++) {
      const angle = Math.PI / 2 - (Math.PI * i / segments);
      shape2d.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }
    shape2d.closePath();

    const g = new THREE.ExtrudeGeometry(shape2d, {
      depth: heightM,
      bevelEnabled: false,
    });

    return g;
  }, [radiusM, heightM]);

  // Extrude is along Z → rotate so it goes Y-up
  // cornerIndex 0 = left end, flat faces right (toward center)
  // cornerIndex 1 = right end, flat faces left (toward center)
  const rotZ = cornerIndex === 0 ? 0 : Math.PI;

  return (
    <group rotation={[-Math.PI / 2, 0, rotZ]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
      </mesh>
    </group>
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
            {/* hourglass handled at TableMeshV3 level as full GLB */}
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
  const totalHeightM = legHeightM + thicknessM;

  const isHourglass = resolved.legStyle === 'hourglass';

  const textureScale = stoneId ? getTextureScale(stoneId) : 0.6;
  const topRepeatX = Math.max(1, lengthM / textureScale);
  const topRepeatY = Math.max(1, widthM / textureScale);

  const topGeometry = useMemo(
    () => createTabletopGeometry(shape, lengthM, widthM, thicknessM),
    [shape, lengthM, widthM, thicknessM]
  );

  const topTransform = getTabletopTransform(shape, legHeightM, thicknessM);

  // Hourglass: render full GLB model (includes tabletop + legs)
  if (isHourglass) {
    return (
      <group>
        <GroundPlane />
        <HourglassFullTable
          lengthM={lengthM}
          widthM={widthM}
          heightM={totalHeightM}
          stoneId={stoneId}
        />
      </group>
    );
  }

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
