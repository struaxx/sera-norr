import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const [isActive, setIsActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Placeholder gradient for "before" (empty room)
  const beforeBg = beforeImage
    ? `url(${beforeImage})`
    : "linear-gradient(165deg, hsl(38 18% 92%) 0%, hsl(38 15% 88%) 45%, hsl(30 12% 78%) 100%)";

  const afterSrc = afterImage || terraPlaceholder;

  const getPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    },
    []
  );

  // Mouse handlers (desktop)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      getPosition(e.clientX, e.clientY);
    },
    [prefersReducedMotion, getPosition]
  );

  // Touch handlers (mobile)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const touch = e.touches[0];
      getPosition(touch.clientX, touch.clientY);
      setIsActive(true);
    },
    [prefersReducedMotion, getPosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const touch = e.touches[0];
      getPosition(touch.clientX, touch.clientY);
    },
    [prefersReducedMotion, getPosition]
  );

  const revealRadius = isMobile ? 100 : 150;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-sm select-none",
        "aspect-[16/9] lg:aspect-[21/9]",
        !isMobile && "cursor-none"
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsActive(false)}
    >
      {/* 1. Before layer — empty room */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: beforeBg }}
      />

      {/* Subtle room details for gradient placeholder */}
      {!beforeImage && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[hsl(30_10%_72%)] to-transparent opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(25_8%_65%/0.15)]" />
        </div>
      )}

      {/* 2. Hologram hint — ghosted after image, pulsing */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={afterSrc}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>
      )}

      {/* 3. After layer — full reveal via circular clip-path */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: isActive
            ? `circle(${revealRadius}px at ${mousePos.x}px ${mousePos.y}px)`
            : `circle(0px at ${mousePos.x}px ${mousePos.y}px)`,
          transition: isActive
            ? "clip-path 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)"
            : "clip-path 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        <img
          src={afterSrc}
          alt={isNL ? "Kamer met tafel" : "Room with table"}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* 4. Pulsing ring hint — disappears on interaction */}
      {!prefersReducedMotion && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
            isActive ? "opacity-0" : "opacity-100"
          )}
        >
          <motion.div
            className="absolute w-20 h-20 rounded-full border border-foreground/10"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="micro-label text-foreground/30">
            {isNL ? "Ontdek" : "Discover"}
          </span>
        </div>
      )}

      {/* 5. Custom cursor ring (desktop only) */}
      {isActive && !isMobile && (
        <div
          className="pointer-events-none absolute rounded-full border border-foreground/15"
          style={{
            width: revealRadius * 2,
            height: revealRadius * 2,
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* 6. Label with sizing options */}
      <div
        className={cn(
          "absolute bottom-5 left-5 lg:bottom-8 lg:left-8 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isActive
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        )}
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
