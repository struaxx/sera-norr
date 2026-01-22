import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { TableShape, StoneType, FinishType, EdgeProfile, BaseType } from '@/lib/configurator';
import { STONE_MATERIALS, FINISHES } from '@/lib/configurator';

interface TableMeshProps {
  shape: TableShape;
  stone: StoneType;
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

export function TableMesh({ shape, stone, finish, edgeProfile, baseType, dimensions }: TableMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Get material configuration
  const stoneConfig = useMemo(() => 
    STONE_MATERIALS.find(s => s.id === stone) ?? STONE_MATERIALS[0], 
    [stone]
  );
  
  const finishConfig = useMemo(() => 
    FINISHES.find(f => f.id === finish) ?? FINISHES[0], 
    [finish]
  );

  // Calculate final material properties
  const materialProps = useMemo(() => ({
    color: stoneConfig.color,
    roughness: stoneConfig.roughness * finishConfig.roughnessMultiplier,
    metalness: stoneConfig.metalness,
  }), [stoneConfig, finishConfig]);

  // Calculate scaled dimensions
  const w = dimensions.length * SCALE;
  const d = dimensions.width * SCALE;
  const h = dimensions.height * SCALE;
  const t = dimensions.thickness * SCALE;
  const r = (dimensions.radius ?? dimensions.width / 2) * SCALE;

  // Edge profile bevel
  const bevelEnabled = edgeProfile !== 'straight';
  const bevelSize = edgeProfile === 'bullnose' ? 0.02 : edgeProfile === 'rounded' ? 0.015 : 0.01;

  // Render top geometry based on shape
  const topGeometry = useMemo(() => {
    switch (shape) {
      case 'round':
        return <cylinderGeometry args={[r, r, t, 64]} />;
      case 'oval':
        // Use a scaled cylinder with ellipse shape
        return <cylinderGeometry args={[1, 1, t, 64]} />;
      case 'organic':
        // Simplified organic as rounded rectangle for now
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
        // Solid pedestal base
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
        // X-frame steel base
        return (
          <group>
            {/* Central X support */}
            <mesh position={[0, legHeight / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <boxGeometry args={[0.04, legHeight, Math.min(w, d) * 0.8]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, legHeight / 2, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow>
              <boxGeometry args={[0.04, legHeight, Math.min(w, d) * 0.8]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.8} />
            </mesh>
            {/* Base plate */}
            <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 0.5, 0.02, d * 0.5]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.8} />
            </mesh>
          </group>
        );

      case 'modern':
      default:
        // Four slim steel legs
        if (shape === 'round') {
          // Circular arrangement of legs
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

      {/* Veining overlay for marble types */}
      {(stone === 'calacattaViola' || stone === 'neroMarquina') && (
        <mesh position={[0, h - t / 2 + 0.001, 0]} scale={topScale}>
          {topGeometry}
          <meshStandardMaterial
            color={stone === 'calacattaViola' ? '#8B6B8B' : '#4A4A4A'}
            roughness={0.4}
            metalness={0.1}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
