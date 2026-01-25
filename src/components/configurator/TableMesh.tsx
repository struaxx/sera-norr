import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { TableShape, FinishType, EdgeProfile, BaseType } from '@/lib/configurator';
import { FINISHES, getStoneById } from '@/lib/configurator';
import { get3DTexture, getTextureScale } from '@/lib/configurator/texture-resolver';

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
  
  // Use the texture resolver to get the correct 3D seamless texture
  const seamlessTexturePath = get3DTexture(stoneId);
  
  // Get the optimal texture scale for this stone
  const textureScale = getTextureScale(stoneId);
  
  if (!stone) {
    return {
      color: '#9CA3AF',
      roughness: 0.5 * finishConfig.roughnessMultiplier,
      metalness: 0,
      texturePath: seamlessTexturePath,
      textureScale,
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
    texturePath: seamlessTexturePath,
    textureScale,
  };
}

// Create cut-corner (chamfered) geometry
function createCutCornerShape(width: number, depth: number, chamferSize: number = 0.15): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = width / 2;
  const hd = depth / 2;
  const chamfer = Math.min(hw, hd) * chamferSize;
  
  // Start from top-right, going counter-clockwise
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

// Create ellipse shape
function createEllipseShape(width: number, depth: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = width / 2;
  const hd = depth / 2;
  
  // Create ellipse with bezier curves
  shape.absellipse(0, 0, hw, hd, 0, Math.PI * 2, false, 0);
  
  return shape;
}

// Separate component for textured table top with proper geometry
function TexturedTableTop({ 
  texturePath, 
  materialProps, 
  shape, 
  dimensions,
  textureScale,
}: { 
  texturePath: string;
  materialProps: { color: string; roughness: number; metalness: number };
  shape: TableShape;
  dimensions: { length: number; width: number; height: number; thickness: number; radius?: number };
  textureScale: number;
}) {
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;

  // Load texture with proper settings
  const texture = useTexture(texturePath);
  
  // Configure texture for seamless tiling
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Use stone-specific texture scale from resolver
    // This ensures each stone's pattern is shown at the correct size
    texture.repeat.set(
      (dimensions.length / 100) / textureScale,
      (dimensions.width / 100) / textureScale
    );
  }, [texture, dimensions.length, dimensions.width, textureScale]);

  const geometry = useMemo(() => {
    const extrudeSettings = {
      depth: t,
      bevelEnabled: false,
    };

    switch (shape) {
      case 'round':
        // Perfect circle
        return new THREE.CylinderGeometry(r, r, t, 64);
      
      case 'ellips':
        // Soft ellipse - use ExtrudeGeometry for proper UV mapping
        const ellipseShape = createEllipseShape(w, d);
        return new THREE.ExtrudeGeometry(ellipseShape, extrudeSettings);
      
      case 'ovale':
        // Classic oval - slightly different eccentricity
        // Using cylinder with oval scaling for smooth appearance
        return new THREE.CylinderGeometry(1, 1, t, 64);
      
      case 'cut-corner':
        // Rectangle with chamfered corners
        const cutCornerShape = createCutCornerShape(w, d, 0.12);
        return new THREE.ExtrudeGeometry(cutCornerShape, extrudeSettings);
      
      case 'corner':
      default:
        // Sharp rectangle
        return new THREE.BoxGeometry(w, t, d);
    }
  }, [shape, w, d, t, r]);

  // Calculate position and scale based on shape
  const getPositionAndScale = (): { position: [number, number, number]; scale: [number, number, number]; rotation: [number, number, number] } => {
    switch (shape) {
      case 'round':
        return { position: [0, h - t / 2, 0], scale: [1, 1, 1], rotation: [0, 0, 0] };
      case 'ovale':
        // Scale cylinder to create oval
        return { position: [0, h - t / 2, 0], scale: [w / 2, 1, d / 2], rotation: [0, 0, 0] };
      case 'ellips':
      case 'cut-corner':
        // Extruded shapes need rotation to be horizontal
        return { position: [0, h - t, 0], scale: [1, 1, 1], rotation: [-Math.PI / 2, 0, 0] };
      case 'corner':
      default:
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

export function TableMesh({ shape, stone, finish, edgeProfile, baseType, dimensions }: TableMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  const materialProps = useMemo(() => 
    getStoneMaterialProps(stone, finish), 
    [stone, finish]
  );

  const stoneInfo = useMemo(() => getStoneById(stone), [stone]);

  // Base rendering - all base types use stone texture
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

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Table Top - always with seamless texture */}
      <TexturedTableTop 
        texturePath={materialProps.texturePath}
        materialProps={materialProps}
        shape={shape}
        dimensions={dimensions}
        textureScale={materialProps.textureScale}
      />

      {/* Base - same stone texture as top */}
      {renderBase()}
    </group>
  );
}