// ============================================
// Act II — Material
// Horizontal-scrubbed wall of six stones.
// Purpose: convey catalog breadth without a grid dump.
// The camera dollies as you scroll; each stone is a
// full-height slab of texture that turns on hover (StoneTurn).
// ============================================

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HairlineDraw } from '@/components/motion/HairlineDraw';
import { useMotionPreference } from '@/lib/motion/primitives';

interface Stone {
  id: string;
  name: string;
  origin: string;
  texture: string;
}

const STONES: Stone[] = [
  { id: 'calacatta-viola', name: 'Calacatta Viola', origin: 'Toscana, IT', texture: '/stones/marble/calacatta-viola.jpg' },
  { id: 'tiramisu',        name: 'Tiramisu',        origin: 'Iran',        texture: '/stones/travertine/tiramisu.jpg' },
  { id: 'golden-coast',    name: 'Golden Coast',    origin: 'Turkey',      texture: '/stones/travertine/golden-coast.jpg' },
  { id: 'bianco-carrara',  name: 'Bianco Carrara',  origin: 'Toscana, IT', texture: '/stones/marble/bianco-carrara.jpg' },
  { id: 'sbyss-black',     name: 'Sbyss Black',     origin: 'Turkey',      texture: '/stones/travertine/sbyss-black.jpg' },
  { id: 'classic-cloudy',  name: 'Classic Cloudy',  origin: 'Turkey',      texture: '/stones/travertine/classic-cloudy.jpg' },
];

export function ActMaterial({ isNL }: { isNL: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { reduce } = useMotionPreference();

  // Scroll progress across the section. 0 = section top hits viewport top,
  // 1 = section bottom leaves viewport bottom. Purpose: the dolly must be
  // tied to reading rhythm, not to time.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Horizontal travel: 6 slabs, ~40vw each on desktop → dolly ~240vw total.
  // Reduced motion collapses to zero.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-72%']);

  return (
    <section
      ref={sectionRef}
      // Tall enough that the horizontal dolly reads clearly: 3× viewport.
      className="relative bg-sera-bg-deep"
      style={{ height: '300vh' }}
      aria-labelledby="material-heading"
    >
      {/* Sticky viewport — the dolly happens here. */}
      <div className="sticky top-0 h-[100dvh] flex flex-col overflow-hidden">
        {/* Header rail with animated hairlines around the label. */}
        <div className="container mx-auto px-6 lg:px-12 pt-24 pb-10">
          <HairlineDraw label={isNL ? 'Steensoorten' : 'Stones'} />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
            <h2
              id="material-heading"
              className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] tracking-[-0.015em] text-sera-text max-w-2xl"
            >
              {isNL
                ? 'Zes karakters, één ambacht.'
                : 'Six characters, one craft.'}
            </h2>
            <p className="text-sm text-sera-text-soft max-w-sm">
              {isNL
                ? 'Elk blok komt uit een geselecteerde groeve. Scroll om de collectie te doorlopen.'
                : 'Each block comes from a selected quarry. Scroll to move through the collection.'}
            </p>
          </div>
        </div>

        {/* The dolly wall. */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex h-full items-center gap-8 lg:gap-12 pl-6 lg:pl-12 pr-[10vw]"
            style={{ x, willChange: 'transform' }}
          >
            {STONES.map((stone, i) => (
              <StoneCard key={stone.id} stone={stone} index={i} />
            ))}

            {/* Terminal card: the invitation to see the whole library. */}
            <Link
              to="/atelier"
              className="group shrink-0 w-[40vw] lg:w-[26vw] h-[68vh] flex flex-col items-center justify-center gap-6 border border-sera-text-soft/30 rounded-sm bg-sera-bg hover:bg-sera-bg/60 transition-colors"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-sera-text-soft">
                {isNL ? 'Volledige bibliotheek' : 'Full library'}
              </span>
              <span className="font-serif text-2xl text-sera-text group-hover:text-sera-accent-hover transition-colors">
                {isNL ? '80+ steensoorten →' : '80+ stones →'}
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StoneCard({ stone, index }: { stone: Stone; index: number }) {
  // StoneTurn (Y-tilt) on hover — cursor-follow damped tilt in CSS 3D space.
  // Purpose: reward curiosity with a glimpse of the slab's depth. Bounded
  // to ±6° so it never feels like a fidget spinner.
  const cardRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${px * 6}deg) rotateX(${-py * 4}deg)`;
  };
  const onPointerLeave = () => {
    const el = cardRef.current;
    if (el) el.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
  };

  return (
    <motion.div
      ref={cardRef}
      className="shrink-0 w-[70vw] sm:w-[46vw] lg:w-[28vw] h-[68vh] relative rounded-sm overflow-hidden bg-sera-surface transition-transform duration-500 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <img
        src={stone.texture}
        alt={`${stone.name} — ${stone.origin}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      {/* Bottom caption veil. Warm dark so it never reads as tech-y. */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-sera-surface/85 via-sera-surface/40 to-transparent">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-sera-inverted/70 mb-2">
              {String(index + 1).padStart(2, '0')} / 06
            </p>
            <h3 className="font-serif text-2xl text-sera-inverted leading-tight">
              {stone.name}
            </h3>
          </div>
          <span className="text-[11px] uppercase tracking-[0.15em] text-sera-inverted/60 whitespace-nowrap">
            {stone.origin}
          </span>
        </div>
      </div>
    </motion.div>
  );
}