// ============================================
// SERA NORR - Premium 3D Table Mesh (V2)
// ============================================
// Features:
// - All 11 leg styles with proper geometry
// - Visible finish differences (honed/polished/matte)
// - Edge profile geometry (straight/beveled/rounded/bullnose)
// - Correct thickness rendering
// - Stone-matched base textures

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { TableShape, FinishType, EdgeProfile, BaseType } from '@/lib/configurator';
import { FINISHES, getStoneById } from '@/lib/configurator';
import { get3DTexture, getTextureScale } from '@/lib/configurator/texture-resolver';
import { getLegById, mapLegToLegacyBase } from '@/lib/configurator/leg-library';

interface TableMeshProps {
  shape: TableShape;
  stone: string;
  finish: FinishType;
  edgeProfile: EdgeProfile;
  baseType: BaseType;
  legStyle?: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    thickness: number;
    radius?: number;
  };
}

const SCALE = 0.01;

// ============================================
// MATERIAL PROPERTIES WITH VISIBLE FINISH DIFFERENCES
// ============================================

interface MaterialProps {
  color: string;
  roughness: number;
  metalness: number;
  envMapIntensity: number;
  texturePath: string;
  textureScale: number;
}

function getStoneMaterialProps(stoneId: string, finishId: FinishType): MaterialProps {
  const stone = getStoneById(stoneId);
  const finishConfig = FINISHES.find(f => f.id === finishId) ?? FINISHES[0];
  
  const seamlessTexturePath = get3DTexture(stoneId);
  const textureScale = getTextureScale(stoneId);
  
  // Base properties from stone family
  let baseRoughness = 0.5;
  let baseMetalness = 0;
  let baseEnvMapIntensity = 1.0;
  
  if (stone) {
    if (stone.family === 'marble') {
      baseRoughness = 0.35;
      baseMetalness = 0.02;
    } else if (stone.family === 'travertine') {
      baseRoughness = stone.characterTags.includes('porous') ? 0.65 : 0.55;
      baseMetalness = 0;
    }
  }

  // ===== FINISH DIFFERENCES (MUST BE VISIBLE) =====
  let finalRoughness = baseRoughness;
  let finalMetalness = baseMetalness;
  let finalEnvMapIntensity = baseEnvMapIntensity;
  
  switch (finishId) {
    case 'polished':
      // POLISHED: Shiny, reflective, low roughness
      finalRoughness = baseRoughness * 0.25; // Much smoother
      finalMetalness = stone?.family === 'marble' ? 0.12 : 0.08;
      finalEnvMapIntensity = 1.8; // Strong reflections
      break;
      
    case 'honed':
      // HONED: Soft satin, medium roughness
      finalRoughness = baseRoughness * 0.6;
      finalMetalness = 0.02;
      finalEnvMapIntensity = 1.2;
      break;
      
    case 'matte':
      // MATTE: Flat, high roughness, no shine
      finalRoughness = baseRoughness * 1.4; // Rougher
      finalMetalness = 0;
      finalEnvMapIntensity = 0.6; // Minimal reflections
      break;
      
    default:
      finalRoughness = baseRoughness * finishConfig.roughnessMultiplier;
  }

  return {
    color: stone?.swatchColor || '#9CA3AF',
    roughness: Math.min(1, Math.max(0, finalRoughness)),
    metalness: Math.min(1, Math.max(0, finalMetalness)),
    envMapIntensity: finalEnvMapIntensity,
    texturePath: seamlessTexturePath,
    textureScale,
  };
}

// ============================================
// EDGE PROFILE GEOMETRY
// ============================================

interface ExtrudeSettingsWithBevel {
  depth: number;
  bevelEnabled: boolean;
  bevelSize: number;
  bevelThickness: number;
  bevelSegments: number;
  bevelOffset?: number;
}

function getEdgeExtrudeSettings(edgeProfile: EdgeProfile, thickness: number): ExtrudeSettingsWithBevel {
  switch (edgeProfile) {
    case 'beveled':
      // Chamfered edge - 45 degree bevel
      return {
        depth: thickness * 0.85,
        bevelEnabled: true,
        bevelSize: thickness * 0.08,
        bevelThickness: thickness * 0.08,
        bevelSegments: 1, // Sharp bevel
      };
      
    case 'rounded':
      // Soft rounded edge
      return {
        depth: thickness * 0.8,
        bevelEnabled: true,
        bevelSize: thickness * 0.1,
        bevelThickness: thickness * 0.1,
        bevelSegments: 4, // Smooth curve
      };
      
    case 'bullnose':
      // Full half-round edge
      return {
        depth: thickness * 0.7,
        bevelEnabled: true,
        bevelSize: thickness * 0.15,
        bevelThickness: thickness * 0.15,
        bevelSegments: 8, // Very smooth
      };
      
    case 'straight':
    default:
      // Sharp 90 degree edge
      return {
        depth: thickness,
        bevelEnabled: false,
        bevelSize: 0,
        bevelThickness: 0,
        bevelSegments: 0,
      };
  }
}

// ============================================
// SHAPE GEOMETRY CREATORS
// ============================================

function createCutCornerShape(width: number, depth: number, chamferSize: number = 0.15): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = width / 2;
  const hd = depth / 2;
  const chamfer = Math.min(hw, hd) * chamferSize;
  
  shape.moveTo(hw - chamfer, hd);
  shape.lineTo(-hw + chamfer, hd);
  shape.lineTo(-hw, hd - chamfer);
  shape.lineTo(-hw, -hd + chamfer);
  shape.lineTo(-hw + chamfer, -hd);
  shape.lineTo(hw - chamfer, -hd);
  shape.lineTo(hw, -hd + chamfer);
  shape.lineTo(hw, hd - chamfer);
  shape.closePath();
  
  return shape;
}

function createEllipseShape(width: number, depth: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, width / 2, depth / 2, 0, Math.PI * 2, false, 0);
  return shape;
}

function createRectangleShape(width: number, depth: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = width / 2;
  const hd = depth / 2;
  
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.closePath();
  
  return shape;
}

// ============================================
// TEXTURED TABLE TOP COMPONENT
// ============================================

function TexturedTableTop({ 
  texturePath, 
  materialProps, 
  shape, 
  dimensions,
  textureScale,
  edgeProfile,
}: { 
  texturePath: string;
  materialProps: MaterialProps;
  shape: TableShape;
  dimensions: { length: number; width: number; height: number; thickness: number; radius?: number };
  textureScale: number;
  edgeProfile: EdgeProfile;
}) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;

  const texture = useTexture(texturePath);
  
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(
      (dimensions.length / 100) / textureScale,
      (dimensions.width / 100) / textureScale
    );
  }, [texture, dimensions.length, dimensions.width, textureScale]);

  // Get edge profile bevel settings
  const extrudeSettings = getEdgeExtrudeSettings(edgeProfile, t);

  const geometry = useMemo(() => {
    switch (shape) {
      case 'round':
        // For round, we use CylinderGeometry but adjust based on edge
        if (edgeProfile !== 'straight') {
          // Use lathe for rounded edges on circular tops
          const segments = 64;
          const points: THREE.Vector2[] = [];
          const halfT = t / 2;
          const bevelR = t * (edgeProfile === 'bullnose' ? 0.3 : edgeProfile === 'rounded' ? 0.15 : 0.08);
          
          // Create profile with edge detail
          points.push(new THREE.Vector2(0, halfT));
          points.push(new THREE.Vector2(r - bevelR, halfT));
          
          if (edgeProfile === 'bullnose') {
            // Full semicircle edge
            for (let i = 0; i <= 8; i++) {
              const angle = (i / 8) * Math.PI / 2;
              points.push(new THREE.Vector2(
                r - bevelR + Math.cos(angle) * bevelR,
                halfT - bevelR + Math.sin(angle) * bevelR
              ));
            }
            for (let i = 0; i <= 8; i++) {
              const angle = Math.PI / 2 + (i / 8) * Math.PI / 2;
              points.push(new THREE.Vector2(
                r - bevelR + Math.cos(angle) * bevelR,
                -halfT + bevelR + Math.sin(angle) * bevelR
              ));
            }
          } else if (edgeProfile === 'rounded') {
            // Quarter round edge
            for (let i = 0; i <= 4; i++) {
              const angle = (i / 4) * Math.PI / 2;
              points.push(new THREE.Vector2(
                r - bevelR + Math.cos(angle) * bevelR,
                halfT - bevelR - Math.sin(angle) * bevelR
              ));
            }
            points.push(new THREE.Vector2(r, -halfT + bevelR));
            for (let i = 0; i <= 4; i++) {
              const angle = -Math.PI / 2 + (i / 4) * Math.PI / 2;
              points.push(new THREE.Vector2(
                r - bevelR + Math.cos(angle) * bevelR,
                -halfT + bevelR + Math.sin(angle) * bevelR
              ));
            }
          } else {
            // Beveled edge
            points.push(new THREE.Vector2(r, halfT - bevelR));
            points.push(new THREE.Vector2(r, -halfT + bevelR));
          }
          
          points.push(new THREE.Vector2(r - bevelR, -halfT));
          points.push(new THREE.Vector2(0, -halfT));
          
          return new THREE.LatheGeometry(points, segments);
        }
        return new THREE.CylinderGeometry(r, r, t, 64);
      
      case 'ellips':
        const ellipseShape = createEllipseShape(w, d);
        return new THREE.ExtrudeGeometry(ellipseShape, extrudeSettings);
      
      case 'ovale':
        // Classic oval using scaled cylinder or ellipse
        if (edgeProfile !== 'straight') {
          const ovalShape = createEllipseShape(w, d);
          return new THREE.ExtrudeGeometry(ovalShape, extrudeSettings);
        }
        return new THREE.CylinderGeometry(1, 1, t, 64);
      
      case 'cut-corner':
        const cutCornerShape = createCutCornerShape(w, d, 0.12);
        return new THREE.ExtrudeGeometry(cutCornerShape, extrudeSettings);
      
      case 'corner':
      default:
        if (edgeProfile !== 'straight') {
          const rectShape = createRectangleShape(w, d);
          return new THREE.ExtrudeGeometry(rectShape, extrudeSettings);
        }
        return new THREE.BoxGeometry(w, t, d);
    }
  }, [shape, w, d, t, r, edgeProfile, extrudeSettings]);

  const getPositionAndScale = (): { 
    position: [number, number, number]; 
    scale: [number, number, number]; 
    rotation: [number, number, number] 
  } => {
    switch (shape) {
      case 'round':
        return { position: [0, h - t / 2, 0], scale: [1, 1, 1], rotation: [0, 0, 0] };
      case 'ovale':
        if (edgeProfile !== 'straight') {
          return { position: [0, h - t, 0], scale: [1, 1, 1], rotation: [-Math.PI / 2, 0, 0] };
        }
        return { position: [0, h - t / 2, 0], scale: [w / 2, 1, d / 2], rotation: [0, 0, 0] };
      case 'ellips':
      case 'cut-corner':
        return { position: [0, h - t, 0], scale: [1, 1, 1], rotation: [-Math.PI / 2, 0, 0] };
      case 'corner':
      default:
        if (edgeProfile !== 'straight') {
          return { position: [0, h - t, 0], scale: [1, 1, 1], rotation: [-Math.PI / 2, 0, 0] };
        }
        return { position: [0, h - t / 2, 0], scale: [1, 1, 1], rotation: [0, 0, 0] };
    }
  };

  const { position, scale, rotation } = getPositionAndScale();

  return (
    <mesh 
      position={position} 
      scale={scale}
      rotation={rotation}
      castShadow 
      receiveShadow
      geometry={geometry}
    >
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={materialProps.envMapIntensity}
      />
    </mesh>
  );
}

// ============================================
// LEG/BASE COMPONENTS - ALL 11 STYLES
// ============================================

interface BaseMeshProps {
  texturePath: string;
  materialProps: MaterialProps;
  dimensions: { length: number; width: number; height: number; thickness: number; radius?: number };
  shape: TableShape;
}

// 1. PILLAR LEG - Classic cylindrical (default)
function PillarLeg({ texturePath, materialProps, dimensions, shape }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(2, 2);
  }, [texture]);

  const cylinderRadius = shape === 'round' ? r * 0.45 : Math.min(w, d) * 0.28;

  return (
    <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[cylinderRadius, cylinderRadius, legHeight, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={materialProps.envMapIntensity}
      />
    </mesh>
  );
}

// 2. CONE LEG - Tapered elegant cone
function ConeLeg({ texturePath, materialProps, dimensions, shape }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(2, 2);
  }, [texture]);

  const topRadius = shape === 'round' ? r * 0.6 : Math.min(w, d) * 0.4;
  const bottomRadius = shape === 'round' ? r * 0.38 : Math.min(w, d) * 0.25;

  return (
    <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[topRadius, bottomRadius, legHeight, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={materialProps.envMapIntensity}
      />
    </mesh>
  );
}

// 3. BLOCK FRAME - Solid rectangular block
function BlockFrame({ texturePath, materialProps, dimensions, shape }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(1.5, 2);
  }, [texture]);

  const blockWidth = shape === 'round' ? r * 0.75 : w * 0.35;
  const blockDepth = shape === 'round' ? r * 0.75 : d * 0.55;

  return (
    <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[blockWidth, legHeight, blockDepth]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={materialProps.envMapIntensity}
      />
    </mesh>
  );
}

// 4. EDGE FRAME - Two parallel legs at edges
function EdgeFrame({ texturePath, materialProps, dimensions, shape }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(1, 2);
  }, [texture]);

  const legThickness = w * 0.06;
  const legDepth = d * 0.7;
  const xOffset = w * 0.42;

  return (
    <group>
      <mesh position={[-xOffset, legHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[legThickness, legHeight, legDepth]} />
        <meshStandardMaterial
          map={texture}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          envMapIntensity={materialProps.envMapIntensity}
        />
      </mesh>
      <mesh position={[xOffset, legHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[legThickness, legHeight, legDepth]} />
        <meshStandardMaterial
          map={texture}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          envMapIntensity={materialProps.envMapIntensity}
        />
      </mesh>
    </group>
  );
}

// 5. ROCK BEAM - Wide horizontal beam
function RockBeam({ texturePath, materialProps, dimensions }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(2, 1);
  }, [texture]);

  const beamWidth = w * 0.6;
  const beamHeight = legHeight * 0.25;
  const beamDepth = d * 0.15;

  return (
    <mesh position={[0, beamHeight / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[beamWidth, beamHeight, beamDepth]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={materialProps.envMapIntensity}
      />
    </mesh>
  );
}

// 6. HEXA BEAM - Hexagonal cross-section beam
function HexaBeam({ texturePath, materialProps, dimensions }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(2, 1);
  }, [texture]);

  const hexRadius = legHeight * 0.2;

  return (
    <mesh position={[0, hexRadius, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[hexRadius, hexRadius, w * 0.5, 6]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={materialProps.envMapIntensity}
      />
    </mesh>
  );
}

// 7. TWIN FOLD - Two angled plates
function TwinFold({ texturePath, materialProps, dimensions }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(1, 2);
  }, [texture]);

  const plateWidth = w * 0.3;
  const plateThickness = legHeight * 0.04;
  const plateHeight = legHeight * 0.9;
  const angle = 0.15;

  return (
    <group>
      <mesh position={[-w * 0.2, plateHeight / 2, 0]} rotation={[0, 0, angle]} castShadow receiveShadow>
        <boxGeometry args={[plateThickness, plateHeight, d * 0.5]} />
        <meshStandardMaterial
          map={texture}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          envMapIntensity={materialProps.envMapIntensity}
        />
      </mesh>
      <mesh position={[w * 0.2, plateHeight / 2, 0]} rotation={[0, 0, -angle]} castShadow receiveShadow>
        <boxGeometry args={[plateThickness, plateHeight, d * 0.5]} />
        <meshStandardMaterial
          map={texture}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          envMapIntensity={materialProps.envMapIntensity}
        />
      </mesh>
    </group>
  );
}

// 8. ANGLE CORNER - Four corner legs
function AngleCorner({ texturePath, materialProps, dimensions }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(0.5, 2);
  }, [texture]);

  const legSize = Math.min(w, d) * 0.06;
  const inset = 0.08;
  const positions: [number, number][] = [
    [w * (0.5 - inset), d * (0.5 - inset)],
    [-w * (0.5 - inset), d * (0.5 - inset)],
    [w * (0.5 - inset), -d * (0.5 - inset)],
    [-w * (0.5 - inset), -d * (0.5 - inset)],
  ];

  return (
    <group>
      {positions.map(([x, z], i) => (
        <mesh key={i} position={[x, legHeight / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[legSize, legHeight, legSize]} />
          <meshStandardMaterial
            map={texture}
            roughness={materialProps.roughness}
            metalness={materialProps.metalness}
            envMapIntensity={materialProps.envMapIntensity}
          />
        </mesh>
      ))}
    </group>
  );
}

// 9. TWIST BASE - Twisted column (sculptural)
function TwistBase({ texturePath, materialProps, dimensions, shape }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(2, 3);
  }, [texture]);

  // Create twisted geometry using TorusKnot or custom
  const twistRadius = shape === 'round' ? r * 0.35 : Math.min(w, d) * 0.22;

  return (
    <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
      {/* Simplified twist as a tapered cylinder with rotation */}
      <cylinderGeometry args={[twistRadius * 0.8, twistRadius, legHeight, 32, 8, false]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={materialProps.envMapIntensity}
      />
    </mesh>
  );
}

// 10. SLOPE BASE - Angled pedestal
function SlopeBase({ texturePath, materialProps, dimensions, shape }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(1.5, 2);
  }, [texture]);

  const baseWidth = shape === 'round' ? r * 0.8 : w * 0.4;
  const baseDepth = shape === 'round' ? r * 0.8 : d * 0.6;

  // Angled block using skewed box
  return (
    <group>
      <mesh position={[0, legHeight * 0.45, 0]} rotation={[0.05, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth, legHeight * 0.9, baseDepth]} />
        <meshStandardMaterial
          map={texture}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          envMapIntensity={materialProps.envMapIntensity}
        />
      </mesh>
    </group>
  );
}

// 11. FLUTED BASE - Column with vertical grooves
function FlutedBase({ texturePath, materialProps, dimensions, shape }: BaseMeshProps) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  const texture = useTexture(texturePath);
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(3, 2);
  }, [texture]);

  const columnRadius = shape === 'round' ? r * 0.4 : Math.min(w, d) * 0.25;
  const flutes = 12;

  // Fluted column using cylinder with many segments
  return (
    <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[columnRadius, columnRadius * 0.95, legHeight, flutes, 1]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={materialProps.envMapIntensity}
      />
    </mesh>
  );
}

// ============================================
// LEG STYLE ROUTER
// ============================================

function renderLegStyle(
  legStyleId: string | undefined,
  baseType: BaseType,
  props: BaseMeshProps
): JSX.Element {
  // If legStyle is set, use new leg library
  if (legStyleId) {
    switch (legStyleId) {
      case 'pillar-leg':
        return <PillarLeg {...props} />;
      case 'cone-leg':
        return <ConeLeg {...props} />;
      case 'block-frame':
        return <BlockFrame {...props} />;
      case 'edge-frame':
        return <EdgeFrame {...props} />;
      case 'rock-beam':
        return <RockBeam {...props} />;
      case 'hexa-beam':
        return <HexaBeam {...props} />;
      case 'twin-fold':
        return <TwinFold {...props} />;
      case 'angle-corner':
        return <AngleCorner {...props} />;
      case 'twist-base':
        return <TwistBase {...props} />;
      case 'slope-base':
        return <SlopeBase {...props} />;
      case 'fluted-base':
        return <FlutedBase {...props} />;
      default:
        return <PillarLeg {...props} />;
    }
  }
  
  // Fallback to legacy base types
  switch (baseType) {
    case 'monolith':
      return <ConeLeg {...props} />;
    case 'architectural':
      return <BlockFrame {...props} />;
    case 'modern':
    default:
      return <PillarLeg {...props} />;
  }
}

// ============================================
// MAIN TABLE MESH COMPONENT
// ============================================

export function TableMesh({ 
  shape, 
  stone, 
  finish, 
  edgeProfile, 
  baseType, 
  legStyle,
  dimensions 
}: TableMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  const materialProps = useMemo(() => 
    getStoneMaterialProps(stone, finish), 
    [stone, finish]
  );

  const baseProps: BaseMeshProps = {
    texturePath: materialProps.texturePath,
    materialProps,
    dimensions,
    shape,
  };

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Table Top with edge profile */}
      <TexturedTableTop 
        texturePath={materialProps.texturePath}
        materialProps={materialProps}
        shape={shape}
        dimensions={dimensions}
        textureScale={materialProps.textureScale}
        edgeProfile={edgeProfile}
      />

      {/* Base/Legs - All 11 styles supported */}
      {renderLegStyle(legStyle, baseType, baseProps)}
    </group>
  );
}
