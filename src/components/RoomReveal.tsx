import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import terraPlaceholder from "@/assets/terra-collection.jpg";

interface RoomRevealProps {
  beforeImage?: string;
  afterImage?: string;
  isNL: boolean;
}

export function RoomReveal({ beforeImage, afterImage, isNL }: RoomRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || isTouchDevice) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [prefersReducedMotion, isTouchDevice]
  );

  const showAfterDirectly = isTouchDevice || prefersReducedMotion;

  // Placeholder gradient for "before" (empty room)
  const beforeBg = beforeImage
    ? `url(${beforeImage})`
    : "linear-gradient(165deg, hsl(38 18% 92%) 0%, hsl(38 15% 88%) 45%, hsl(30 12% 78%) 100%)";

  const afterSrc = afterImage || terraPlaceholder;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-sm select-none",
        "aspect-[16/9] lg:aspect-[21/9]",
        !showAfterDirectly && "cursor-none"
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Before layer — empty room */}
      {showAfterDirectly ? (
        <img
          src={afterSrc}
          alt={isNL ? "Kamer met tafel" : "Room with table"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: beforeBg }}
          />

          {/* Subtle room details for placeholder */}
          {!beforeImage && (
            <div className="absolute inset-0">
              {/* Floor line */}
              <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[hsl(30_10%_72%)] to-transparent opacity-40" />
              {/* Wall corner shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(25_8%_65%/0.15)]" />
            </div>
          )}

          {/* After layer — room with table, circular clip following cursor */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: isHovering
                ? `circle(150px at ${mousePos.x}px ${mousePos.y}px)`
                : `circle(0px at ${mousePos.x}px ${mousePos.y}px)`,
              transition: isHovering
                ? "clip-path 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)"
                : "clip-path 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
            }}
          >
            <img
              src={afterSrc}
              alt={isNL ? "Kamer met tafel" : "Room with table"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Hover hint — disappears on hover */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
              isHovering ? "opacity-0" : "opacity-100"
            )}
          >
            <span className="micro-label text-foreground/30">
              {isNL ? "Hover om te ontdekken" : "Hover to discover"}
            </span>
          </div>

          {/* Custom cursor ring */}
          {isHovering && (
            <div
              className="pointer-events-none absolute rounded-full border border-foreground/15"
              style={{
                width: 300,
                height: 300,
                left: mousePos.x,
                top: mousePos.y,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </>
      )}

      {/* Label — appears on hover (desktop) or always visible (mobile) */}
      <div
        className={cn(
          "absolute bottom-5 left-5 lg:bottom-8 lg:left-8 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          showAfterDirectly
            ? "opacity-100 translate-y-0"
            : isHovering
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
