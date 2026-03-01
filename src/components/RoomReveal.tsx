import { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import terraPlaceholder from "@/assets/terra-collection.jpg";

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
  const [isHovering, setIsHovering] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const autoPosRef = useRef({ x: 0, y: 0 });
  const displayPosRef = useRef({ x: 0, y: 0 });
  const currentRadiusRef = useRef(0);
  const hoverBlendRef = useRef(0); // 0 = full auto, 1 = full mouse
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const clipLayerRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const beforeBg = beforeImage
    ? `url(${beforeImage})`
    : "linear-gradient(165deg, hsl(38 18% 92%) 0%, hsl(38 15% 88%) 45%, hsl(30 12% 78%) 100%)";

  const afterSrc = afterImage || terraPlaceholder;

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
      const targetBlend = isHovering ? 1 : 0;
      hoverBlendRef.current = lerp(hoverBlendRef.current, targetBlend, 0.06);

      // Display position: blend between auto and mouse
      const blend = hoverBlendRef.current;
      displayPosRef.current = {
        x: lerp(autoPosRef.current.x, mousePosRef.current.x, blend),
        y: lerp(autoPosRef.current.y, mousePosRef.current.y, blend),
      };

      // Radius: breathe slightly in idle, grow on hover
      const breathe = 1 + 0.06 * Math.sin(t * 0.8);
      const targetRadius = isHovering ? hoverRadius : idleRadius * breathe;
      currentRadiusRef.current = lerp(currentRadiusRef.current, targetRadius, 0.05);

      // Apply clip-path directly to DOM (no React re-render)
      const { x, y } = displayPosRef.current;
      const r = currentRadiusRef.current;

      if (clipLayerRef.current) {
        clipLayerRef.current.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
      }

      // Cursor ring (desktop)
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${x}px`;
        cursorRingRef.current.style.top = `${y}px`;
        cursorRingRef.current.style.width = `${r * 2}px`;
        cursorRingRef.current.style.height = `${r * 2}px`;
        cursorRingRef.current.style.opacity = isHovering ? "1" : "0";
      }

      // Hint label
      if (hintRef.current) {
        hintRef.current.style.opacity = isHovering ? "0" : "1";
      }

      // Size label
      if (labelRef.current) {
        labelRef.current.style.opacity = isHovering ? "1" : "0";
        labelRef.current.style.transform = isHovering
          ? "translateY(0)"
          : "translateY(12px)";
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize radius
    currentRadiusRef.current = isMobile ? 80 : 120;
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [prefersReducedMotion, isHovering, isMobile, getDimensions]);

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
      setIsHovering(true);
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsHovering(false)}
    >
      {/* 1. Before layer — empty room */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: beforeBg }}
      />

      {/* Room detail gradients for placeholder */}
      {!beforeImage && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[hsl(30_10%_72%)] to-transparent opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(25_8%_65%/0.15)]" />
        </div>
      )}

      {/* 2. After layer — circular clip-path reveal (always visible, auto-animating) */}
      <div
        ref={clipLayerRef}
        className="absolute inset-0"
        style={{ clipPath: "circle(120px at 50% 50%)" }}
      >
        <img
          src={afterSrc}
          alt={isNL ? "Kamer met tafel" : "Room with table"}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* 3. "Ontdek" hint — fades out on hover */}
      <div
        ref={hintRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
      >
        <span className="micro-label text-foreground/30">
          {isNL ? "Ontdek" : "Discover"}
        </span>
      </div>

      {/* 4. Cursor ring (desktop only) */}
      {!isMobile && (
        <div
          ref={cursorRingRef}
          className="pointer-events-none absolute rounded-full border border-foreground/15"
          style={{
            opacity: 0,
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* 5. Label with sizing options — fades in on hover */}
      <div
        ref={labelRef}
        className="absolute bottom-5 left-5 lg:bottom-8 lg:left-8"
        style={{
          opacity: 0,
          transform: "translateY(12px)",
          transition: "opacity 0.5s cubic-bezier(0.25,0.1,0.25,1), transform 0.5s cubic-bezier(0.25,0.1,0.25,1)",
        }}
      >
        <div className="bg-background/90 backdrop-blur-sm px-5 py-3 rounded-sm shadow-sm">
          <p className="micro-label mb-1">
            {isNL ? "Op maat gemaakt" : "Made to fit"}
          </p>
          <p className="font-serif text-sm lg:text-base text-foreground tracking-wide">
            180×90 &nbsp;/&nbsp; 200×100 &nbsp;/&nbsp; custom
          </p>
        </div>
      </div>
    </div>
  );
}
