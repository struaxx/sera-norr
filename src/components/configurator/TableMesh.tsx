import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { TableShape, FinishType, EdgeProfile, BaseType } from '@/lib/configurator';
import { FINISHES, getStoneById } from '@/lib/configurator';
import { get3DTexture } from '@/lib/configurator/texture-resolver';

interface TableMeshProps {
  shape: TableShape;
  stone: string;
  finish: FinishType;
  edgeProfile: EdgeProfile;
  baseType: BaseType;
  dimensions: {
    length: number;
    width: number;
    height: number;
    thickness: number;
    radius?: number;
  };
}

const SCALE = 0.01;

// Get material properties based on stone characteristics
function getStoneMaterialProps(stoneId: string, finishId: FinishType) {
  const stone = getStoneById(stoneId);
  const finishConfig = FINISHES.find(f => f.id === finishId) ?? FINISHES[0];
  
  // Use the texture resolver to get the correct 3D texture (NOT the swatch!)
  const seamlessTexturePath = get3DTexture(stoneId);
  
  if (!stone) {
    return {
      color: '#9CA3AF',
      roughness: 0.5 * finishConfig.roughnessMultiplier,
      metalness: 0,
      texturePath: seamlessTexturePath,
    };
  }

  let baseRoughness = 0.5;
  if (stone.family === 'marble') {
    baseRoughness = 0.35;
  } else if (stone.family === 'travertine') {
    baseRoughness = stone.characterTags.includes('porous') ? 0.65 : 0.55;
  }

  let metalness = 0;
  if (finishId === 'polished') {
    metalness = stone.family === 'marble' ? 0.08 : 0.04;
  }

  return {
    color: stone.swatchColor,
    roughness: baseRoughness * finishConfig.roughnessMultiplier,
    metalness,
    texturePath: seamlessTexturePath, // Use seamless texture, NOT swatchImage
  };
}

// Separate component for textured table top
function TexturedTableTop({ 
  texturePath, 
  materialProps, 
  shape, 
  dimensions,
  topScale,
}: { 
  texturePath: string;
  materialProps: { color: string; roughness: number; metalness: number };
  shape: TableShape;
  dimensions: { length: number; width: number; height: number; thickness: number; radius?: number };
  topScale: [number, number, number];
}) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;

  // Load texture with proper settings
  const texture = useTexture(texturePath);
  
  // Configure texture
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Scale texture to fit table dimensions realistically
    // Assume texture represents ~60cm of real stone
    const textureScale = 0.6;
    texture.repeat.set(
      (dimensions.length / 100) / textureScale,
      (dimensions.width / 100) / textureScale
    );
  }, [texture, dimensions.length, dimensions.width]);

  const topGeometry = useMemo(() => {
    switch (shape) {
      case 'round':
        return <cylinderGeometry args={[r, r, t, 64]} />;
      case 'oval':
        return <cylinderGeometry args={[1, 1, t, 64]} />;
      case 'organic':
        return <boxGeometry args={[w, t, d]} />;
      case 'rectangular':
      default:
        return <boxGeometry args={[w, t, d]} />;
    }
  }, [shape, w, d, t, r]);

  return (
    <mesh 
      position={[0, h - t / 2, 0]} 
      scale={topScale}
      castShadow 
      receiveShadow
    >
      {topGeometry}
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

// Textured cone base - same marble texture as the top
function TexturedConeBase({ 
  texturePath, 
  materialProps, 
  dimensions,
  shape,
}: { 
  texturePath: string;
  materialProps: { color: string; roughness: number; metalness: number };
  dimensions: { length: number; width: number; height: number; thickness: number; radius?: number };
  shape: TableShape;
}) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  // Load texture with proper settings
  const texture = useTexture(texturePath);
  
  // Configure texture for cone
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(2, 2);
  }, [texture]);

  // Calculate cone dimensions - larger and more prominent
  const topRadius = shape === 'round' ? r * 0.6 : Math.min(w, d) * 0.4;
  const bottomRadius = shape === 'round' ? r * 0.38 : Math.min(w, d) * 0.25;

  return (
    <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[topRadius, bottomRadius, legHeight, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}

// Textured pedestal base - solid stone block with texture
function TexturedPedestalBase({ 
  texturePath, 
  materialProps, 
  dimensions,
  shape,
}: { 
  texturePath: string;
  materialProps: { color: string; roughness: number; metalness: number };
  dimensions: { length: number; width: number; height: number; thickness: number; radius?: number };
  shape: TableShape;
}) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  // Load texture
  const texture = useTexture(texturePath);
  
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(1.5, 2);
  }, [texture]);

  // Larger, more prominent pedestal
  const blockWidth = shape === 'round' ? r * 0.75 : w * 0.35;
  const blockDepth = shape === 'round' ? r * 0.75 : d * 0.55;

  return (
    <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[blockWidth, legHeight, blockDepth]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}

// Textured cylinder base - modern cylindrical stone
function TexturedCylinderBase({ 
  texturePath, 
  materialProps, 
  dimensions,
  shape,
}: { 
  texturePath: string;
  materialProps: { color: string; roughness: number; metalness: number };
  dimensions: { length: number; width: number; height: number; thickness: number; radius?: number };
  shape: TableShape;
}) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;
  const legHeight = h - t;

  // Load texture
  const texture = useTexture(texturePath);
  
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(2, 2);
  }, [texture]);

  // Single central cylinder
  const cylinderRadius = shape === 'round' ? r * 0.45 : Math.min(w, d) * 0.28;

  return (
    <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[cylinderRadius, cylinderRadius, legHeight, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}
// Note: ColorConeBase, ColorPedestalBase, ColorCylinderBase, and ColorTableTop 
// have been removed as we now always use seamless textures via get3DTexture()
// which provides a fallback texture when no specific texture is available.

export function TableMesh({ shape, stone, finish, edgeProfile, baseType, dimensions }: TableMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  const materialProps = useMemo(() => 
    getStoneMaterialProps(stone, finish), 
    [stone, finish]
  );

  const stoneInfo = useMemo(() => getStoneById(stone), [stone]);

  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;

  const topScale = shape === 'oval' ? [w / 2, 1, d / 2] as [number, number, number] : [1, 1, 1] as [number, number, number];

  // Base rendering - all base types use stone texture
  // texturePath is always available via get3DTexture fallback
  const renderBase = () => {
    const texturePath = materialProps.texturePath;

    switch (baseType) {
      case 'monolith':
        // Sculpted Cone - elegant tapered stone base
        return (
          <TexturedConeBase 
            texturePath={texturePath}
            materialProps={materialProps}
            dimensions={dimensions}
            shape={shape}
          />
        );

      case 'architectural':
        // Pedestal Block - solid rectangular stone base
        return (
          <TexturedPedestalBase 
            texturePath={texturePath}
            materialProps={materialProps}
            dimensions={dimensions}
            shape={shape}
          />
        );

      case 'modern':
      default:
        // Cylindrical - single stone cylinder base
        return (
          <TexturedCylinderBase 
            texturePath={texturePath}
            materialProps={materialProps}
            dimensions={dimensions}
            shape={shape}
          />
        );
    }
  };

  const hasVeining = stoneInfo?.family === 'marble' || stoneInfo?.characterTags.includes('veined');
  
  const getVeiningColor = () => {
    if (!stoneInfo) return '#666666';
    
    const isDark = stoneInfo.characterTags.includes('dramatic') || 
                   stoneInfo.swatchColor.toLowerCase().includes('1a') ||
                   stoneInfo.swatchColor.toLowerCase().includes('2d');
    
    if (isDark) return '#4A4A4A';
    
    if (stoneInfo.family === 'marble') {
      if (stoneInfo.name.toLowerCase().includes('viola')) return '#8B6B8B';
      if (stoneInfo.name.toLowerCase().includes('green') || stoneInfo.name.toLowerCase().includes('verde')) return '#2A3A2A';
      return '#888888';
    }
    
    return '#A09080';
  };

  const topGeometry = useMemo(() => {
    switch (shape) {
      case 'round':
        return <cylinderGeometry args={[r, r, t, 64]} />;
      case 'oval':
        return <cylinderGeometry args={[1, 1, t, 64]} />;
      case 'organic':
        return <boxGeometry args={[w, t, d]} />;
      case 'rectangular':
      default:
        return <boxGeometry args={[w, t, d]} />;
    }
  }, [shape, w, d, t, r]);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Table Top - always with seamless texture */}
      <TexturedTableTop 
        texturePath={materialProps.texturePath}
        materialProps={materialProps}
        shape={shape}
        dimensions={dimensions}
        topScale={topScale}
      />

      {/* Base - same stone texture as top */}
      {renderBase()}
    </group>
  );
}
