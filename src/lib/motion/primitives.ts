// ============================================
// Sera Norr — Motion Primitives
// Five named animations. Each with a purpose.
// See docs/EXPERIENCE_OS.md §5.
// ============================================

import { useReducedMotion, type Variants, type Transition } from 'framer-motion';

const easeOutQuart = [0.16, 1, 0.3, 1] as const;
const easeOutCubic = [0.33, 1, 0.68, 1] as const;

/**
 * RISE — reveal on section entry.
 * Purpose: mimic a printed page being laid down.
 */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutQuart },
  },
};

/** Stagger children under a shared parent (headline + subcopy + CTA). */
export const riseStagger = (delay = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay, delayChildren: 0.05 },
  },
});

/**
 * SETTLE — confirm on click / select.
 * Purpose: physical "click into place" feedback for pill selections.
 */
export const settleTransition: Transition = {
  duration: 0.4,
  ease: easeOutCubic,
};

export const settleTap = { scale: 0.985 } as const;
export const settleHover = { scale: 1.015 } as const;

/**
 * DRIFT — slow parallax on scroll.
 * Purpose: guide the eye down the page.
 * Consumers use useScroll + useTransform, this exposes the factor.
 */
export const DRIFT_FACTOR = 0.15;

/**
 * HAIRLINE-DRAW — SVG stroke reveal.
 * Purpose: hand-drawn measure line, atelier metaphor.
 * Consumer applies to an <svg><line/></svg> with pathLength=1.
 */
export const hairlineDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: easeOutQuart },
  },
};

/**
 * STONE-TURN — cursor-follow rotation for stone cards.
 * Purpose: reward curiosity with material.
 * Consumer applies to a 3D mesh; this exposes the damping constants.
 */
export const STONE_TURN = {
  maxRotation: Math.PI / 12, // ±15°
  damping: 0.08,
} as const;

/**
 * Central reduced-motion hook. Every primitive should route through this.
 * When set, primitives collapse to opacity-only or instant transitions.
 */
export function useMotionPreference() {
  const reduce = useReducedMotion();
  return {
    reduce: !!reduce,
    rise: reduce
      ? ({ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } } as Variants)
      : riseVariants,
    settle: reduce ? { duration: 0 } : settleTransition,
    driftFactor: reduce ? 0 : DRIFT_FACTOR,
    hairline: reduce
      ? ({ hidden: { opacity: 0 }, visible: { opacity: 1 } } as Variants)
      : hairlineDrawVariants,
  };
}