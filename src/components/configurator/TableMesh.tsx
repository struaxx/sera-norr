import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { TableShape, FinishType, EdgeProfile, BaseType } from '@/lib/configurator';
import { FINISHES, getStoneById, STONE_LIBRARY } from '@/lib/configurator';

interface TableMeshProps {
  shape: TableShape;
  stone: string; // Now accepts any stone ID from STONE_LIBRARY
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

// Scale factor: dimensions in cm, scene in meters
const SCALE = 0.01;

// Convert hex color to THREE.js color with slight variation for realism
function hexToMaterialColor(hex: string): string {
  return hex;
}

// Get material properties based on stone characteristics
function getStoneMaterialProps(stoneId: string, finishId: FinishType) {
  const stone = getStoneById(stoneId);
  const finishConfig = FINISHES.find(f => f.id === finishId) ?? FINISHES[0];
  
  if (!stone) {
    // Fallback for custom or unknown stones
    return {
      color: '#9CA3AF',
      roughness: 0.5 * finishConfig.roughnessMultiplier,
      metalness: 0,
    };
  }

  // Base roughness varies by stone family and tags
  let baseRoughness = 0.5;
  if (stone.family === 'marble') {
    baseRoughness = 0.35; // Marble is naturally smoother
  } else if (stone.family === 'travertine') {
    baseRoughness = stone.characterTags.includes('porous') ? 0.65 : 0.55;
  }

  // Slight metalness for polished stones
  let metalness = 0;
  if (finishId === 'polished') {
    metalness = stone.family === 'marble' ? 0.08 : 0.04;
  }

  return {
    color: stone.swatchColor,
    roughness: baseRoughness * finishConfig.roughnessMultiplier,
    metalness,
  };
}

export function TableMesh({ shape, stone, finish, edgeProfile, baseType, dimensions }: TableMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Get material properties from the stone library
  const materialProps = useMemo(() => 
    getStoneMaterialProps(stone, finish), 
    [stone, finish]
  );

  // Get stone info for veining effects
  const stoneInfo = useMemo(() => getStoneById(stone), [stone]);

  // Calculate scaled dimensions
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;

  // Render top geometry based on shape
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

  // Calculate top scale for oval
  const topScale = shape === 'oval' ? [w / 2, 1, d / 2] as [number, number, number] : [1, 1, 1] as [number, number, number];

  // Base rendering
  const renderBase = () => {
    const legHeight = h - t;
    const legWidth = 0.06;
    const legInset = 0.1;

    switch (baseType) {
      case 'monolith':
        // Solid pedestal base in stone
        if (shape === 'round') {
          return (
            <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[r * 0.4, r * 0.5, legHeight, 32]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          );
        }
        return (
          <mesh position={[0, legHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.3, legHeight, d * 0.6]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );

      case 'architectural':
        // Pedestal block base
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
        // Cylindrical steel legs
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

        // Standard 4-leg arrangement
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

  // Determine if stone has veining (marble or veined tag)
  const hasVeining = stoneInfo?.family === 'marble' || stoneInfo?.characterTags.includes('veined');
  
  // Calculate veining color based on stone
  const getVeiningColor = () => {
    if (!stoneInfo) return '#666666';
    
    // For dark stones, use lighter veining
    const isDark = stoneInfo.characterTags.includes('dramatic') || 
                   stoneInfo.swatchColor.toLowerCase().includes('1a') ||
                   stoneInfo.swatchColor.toLowerCase().includes('2d');
    
    if (isDark) return '#4A4A4A';
    
    // For marble, use subtle grey/purple veining
    if (stoneInfo.family === 'marble') {
      if (stoneInfo.name.toLowerCase().includes('viola')) return '#8B6B8B';
      if (stoneInfo.name.toLowerCase().includes('green') || stoneInfo.name.toLowerCase().includes('verde')) return '#2A3A2A';
      return '#888888';
    }
    
    // For travertine with veins
    return '#A09080';
  };

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Table Top */}
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

      {/* Base */}
      {renderBase()}

      {/* Veining overlay for stones with veins */}
      {hasVeining && (
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
