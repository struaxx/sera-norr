import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { TableShape, FinishType, EdgeProfile, BaseType } from '@/lib/configurator';
import { FINISHES, getStoneById } from '@/lib/configurator';

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
  
  if (!stone) {
    return {
      color: '#9CA3AF',
      roughness: 0.5 * finishConfig.roughnessMultiplier,
      metalness: 0,
      texturePath: null,
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
    texturePath: stone.swatchImage || null,
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

// Fallback component without texture
function ColorTableTop({ 
  materialProps, 
  shape, 
  dimensions,
  topScale,
}: { 
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
        color={materialProps.color}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        envMapIntensity={1.2}
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

  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;

  const topScale = shape === 'oval' ? [w / 2, 1, d / 2] as [number, number, number] : [1, 1, 1] as [number, number, number];

  // Base rendering
  const renderBase = () => {
    const legHeight = h - t;
    const legWidth = 0.06;
    const legInset = 0.1;

    switch (baseType) {
      case 'monolith':
        if (shape === 'round') {
          return (
            <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[r * 0.4, r * 0.5, legHeight, 32]} />
              <meshStandardMaterial 
                color={materialProps.color} 
                roughness={materialProps.roughness}
                metalness={materialProps.metalness}
              />
            </mesh>
          );
        }
        return (
          <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.3, legHeight, d * 0.6]} />
            <meshStandardMaterial 
              color={materialProps.color} 
              roughness={materialProps.roughness}
              metalness={materialProps.metalness}
            />
          </mesh>
        );

      case 'architectural':
        return (
          <group>
            <mesh position={[0, legHeight / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <boxGeometry args={[0.04, legHeight, Math.min(w, d) * 0.8]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, legHeight / 2, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow>
              <boxGeometry args={[0.04, legHeight, Math.min(w, d) * 0.8]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.5, 0.02, d * 0.5]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.8} />
            </mesh>
          </group>
        );

      case 'modern':
      default:
        if (shape === 'round') {
          return (
            <group>
              {[0, 1, 2, 3].map((i) => {
                const angle = (i * Math.PI) / 2;
                const legRadius = r * 0.7;
                return (
                  <mesh
                    key={i}
                    position={[
                      Math.cos(angle) * legRadius,
                      legHeight / 2,
                      Math.sin(angle) * legRadius,
                    ]}
                    castShadow
                  >
                    <boxGeometry args={[legWidth, legHeight, legWidth]} />
                    <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.8} />
                  </mesh>
                );
              })}
            </group>
          );
        }

        const positions = [
          [-w / 2 + legInset, 0, -d / 2 + legInset],
          [w / 2 - legInset, 0, -d / 2 + legInset],
          [-w / 2 + legInset, 0, d / 2 - legInset],
          [w / 2 - legInset, 0, d / 2 - legInset],
        ];

        return (
          <group>
            {positions.map((pos, i) => (
              <mesh
                key={i}
                position={[pos[0], legHeight / 2, pos[2]]}
                castShadow
              >
                <boxGeometry args={[legWidth, legHeight, legWidth]} />
                <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.8} />
              </mesh>
            ))}
          </group>
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
      {/* Table Top - with texture if available */}
      {materialProps.texturePath ? (
        <TexturedTableTop 
          texturePath={materialProps.texturePath}
          materialProps={materialProps}
          shape={shape}
          dimensions={dimensions}
          topScale={topScale}
        />
      ) : (
        <ColorTableTop 
          materialProps={materialProps}
          shape={shape}
          dimensions={dimensions}
          topScale={topScale}
        />
      )}

      {/* Base */}
      {renderBase()}

      {/* Subtle veining overlay for non-textured stones with veins */}
      {hasVeining && !materialProps.texturePath && (
        <mesh position={[0, h - t / 2 + 0.001, 0]} scale={topScale}>
          {topGeometry}
          <meshStandardMaterial
            color={getVeiningColor()}
            roughness={0.4}
            metalness={0.1}
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
