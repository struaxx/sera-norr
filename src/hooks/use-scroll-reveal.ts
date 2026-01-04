import { useRef } from 'react';
import { useInView, useReducedMotion, Variants } from 'framer-motion';

interface UseScrollRevealOptions {
  /** Margin for intersection observer (e.g., "-100px") */
  margin?: string;
  /** Only trigger once */
  once?: boolean;
  /** Delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
}

interface ScrollRevealReturn {
  ref: React.RefObject<any>;
  isInView: boolean;
  prefersReducedMotion: boolean | null;
  variants: {
    fadeUp: Variants;
    fadeIn: Variants;
    staggerContainer: Variants;
    staggerItem: Variants;
    slideInLeft: Variants;
    slideInRight: Variants;
    scaleIn: Variants;
  };
}

export function useScrollReveal(options: UseScrollRevealOptions = {}): ScrollRevealReturn {
  const {
    margin = "-80px",
    once = true,
    delay = 0,
    duration = 0.6,
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: margin as any });
  const prefersReducedMotion = useReducedMotion();

  // Base easing curve - refined, editorial feel
  const ease = [0.25, 0.1, 0.25, 1];

  const variants = {
    fadeUp: {
      hidden: prefersReducedMotion 
        ? { opacity: 1, y: 0 } 
        : { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          ease,
          delay,
        },
      },
    } as Variants,

    fadeIn: {
      hidden: prefersReducedMotion 
        ? { opacity: 1 } 
        : { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration,
          ease,
          delay,
        },
      },
    } as Variants,

    staggerContainer: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay,
        },
      },
    } as Variants,

    staggerItem: {
      hidden: prefersReducedMotion 
        ? { opacity: 1, y: 0 } 
        : { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: duration * 0.8,
          ease,
        },
      },
    } as Variants,

    slideInLeft: {
      hidden: prefersReducedMotion 
        ? { opacity: 1, x: 0 } 
        : { opacity: 0, x: -40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          ease,
          delay,
        },
      },
    } as Variants,

    slideInRight: {
      hidden: prefersReducedMotion 
        ? { opacity: 1, x: 0 } 
        : { opacity: 0, x: 40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          ease,
          delay,
        },
      },
    } as Variants,

    scaleIn: {
      hidden: prefersReducedMotion 
        ? { opacity: 1, scale: 1 } 
        : { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          ease,
          delay,
        },
      },
    } as Variants,
  };

  return {
    ref,
    isInView,
    prefersReducedMotion,
    variants,
  };
}
