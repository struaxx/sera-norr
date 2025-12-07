import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ProductViewer3DProps {
  material: string;
  finish: string;
  width: number;
  depth: number;
  height: number;
}

// Material color and roughness mappings
const materialConfigs: Record<string, { color: string; roughness: number; metalness: number }> = {
  travertine: { color: '#E8DFD0', roughness: 0.6, metalness: 0 },
  calacattaViola: { color: '#F5F0F5', roughness: 0.3, metalness: 0.05 },
  verdeAlpi: { color: '#2D4A3E', roughness: 0.4, metalness: 0.02 },
  neroMarquina: { color: '#1A1A1A', roughness: 0.35, metalness: 0.05 },
  concrete: { color: '#8C8C8C', roughness: 0.9, metalness: 0 },
};

const finishModifiers: Record<string, { roughnessMultiplier: number }> = {
  polished: { roughnessMultiplier: 0.3 },
  honed: { roughnessMultiplier: 0.6 },
  matte: { roughnessMultiplier: 1.0 },
  natural: { roughnessMultiplier: 0.8 },
};

function Table({ material, finish, width, depth, height }: ProductViewer3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const config = materialConfigs[material] || materialConfigs.travertine;
  const finishMod = finishModifiers[finish] || finishModifiers.honed;
  
  // Scale dimensions (input in cm, scale down for 3D scene)
  const scale = 0.01;
  const w = width * scale;
  const d = depth * scale;
  const h = height * scale;
  const topThickness = 0.08;
  const legWidth = 0.12;
  const legInset = 0.15;

  return (
    <group position={[0, -0.5, 0]}>
      {/* Table Top */}
      <mesh position={[0, h - topThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topThickness, d]} />
        <meshStandardMaterial
          color={config.color}
          roughness={config.roughness * finishMod.roughnessMultiplier}
          metalness={config.metalness}
        />
      </mesh>
      
      {/* Legs */}
      {[
        [-w / 2 + legInset, 0, -d / 2 + legInset],
        [w / 2 - legInset, 0, -d / 2 + legInset],
        [-w / 2 + legInset, 0, d / 2 - legInset],
        [w / 2 - legInset, 0, d / 2 - legInset],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={[pos[0], (h - topThickness) / 2, pos[2]]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[legWidth, h - topThickness, legWidth]} />
          <meshStandardMaterial
            color={config.color}
            roughness={config.roughness * finishMod.roughnessMultiplier}
            metalness={config.metalness}
          />
        </mesh>
      ))}
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.1, 0.6]} />
      <meshStandardMaterial color="#E8DFD0" opacity={0.5} transparent />
    </mesh>
  );
}

export function ProductViewer3D(props: ProductViewer3DProps) {
  return (
    <div className="w-full aspect-square bg-secondary/20 rounded-sm overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[2.5, 2, 2.5]} fov={35} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        
        <Suspense fallback={<LoadingFallback />}>
          <Table {...props} />
          <ContactShadows
            position={[0, -0.49, 0]}
            opacity={0.4}
            scale={4}
            blur={2}
            far={4}
          />
          <Environment preset="apartment" />
        </Suspense>
        
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
