// ============================================
// Sera Norr — Shared R3F Stage
// One canvas per route section. Reused across
// Hero Stage, Material Stage, Detail Stage.
// See docs/EXPERIENCE_OS.md §4.
// ============================================

import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { getCachedGPUInfo } from '@/lib/configurator/gpu-detection';

interface StageProps {
  children: ReactNode;
  /** Aria description read by screen readers in place of the canvas. */
  ariaDescription: string;
  className?: string;
  /** Poster shown when GPU is too low-tier for R3F. */
  posterSrc?: string;
  posterAlt?: string;
  /** Camera position. Default = hero framing. */
  cameraPosition?: [number, number, number];
  /** Fov in degrees. Default 35. */
  fov?: number;
  /** Autorotate the whole scene via <OrbitControls>. Off by default. */
  autoRotate?: boolean;
  /** frameloop policy; `demand` for static hero, `always` for scrub. */
  frameloop?: 'always' | 'demand' | 'never';
  /** Show soft contact shadow under scene. */
  contactShadow?: boolean;
}

export function Stage({
  children,
  ariaDescription,
  className,
  posterSrc,
  posterAlt,
  cameraPosition = [2.5, 1.8, 2.8],
  fov = 35,
  frameloop = 'demand',
  contactShadow = true,
}: StageProps) {
  const gpu = getCachedGPUInfo();
  const useFallback = gpu?.tier === 'low' && !!posterSrc;

  if (useFallback) {
    return (
      <div className={className}>
        <img
          src={posterSrc}
          alt={posterAlt ?? ariaDescription}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="sr-only">{ariaDescription}</span>
      <Canvas
        shadows
        dpr={[1, 2]}
        frameloop={frameloop}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        aria-hidden="true"
      >
        <PerspectiveCamera makeDefault position={cameraPosition} fov={fov} />

        {/* Warm three-point lighting. */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={0.9}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 4, -3]} intensity={0.25} />

        <Suspense fallback={null}>
          {children}
          {contactShadow && (
            <ContactShadows
              position={[0, -0.5, 0]}
              opacity={0.35}
              scale={5}
              blur={2.4}
              far={4}
            />
          )}
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
    </div>
  );
}