import { useRef, useCallback, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import roomEmpty from "@/assets/room-empty.jpg";
import roomFurnished from "@/assets/room-furnished.jpg";

interface RoomRevealProps {
  beforeImage?: string;
  afterImage?: string;
  isNL: boolean;
}

export function RoomReveal({ beforeImage, afterImage, isNL }: RoomRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Positions
  const isHoveringRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const autoPosRef = useRef({ x: 0, y: 0 });
  const displayPosRef = useRef({ x: 0, y: 0 });
  const currentRadiusRef = useRef(0);
  const hoverBlendRef = useRef(0); // 0 = full auto, 1 = full mouse
  const cursorOpacityRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const clipLayerRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const beforeSrc = beforeImage || roomEmpty;
  const afterSrc = afterImage || roomFurnished;

  // Lerp helper
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Get container dimensions
  const getDimensions = useCallback(() => {
    if (!containerRef.current) return { w: 600, h: 300, cx: 300, cy: 150 };
    const rect = containerRef.current.getBoundingClientRect();
    return { w: rect.width, h: rect.height, cx: rect.width / 2, cy: rect.height / 2 };
  }, []);

  // Animation loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const idleRadius = isMobile ? 80 : 120;
    const hoverRadius = isMobile ? 110 : 180;

    const animate = () => {
      const { w, h, cx, cy } = getDimensions();
      timeRef.current += 0.008;
      const t = timeRef.current;

      // Lissajous auto-position — organic, non-repeating path
      autoPosRef.current = {
        x: cx + w * 0.28 * Math.sin(t * 0.31 + 0.5),
        y: cy + h * 0.25 * Math.cos(t * 0.23),
      };

      // Blend factor: smoothly transition between auto and mouse
      const targetBlend = isHoveringRef.current ? 1 : 0;
      hoverBlendRef.current = lerp(hoverBlendRef.current, targetBlend, 0.06);

      // Display position: blend between auto and mouse
      const blend = hoverBlendRef.current;
      displayPosRef.current = {
        x: lerp(autoPosRef.current.x, mousePosRef.current.x, blend),
        y: lerp(autoPosRef.current.y, mousePosRef.current.y, blend),
      };

      // Radius: breathe slightly in idle, grow on hover
      const breathe = 1 + 0.06 * Math.sin(t * 0.8);
      const targetRadius = isHoveringRef.current ? hoverRadius : idleRadius * breathe;
      currentRadiusRef.current = lerp(currentRadiusRef.current, targetRadius, 0.05);

      // Apply clip-path directly to DOM (no React re-render)
      const { x, y } = displayPosRef.current;
      const r = currentRadiusRef.current;

      if (clipLayerRef.current) {
        clipLayerRef.current.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
      }

      // Cursor ring (desktop) — smooth lerped opacity
      if (cursorRingRef.current) {
        const targetCursorOpacity = isHoveringRef.current ? 1 : 0;
        cursorOpacityRef.current = lerp(cursorOpacityRef.current, targetCursorOpacity, 0.15);
        cursorRingRef.current.style.left = `${x}px`;
        cursorRingRef.current.style.top = `${y}px`;
        cursorRingRef.current.style.width = `${r * 2}px`;
        cursorRingRef.current.style.height = `${r * 2}px`;
        cursorRingRef.current.style.opacity = isHoveringRef.current ? "1" : "0";
      }

      // Hint label — gentle pulse when idle, fade out on hover
      if (hintRef.current) {
        hintRef.current.style.opacity = isHoveringRef.current ? "0" : "1";
      }

      // Size label
      if (labelRef.current) {
        labelRef.current.style.opacity = isHoveringRef.current ? "1" : "0";
        labelRef.current.style.transform = isHoveringRef.current
          ? "translateY(0)"
          : "translateY(12px)";
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize radius only on mount
    if (currentRadiusRef.current === 0) {
      currentRadiusRef.current = isMobile ? 80 : 120;
    }
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [prefersReducedMotion, isMobile, getDimensions]);

  // Mouse handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
      isHoveringRef.current = true;
    },
    []
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      isHoveringRef.current = true;
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    },
    []
  );

  // Reduced motion fallback: static side-by-side
  if (prefersReducedMotion) {
    return (
      <div className="relative overflow-hidden rounded-sm aspect-[16/9] lg:aspect-[21/9]">
        <img
          src={afterSrc}
          alt={isNL ? "Kamer met tafel" : "Room with table"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-sm select-none",
        "aspect-[16/9] lg:aspect-[21/9]",
        !isMobile && "cursor-none"
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { isHoveringRef.current = true; }}
      onMouseLeave={() => { isHoveringRef.current = false; }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => { isHoveringRef.current = false; }}
    >
      {/* 1. Before layer — empty room */}
      <img
        src={beforeSrc}
        alt={isNL ? "Lege kamer" : "Empty room"}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        draggable={false}
      />

      {/* 2. After layer — circular clip-path reveal (always visible, auto-animating) */}
      <div
        ref={clipLayerRef}
        className="absolute inset-0"
        style={{ clipPath: "circle(120px at 50% 50%)" }}
      >
        <img
          src={afterSrc}
          alt={isNL ? "Kamer met tafel" : "Room with table"}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          draggable={false}
        />
      </div>

      {/* 3. "Ontdek" hint — pulses gently when idle, fades on hover */}
      <div
        ref={hintRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="micro-label text-foreground/60">
          {isNL ? "Ontdek" : "Discover"}
        </span>
      </div>

      {/* 4. Cursor ring (desktop only) */}
      {!isMobile && (
        <div
          ref={cursorRingRef}
          className="pointer-events-none absolute rounded-full border-2 border-foreground/30"
          style={{
            opacity: 0,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

    </div>
  );
}
