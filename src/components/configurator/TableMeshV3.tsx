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

// --- Hourglass: full GLB rendered once, flipped (rotation not scale to preserve normals) ---
const HOURGLASS_GLB = '/models/hourglass-leg-single.glb';

function HourglassLegsUnit({ heightM, stoneId }: { heightM: number; stoneId?: string }) {
  const { scene } = useGLTF(HOURGLASS_GLB);

  const group = useMemo(() => {
    const clone = scene.clone(true);

    // Measure original bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Uniform scale to match leg height
    const s = heightM / size.y;
    clone.scale.set(s, s, s);

    // Flip upside down via rotation (preserves face winding / normals)
    clone.rotation.set(Math.PI, 0, 0);

    // After rotation + scale, recompute bounds and position so bottom sits at y=0, centered on XZ
    clone.updateMatrixWorld(true);
    const finalBox = new THREE.Box3().setFromObject(clone);
    const finalCenter = new THREE.Vector3();
    finalBox.getCenter(finalCenter);
    clone.position.set(-finalCenter.x, -finalBox.min.y, -finalCenter.z);

    return clone;
  }, [scene, heightM]);

  // Apply material
  useEffect(() => {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
      }
    });
  }, [group]);

  return (
    <group>
      <primitive object={group} />
      {/* Apply stone or clay material imperatively */}
      <HourglassMaterialApplier group={group} stoneId={stoneId} />
    </group>
  );
}

function HourglassMaterialApplier({ group, stoneId }: { group: THREE.Object3D; stoneId?: string }) {
  const texturePath = stoneId ? get3DTexture(stoneId) : null;
  const texture = useTexture(texturePath || get3DTexture('bianco-carrara'));

  useEffect(() => {
    const tex = texture.clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;

    const mat = stoneId
      ? new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.05, envMapIntensity: 1.2 })
      : new THREE.MeshStandardMaterial({ color: '#C8BEB4', roughness: 0.85, metalness: 0 });

    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = mat;
      }
    });
  }, [group, texture, stoneId]);

  return null;
}

useGLTF.preload(HOURGLASS_GLB);

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

// --- D-Legs: half-cylinder — curved outside, flat inside ---
function DLeg({ radiusM, heightM, stoneId, cornerIndex }: LegProps & { cornerIndex: number }) {
  const geo = useMemo(() => {
    const r = radiusM * 3.2; // bigger D-legs
    const shape2d = new THREE.Shape();
    const segments = 32;

    // Flat side (inner, faces center): straight line along Y axis in 2D
    shape2d.moveTo(0, -r);
    shape2d.lineTo(0, r);

    // Curved side (outer, faces away from center): semicircle going left (negative X)
    for (let i = 1; i <= segments; i++) {
      const angle = Math.PI / 2 + (Math.PI * i / segments);
      shape2d.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }
    shape2d.closePath();

    const g = new THREE.ExtrudeGeometry(shape2d, {
      depth: heightM,
      bevelEnabled: false,
    });

    return g;
  }, [radiusM, heightM]);

  // Extrude along Z → rotate -PI/2 on X so it goes Y-up
  // cornerIndex 0 = left end (negative X), curved faces outward (more negative X)
  // cornerIndex 1 = right end (positive X), curved faces outward (more positive X)
  // Flip via PI rotation on Z for the right-side leg
  const rotZ = cornerIndex === 0 ? 0 : Math.PI;

  return (
    <group rotation={[-Math.PI / 2, 0, rotZ]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <MonolithMaterial stoneId={stoneId} repeatX={1.5} repeatY={2} />
      </mesh>
    </group>
  );
}

// --- Rounded Legs: cylinder body + hemisphere dome on top (like bottom 70% of hourglass) ---
function RoundedLeg({ radiusM, heightM, stoneId }: LegProps) {
  const domeR = radiusM;
  const cylinderH = heightM - domeR; // straight cylinder portion

  const geo = useMemo(() => {
    const segments = 24;
    const points: THREE.Vector2[] = [];

    // Bottom center
    points.push(new THREE.Vector2(0, 0));
    // Bottom edge
    points.push(new THREE.Vector2(domeR, 0));
    // Straight cylinder up to where dome starts
    points.push(new THREE.Vector2(domeR, Math.max(0, cylinderH)));
    // Hemisphere dome
    for (let i = 1; i <= segments; i++) {
      const angle = (Math.PI / 2) * (i / segments);
      points.push(new THREE.Vector2(
        domeR * Math.cos(angle),
        Math.max(0, cylinderH) + domeR * Math.sin(angle)
      ));
    }

    return new THREE.LatheGeometry(points, 48);
  }, [domeR, cylinderH]);

  // Scale texture proportionally: ~1 repeat around circumference, height-proportional vertically
  const circumference = 2 * Math.PI * radiusM;
  const texRepeatX = Math.max(1, circumference / 0.4);
  const texRepeatY = Math.max(1, heightM / 0.4);

  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <MonolithMaterial stoneId={stoneId} repeatX={texRepeatX} repeatY={texRepeatY} />
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
            {/* hourglass handled at top level as single unit */}
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
      <planeGeometry args={[100, 100]} />
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

  const isHourglass = resolved.legStyle === 'hourglass';
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
      {isHourglass ? (
        <HourglassLegsUnit heightM={legHeightM} stoneId={stoneId} />
      ) : (
        <LegsGroup resolved={resolved} stoneId={stoneId} />
      )}
      <mesh
        position={topTransform.position}
        rotation={topTransform.rotation}
        geometry={topGeometry!}
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
