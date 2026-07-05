// ============================================
// Act I — Arrival
// A single slab of Calacatta Viola, slowly rotating,
// on a warm-neutral stage. Cursor parallax camera.
// Purpose: establish material-first tone within 2s.
// ============================================

import { Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei';
import { TextureLoader, RepeatWrapping, MathUtils } from 'three';
import type * as THREE from 'three';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMotionPreference, riseStagger } from '@/lib/motion/primitives';

// Cursor position in [-1, 1]. Purpose: give the camera a subtle,
// living sway that responds to the visitor. Never more than ±3°.
function useCursorPosition() {
  const pos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pos.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return pos;
}

function Slab({
  cursor,
  reduceMotion,
}: {
  cursor: React.MutableRefObject<{ x: number; y: number }>;
  reduceMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, '/stones/marble/calacatta-viola.jpg');
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.anisotropy = 8;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Slow autorotation — 0.5°/s. Purpose: reveal the slab from every angle,
    // like a curator turning a piece under gallery light.
    if (!reduceMotion) {
      meshRef.current.rotation.y += delta * 0.09;
    }
    // Cursor-parallax on the whole rig via camera lookAt offset.
    // Damped lerp so it never feels twitchy.
    const cam = state.camera;
    const targetX = cursor.current.x * 0.25;
    const targetY = -cursor.current.y * 0.12;
    cam.position.x = MathUtils.lerp(cam.position.x, 2.6 + targetX, 0.04);
    cam.position.y = MathUtils.lerp(cam.position.y, 1.9 + targetY, 0.04);
    cam.lookAt(0, 0.05, 0);
  });

  return (
    <group>
      {/* The slab. A thin rectangular block — the atelier delivers slabs,
          not solid cubes; the geometry should read as stone-cut, not sculpture. */}
      <mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.06, 1.0]} />
        <meshStandardMaterial map={texture} roughness={0.35} metalness={0.04} />
      </mesh>

      {/* Two low pillar legs — echo the pedestal stone base. */}
      {[[-0.55, 0], [0.55, 0]].map(([x], i) => (
        <mesh key={i} position={[x, -0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.65, 24]} />
          <meshStandardMaterial map={texture} roughness={0.4} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

export function ActArrival({ isNL }: { isNL: boolean }) {
  const cursor = useCursorPosition();
  const { rise, reduce } = useMotionPreference();
  const [mounted, setMounted] = useState(false);

  // Lazy-mount the 3D scene after first paint so the LCP is the poster
  // gradient background, not the WebGL surface.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-sera-bg film-grain"
      aria-labelledby="arrival-heading"
    >
      {/* Warm radial vignette — the "gallery light" the slab sits under. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 65% 45%, hsl(38 24% 92%) 0%, hsl(38 22% 88%) 45%, hsl(35 18% 82%) 100%)',
        }}
      />

      {/* 3D canvas — right half on desktop, background on mobile. */}
      <div className="absolute inset-0 lg:left-[42%]">
        <span className="sr-only">
          {isNL
            ? 'Een langzaam draaiende plaat Calacatta Viola marmer, op twee natuurstenen pilaren.'
            : 'A slowly rotating slab of Calacatta Viola marble, resting on two stone pillars.'}
        </span>
        {mounted && (
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            aria-hidden="true"
          >
            <PerspectiveCamera makeDefault position={[2.6, 1.9, 2.8]} fov={32} />
            <ambientLight intensity={0.55} />
            <directionalLight
              position={[5, 8, 4]}
              intensity={0.9}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-4, 3, -2]} intensity={0.22} />
            <Suspense fallback={null}>
              <Slab cursor={cursor} reduceMotion={reduce} />
              <ContactShadows
                position={[0, -0.72, 0]}
                opacity={0.42}
                scale={5}
                blur={2.6}
                far={4}
              />
              <Environment preset="apartment" />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Copy column — left half on desktop, bottom on mobile. */}
      <div className="relative z-10 w-full container mx-auto px-6 lg:px-12 pt-32 pb-20 lg:py-0">
        <motion.div
          className="max-w-xl"
          variants={riseStagger(0.09)}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={rise}
            className="text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-sera-text-soft mb-6"
          >
            {isNL ? 'Online atelier · Natuursteen' : 'Online atelier · Natural stone'}
          </motion.p>

          <motion.h1
            id="arrival-heading"
            variants={rise}
            className="font-serif text-[clamp(2.75rem,6vw,5rem)] leading-[0.98] tracking-[-0.02em] text-sera-text mb-6"
          >
            {isNL ? (
              <>
                Sculpturale vormen
                <br />
                in <em className="italic text-sera-accent-hover">natuursteen.</em>
              </>
            ) : (
              <>
                Sculptural forms
                <br />
                in <em className="italic text-sera-accent-hover">natural stone.</em>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={rise}
            className="font-sans text-base lg:text-lg text-sera-text-soft leading-relaxed max-w-md mb-10"
          >
            {isNL
              ? 'Eettafels en salontafels op maat, uit één slab natuursteen. Ontworpen in Nederland, geleverd in 12–16 weken.'
              : 'Dining and coffee tables cut to order from a single natural stone slab. Designed in the Netherlands, delivered in 12–16 weeks.'}
          </motion.p>

          <motion.div variants={rise} className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="bg-sera-surface text-sera-inverted hover:bg-sera-text h-12 px-8 text-xs uppercase tracking-[0.15em] rounded-sm"
            >
              <Link to="/atelier">
                {isNL ? 'Ontwerp uw tafel' : 'Design your table'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/collections"
              className="link-underline text-xs uppercase tracking-[0.15em] text-sera-text py-3"
            >
              {isNL ? 'Bekijk lookbook' : 'View lookbook'}
            </Link>
          </motion.div>

          <motion.div
            variants={rise}
            className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-sera-text-soft"
          >
            <span>{isNL ? 'Ontworpen in NL' : 'Designed in NL'}</span>
            <span className="w-px h-3 bg-sera-text-soft/40" />
            <span>{isNL ? 'Vanaf €1.950' : 'From €1,950'}</span>
            <span className="w-px h-3 bg-sera-text-soft/40" />
            <span>{isNL ? '12–16 weken' : '12–16 weeks'}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue — a hairline that pulses to invite descent. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] uppercase tracking-[0.22em] text-sera-text-soft">
          {isNL ? 'Scroll' : 'Scroll'}
        </span>
        <motion.div
          className="w-px bg-sera-surface/50"
          initial={{ height: 12 }}
          animate={reduce ? { height: 32 } : { height: [12, 32, 12] }}
          transition={{ duration: 2.4, repeat: reduce ? 0 : Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
}