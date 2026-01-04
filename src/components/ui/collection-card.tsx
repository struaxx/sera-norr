import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CollectionCardProps {
  id: string;
  handle: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  description: string;
  collectionLabel: string;
  priceLabel: string;
  ctaLabel: string;
  index: number;
}

export function CollectionCard({
  id,
  handle,
  title,
  imageUrl,
  imageAlt,
  description,
  collectionLabel,
  priceLabel,
  ctaLabel,
  index,
}: CollectionCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Subtle parallax: max 15px movement
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isTouchDevice ? [0, 0] : [-15, 15]
  );

  // Handle mouse move for spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion || isTouchDevice) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Staggered reveal animation
  const revealVariants = {
    hidden: { 
      clipPath: prefersReducedMotion ? 'inset(0%)' : 'inset(100% 0% 0% 0%)',
      opacity: prefersReducedMotion ? 1 : 0 
    },
    visible: { 
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: {
        clipPath: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.5, ease: "easeOut" },
        delay: index * 0.15
      }
    }
  };

  const captionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.15 + 0.3
      }
    }
  };

  return (
    <Link
      ref={cardRef}
      to={`/collections/${handle}`}
      className="group block h-full flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0.5, y: 0.5 });
      }}
    >
      {/* Image container with reveal mask */}
      <motion.div 
        ref={imageContainerRef}
        className="relative mb-5 overflow-hidden"
        variants={prefersReducedMotion ? {} : revealVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="aspect-[3/4] bg-muted overflow-hidden relative">
          {imageUrl ? (
            <motion.div
              className="w-full h-full"
              style={{ y: imageY }}
            >
              <motion.img
                src={imageUrl}
                alt={imageAlt || title}
                className="w-full h-full object-cover"
                animate={{
                  scale: isHovering && !prefersReducedMotion && !isTouchDevice ? 1.03 : 1
                }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
              <span className="text-muted-foreground font-serif text-2xl">{title}</span>
            </div>
          )}
          
          {/* Spotlight overlay - desktop only */}
          {!prefersReducedMotion && !isTouchDevice && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: isHovering ? 1 : 0,
                background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.08), transparent 40%)`
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          )}
        </div>
      </motion.div>
      
      {/* Editorial caption with lift effect */}
      <motion.div 
        className="space-y-2"
        variants={prefersReducedMotion ? {} : captionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          animate={{
            y: isHovering && !prefersReducedMotion && !isTouchDevice ? -6 : 0
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
            {collectionLabel}
          </p>
          <h3 className="font-serif text-xl lg:text-2xl text-foreground">
            {title}
          </h3>
          <p className="text-body-sm text-muted-foreground max-w-xs">
            {description}
          </p>
          
          {/* Price tag + CTA */}
          <div className="pt-3 flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-1 border border-foreground/12 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {priceLabel}
            </span>
            <motion.span 
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.1em] text-foreground"
              animate={{
                gap: isHovering ? '12px' : '8px'
              }}
              transition={{ duration: 0.3 }}
            >
              {ctaLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.span>
          </div>
          
          {/* Hairline highlight on hover */}
          <motion.div 
            className="h-px bg-foreground/20 mt-4 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovering && !prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </motion.div>
      </motion.div>
    </Link>
  );
}
