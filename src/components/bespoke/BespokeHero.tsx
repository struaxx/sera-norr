import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ArrowRight } from "lucide-react";
import bespokeHeroImage from "@/assets/bespoke-hero.png";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";

const BespokeHero = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const prefersReducedMotion = useReducedMotion();
  
  // Refs for scroll tracking
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // In-view detection for staggered animations
  const isTextInView = useInView(textRef, { once: true, margin: "-100px" });
  const isCaptionInView = useInView(heroRef, { once: true, margin: "-50px" });
  
  // Scroll progress for parallax (no sticky, just subtle movement)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax transforms (no sticky, just depth)
  const mainImageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-12, 24]);
  const thumb1Y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-8, 32]);
  const thumb2Y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-6, 28]);
  
  // Em-dash animation state (once only)
  const [dashWidth, setDashWidth] = useState(prefersReducedMotion ? 100 : 0);
  
  useEffect(() => {
    if (isTextInView && !prefersReducedMotion) {
      const timer = setTimeout(() => {
        setDashWidth(100);
      }, 400);
      return () => clearTimeout(timer);
    } else if (prefersReducedMotion) {
      setDashWidth(100);
    }
  }, [isTextInView, prefersReducedMotion]);

  // Animation variants - calm, premium timing
  const fadeUpVariant = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const chipVariant = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: prefersReducedMotion ? 0 : 0.55 + i * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const imageRevealVariant = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const captionFadeVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: prefersReducedMotion ? 0 : 0.9,
        ease: "easeOut"
      }
    }
  };

  // Breathing Ken Burns animation for main image
  const breathingAnimation = prefersReducedMotion ? {} : {
    animate: {
      scale: [1, 1.03, 1],
      x: [0, 4, 0],
      y: [0, 3, 0],
    },
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    }
  };

  const chips = [
    isNL ? 'Prijs op aanvraag' : 'Price on request',
    isNL ? 'Doorlooptijd 12–16 weken' : 'Lead time 12–16 weeks',
    isNL ? '5 jaar garantie' : '5 year warranty'
  ];

  return (
    <section ref={heroRef} className="pt-32 lg:pt-40 pb-12 lg:pb-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <Breadcrumbs className="mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Text Content - Staged reveal */}
          <div ref={textRef}>
            {/* Eyebrow */}
            <motion.p 
              className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4"
              variants={fadeUpVariant}
              initial="hidden"
              animate={isTextInView ? "visible" : "hidden"}
              custom={0}
            >
              {t('bespoke.subtitle')}
            </motion.p>
            
            {/* H1 with animated em-dash */}
            <motion.h1 
              className="font-serif text-display-lg text-foreground mb-5 leading-[1.1]"
              variants={fadeUpVariant}
              initial="hidden"
              animate={isTextInView ? "visible" : "hidden"}
              custom={0.12}
            >
              {isNL ? (
                <>
                  Maatwerk in natuursteen{' '}
                  <span className="relative inline-block">
                    <span 
                      className="inline-block bg-foreground h-[2px] align-middle transition-all duration-700 ease-out"
                      style={{ width: `${dashWidth}%`, minWidth: dashWidth > 0 ? '0.6em' : 0, maxWidth: '0.8em' }}
                    />
                  </span>
                  {' '}ontworpen voor uw ruimte
                </>
              ) : (
                <>
                  Bespoke natural stone{' '}
                  <span className="relative inline-block">
                    <span 
                      className="inline-block bg-foreground h-[2px] align-middle transition-all duration-700 ease-out"
                      style={{ width: `${dashWidth}%`, minWidth: dashWidth > 0 ? '0.6em' : 0, maxWidth: '0.8em' }}
                    />
                  </span>
                  {' '}designed for your space
                </>
              )}
            </motion.h1>
            
            {/* Paragraph */}
            <motion.p 
              className="text-muted-foreground text-body-lg leading-relaxed mb-6"
              variants={fadeUpVariant}
              initial="hidden"
              animate={isTextInView ? "visible" : "hidden"}
              custom={0.24}
            >
              {isNL 
                ? 'Van eerste schets tot plaatsing. Een zorgvuldig traject met materiaalkeuze, visualisaties en white-glove levering.'
                : 'From first sketch to installation. A careful process with material selection, visualizations and white-glove delivery.'}
            </motion.p>
            
            {/* Chips with stagger */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              {chips.map((chip, i) => (
                <motion.span 
                  key={chip}
                  className="inline-flex items-center px-4 py-1.5 bg-secondary/30 border border-border/40 text-sm text-foreground rounded-sm"
                  variants={chipVariant}
                  initial="hidden"
                  animate={isTextInView ? "visible" : "hidden"}
                  custom={i}
                >
                  {chip}
                </motion.span>
              ))}
            </div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 mb-4"
              variants={fadeUpVariant}
              initial="hidden"
              animate={isTextInView ? "visible" : "hidden"}
              custom={0.75}
            >
              <Button asChild variant="atelier-filled" size="lg" className="h-12">
                <Link to="/voorstel">
                  {isNL ? 'Ontvang voorstel binnen 48 uur' : 'Receive proposal within 48 hours'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="atelier" size="lg" className="h-12 border-foreground/30 hover:border-foreground/60">
                <Link to="/contact">
                  {isNL ? 'Plan vrijblijvend gesprek' : 'Schedule free consultation'}
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust line */}
            <motion.p 
              className="text-sm text-muted-foreground"
              variants={fadeUpVariant}
              initial="hidden"
              animate={isTextInView ? "visible" : "hidden"}
              custom={0.85}
            >
              {isNL ? 'Reactie binnen 48 uur — geen verplichtingen.' : 'Response within 48 hours — no obligations.'}
            </motion.p>
          </div>
          
          {/* Right: Collage with parallax + breathing (NO sticky) */}
          <div className="relative">
            {/* Main dominant image with breathing drift */}
            <motion.div 
              className="aspect-[4/5] bg-muted overflow-hidden relative z-10"
              variants={imageRevealVariant}
              initial="hidden"
              animate={isTextInView ? "visible" : "hidden"}
              custom={0.2}
              style={{ y: mainImageY }}
            >
              <motion.img 
                src={bespokeHeroImage} 
                alt={isNL ? "SERA NORR maatwerk ontwerp" : "SERA NORR bespoke design"} 
                className="w-full h-full object-cover"
                {...breathingAnimation}
              />
            </motion.div>
            
            {/* Detail thumbnail - bottom left overlap with hover */}
            <motion.div 
              className="absolute -bottom-6 -left-4 lg:-left-8 w-28 lg:w-36 aspect-square bg-muted overflow-hidden border-4 border-background shadow-lg z-20 cursor-pointer"
              variants={imageRevealVariant}
              initial="hidden"
              animate={isTextInView ? "visible" : "hidden"}
              custom={0.4}
              style={{ y: thumb1Y }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -3, transition: { duration: 0.25 } }}
            >
              <img 
                src={terraImage} 
                alt={isNL ? "Travertin detail" : "Travertine detail"} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            
            {/* Atelier thumbnail - bottom right overlap with hover */}
            <motion.div 
              className="absolute -bottom-4 right-6 lg:right-8 w-24 lg:w-32 aspect-[3/4] bg-muted overflow-hidden border-4 border-background shadow-lg z-20 cursor-pointer"
              variants={imageRevealVariant}
              initial="hidden"
              animate={isTextInView ? "visible" : "hidden"}
              custom={0.6}
              style={{ y: thumb2Y }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -3, transition: { duration: 0.25 } }}
            >
              <img 
                src={vantaImage} 
                alt={isNL ? "Atelier detail" : "Atelier detail"} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            
            {/* Caption with fade only */}
            <motion.p 
              className="absolute -bottom-12 right-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              variants={captionFadeVariant}
              initial="hidden"
              animate={isCaptionInView ? "visible" : "hidden"}
            >
              TERRA / VANTA — {isNL ? 'maatwerk voorbeelden' : 'bespoke examples'}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BespokeHero;
