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
  const collageRef = useRef<HTMLDivElement>(null);
  
  // In-view detection for staggered animations
  const isTextInView = useInView(textRef, { once: true, margin: "-100px" });
  
  // Scroll progress for parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax transforms (subtle, max 30px travel)
  const mainImageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 30]);
  const detailImageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 20]);
  const atelierImageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 15]);
  
  // Em-dash animation state
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

  // Animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
        duration: 0.4,
        delay: prefersReducedMotion ? 0 : 0.5 + i * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const imageRevealVariant = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const chips = [
    isNL ? 'Prijs op aanvraag' : 'Price on request',
    isNL ? 'Doorlooptijd 12–16 weken' : 'Lead time 12–16 weeks',
    isNL ? '5 jaar garantie' : '5 year warranty'
  ];

  return (
    <section ref={heroRef} className="pt-32 lg:pt-40 pb-8 lg:pb-10 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <Breadcrumbs className="mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Text Content */}
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
              custom={0.1}
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
              custom={0.2}
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
              custom={0.7}
            >
              <Button asChild variant="atelier-filled" size="lg" className="h-12">
                <a href="#offerte">
                  {isNL ? 'Vraag offerte aan' : 'Request quote'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
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
              custom={0.8}
            >
              {isNL ? 'Reactie binnen 48 uur — geen verplichtingen.' : 'Response within 48 hours — no obligations.'}
            </motion.p>
          </div>
          
          {/* Right: Collage with Sticky + Parallax */}
          <div ref={collageRef} className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative">
              {/* Main dominant image */}
              <motion.div 
                className="aspect-[4/5] bg-muted overflow-hidden relative z-10"
                variants={imageRevealVariant}
                initial="hidden"
                animate={isTextInView ? "visible" : "hidden"}
                custom={0.2}
                style={{ y: mainImageY }}
              >
                <img 
                  src={bespokeHeroImage} 
                  alt={isNL ? "SERA NORR maatwerk ontwerp" : "SERA NORR bespoke design"} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
              
              {/* Detail image - bottom left overlap */}
              <motion.div 
                className="absolute -bottom-6 -left-4 lg:-left-8 w-28 lg:w-36 aspect-square bg-muted overflow-hidden border-4 border-background shadow-lg z-20"
                variants={imageRevealVariant}
                initial="hidden"
                animate={isTextInView ? "visible" : "hidden"}
                custom={0.4}
                style={{ y: detailImageY }}
              >
                <img 
                  src={terraImage} 
                  alt={isNL ? "Travertin detail" : "Travertine detail"} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
              
              {/* Atelier image - bottom right overlap */}
              <motion.div 
                className="absolute -bottom-4 right-6 lg:right-8 w-24 lg:w-32 aspect-[3/4] bg-muted overflow-hidden border-4 border-background shadow-lg z-20"
                variants={imageRevealVariant}
                initial="hidden"
                animate={isTextInView ? "visible" : "hidden"}
                custom={0.6}
                style={{ y: atelierImageY }}
              >
                <img 
                  src={vantaImage} 
                  alt={isNL ? "Atelier detail" : "Atelier detail"} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
              
              {/* Caption */}
              <motion.p 
                className="absolute -bottom-10 right-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                variants={fadeUpVariant}
                initial="hidden"
                animate={isTextInView ? "visible" : "hidden"}
                custom={0.8}
              >
                TERRA / VANTA — {isNL ? 'maatwerk voorbeelden' : 'bespoke examples'}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BespokeHero;
