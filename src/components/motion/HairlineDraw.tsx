// Sera Norr — HairlineDraw primitive host.
// See docs/EXPERIENCE_OS.md §5.

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useMotionPreference } from '@/lib/motion/primitives';

interface HairlineDrawProps {
  className?: string;
  /** Optional label rendered inline between two drawn hairlines. */
  label?: string;
  /** Force alignment when label is present. */
  align?: 'center' | 'left';
}

/**
 * Two-sided hand-drawn measure line. Purpose: structure section labels
 * with an atelier metaphor. Both strokes draw in on view.
 */
export function HairlineDraw({ className, label, align = 'center' }: HairlineDrawProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const { hairline } = useMotionPreference();

  const line = (
    <svg
      className="flex-1 h-px overflow-visible"
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.line
        x1="0"
        y1="0.5"
        x2="100"
        y2="0.5"
        pathLength={1}
        className="hairline-track"
        variants={hairline}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      />
    </svg>
  );

  return (
    <div
      ref={ref}
      className={`flex items-center gap-6 ${align === 'left' ? 'justify-start' : ''} ${className ?? ''}`}
    >
      {align === 'center' && line}
      {label && (
        <span className="shrink-0 text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </span>
      )}
      {line}
    </div>
  );
}