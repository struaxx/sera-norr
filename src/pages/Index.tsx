import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, baseSchema } from "@/components/seo";
import { Hairline } from "@/components/ui/hairline";

import { ValuePillars, AtelierSteps } from "@/components/homepage";
import { RoomReveal } from "@/components/RoomReveal";
import { usePageTracking } from "@/hooks/use-tracking";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useIsMobile } from "@/hooks/use-mobile";
import heroImage from "@/assets/hero-restaurant-marble.jpeg";


const Index = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  usePageTracking();

  // Collection descriptions for the section
  const collectionsIntro = {
    title: isNL ? "Travertin & marmer" : "Travertine & marble",
    subtitle: isNL ?
    "Twee signatuurcollecties, elk met eigen karakter." :
    "Two signature collections, each with its own character."
  };

  const seoTitle = isNL ?
  "SERA NORR — Luxe natuursteen meubels op maat | Online atelier" :
  "SERA NORR — Luxury Natural Stone Furniture | Online Atelier";

  const seoDescription = isNL ?
  "Online atelier voor maatwerk tafels en consoles in travertin en marmer. Van ontwerp en visualisatie tot white-glove levering in Nederland." :
  "Online atelier for bespoke tables and consoles in travertine and marble. From design and visualization to white-glove delivery in the Netherlands.";

  const seoKeywords = isNL ?
  "SERA NORR, online atelier, maatwerk natuursteenmeubels, travertin tafel, marmeren tafel op maat, Calacatta Viola, stenen eettafel" :
  "SERA NORR, online atelier, bespoke natural stone furniture, travertine table, custom marble table, Calacatta Viola, stone dining table";

  return (
    <Layout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        structuredData={baseSchema} />
      

      {/* ============================================
           HERO - Dual CTA: Ontwerp uw tafel + Collecties
           ============================================ */}
      <section className="relative h-screen flex items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={isNL ? "SERA NORR - Luxe stenen meubels op maat" : "SERA NORR - Luxury bespoke stone furniture"}
            className="w-full h-full object-cover" />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-foreground/42" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/98 via-foreground/90 to-foreground/68" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/76 via-foreground/38 to-foreground/62" />
          <div className="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-foreground/78 via-foreground/42 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_88%_at_center,hsl(var(--foreground)/0.56)_0%,hsl(var(--foreground)/0.40)_42%,transparent_78%)]" />
        </div>
        
        {/* Content - centered */}
        <div className="relative z-10 w-full pb-20 lg:pb-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto text-center [text-shadow:0_8px_32px_hsl(var(--foreground)/0.72)]">
              {/* Micro-label */}
              <p className="inline-block text-[10px] font-sans uppercase tracking-[0.25em] text-background mb-4 font-extrabold">
                {isNL ? 'Online atelier voor natuursteen' : 'Online atelier for natural stone'}
              </p>
              
              {/* H1 */}
              <h1 className="font-serif font-semibold text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] text-background mb-4 leading-[1.05] tracking-[-0.02em]">
                {isNL ? "Sculpturale vormen in natuursteen." : "Sculptural forms in natural stone."}
              </h1>
              
              {/* Subcopy */}
              <p className="font-sans text-base lg:text-lg font-medium text-background max-w-2xl mx-auto mb-8">
                {isNL ?
                "Travertin, marmer en geselecteerde steensoorten. Op maat gemaakt." :
                "Travertine, marble and selected stone types. Made to measure."}
              </p>
              
              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild variant="sera-primary" size="default" className="bg-background text-foreground hover:bg-background/95 h-12 px-8 shadow-[0_10px_30px_hsl(var(--foreground)/0.28)]">
                  <Link to="/atelier">
                    {isNL ? "Ontwerp uw tafel" : "Design your table"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="default" className="text-background hover:text-background hover:bg-background/12 h-12 px-6">
                  <a href="#collecties">
                    {isNL ? "Ontdek de collecties" : "Discover collections"}
                  </a>
                </Button>
              </div>
              
              {/* Trust rail */}
              <div className="mt-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-background">
                <span>{isNL ? 'Ontworpen in NL' : 'Designed in NL'}</span>
                <span className="hidden sm:inline text-background/70">·</span>
                <span>{isNL ? '2 jaar garantie' : '2 year warranty'}</span>
                <span className="hidden sm:inline text-background/70">·</span>
                <span>{isNL ? '12–16 weken' : '12–16 weeks'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-background">
          <span className="text-[10px] uppercase tracking-[0.2em]">{t('home.scroll')}</span>
          <div className="w-px h-8 bg-background/60" />
        </div>
      </section>

      {/* ============================================
           INTRO - Short, scannable
           ============================================ */}
      <IntroSection isNL={isNL} />
      
      {/* Sticky mobile CTA */}
      <StickyMobileCTA isNL={isNL} />

      {/* ============================================
           COLLECTIES - Static VANTA & TERRA
           ============================================ */}
      <CollectiesSection isNL={isNL} />

      {/* ============================================
           3-STEP ATELIER INTRO (Primary funnel entry)
           ============================================ */}
      <AtelierSteps isNL={isNL} />

      {/* ============================================
           WAAROM SERA NORR - Value Pillars (unified block)
           ============================================ */}
      <ValuePillars isNL={isNL} />

      {/* ============================================
           CARE - Advice only, no warranty
           ============================================ */}
      <CareSection isNL={isNL} />

      {/* ============================================
           FINAL CTA - "Neem contact op"
           ============================================ */}
      <FinalCTASection isNL={isNL} />
    </Layout>);

};

// ============================================
// INTRO SECTION
// ============================================
function IntroSection({ isNL }: {isNL: boolean;}) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section id="intro" className="py-20 lg:py-28" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}>
          
          <p className="font-serif text-xl lg:text-2xl text-foreground leading-relaxed">
            {isNL ?
            "Wij ontwerpen en vervaardigen meubels in natuursteen. Elk stuk is uniek, op maat gemaakt en geleverd met white-glove service." :
            "We design and craft furniture in natural stone. Each piece is unique, made to measure and delivered with white-glove service."}
          </p>
        </motion.div>
      </div>
    </section>);

}

// ============================================
// COLLECTIES SECTION (static data)
// ============================================
function CollectiesSection({
  isNL


}: {isNL: boolean;}) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section id="collecties" className="py-24 lg:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          className="flex items-center gap-6 mb-16 lg:mb-20"
          variants={variants.fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}>
          
          <Hairline className="flex-1" />
          <span className="micro-label shrink-0">{isNL ? 'Collecties' : 'Collections'}</span>
          <Hairline className="flex-1" />
        </motion.div>

        <motion.div
          className="max-w-lg mb-16"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}>
          
          <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-4">
            {isNL ? "Travertin & marmer" : "Travertine & marble"}
          </h2>
          <p className="text-body-md text-muted-foreground">
            {isNL ?
            "Twee signatuurcollecties, elk met eigen karakter." :
            "Two signature collections, each with its own character."}
          </p>
        </motion.div>

        {/* Room Fit Reveal — hover to see a table appear in the room */}
        <motion.div
          className="mb-16"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}>
          
          <RoomReveal isNL={isNL} />
        </motion.div>

        {/* Lookbook preview link */}
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}>
          
          <Link to="/collections" className="group block">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-8">
              {[
              { src: '/lookbook/marble-round-livingroom.png', alt: isNL ? 'Ronde marmeren tafel in woonkamer setting' : 'Round marble table in living room setting' },
              { src: '/lookbook/travertine-oval-slab.png', alt: isNL ? 'Ovale travertin eettafel met massieve slab basis' : 'Oval travertine dining table with massive slab base' },
              { src: '/lookbook/calacatta-viola-round.png', alt: isNL ? 'Ronde Calacatta Viola marmeren tafel' : 'Round Calacatta Viola marble table' },
              { src: '/lookbook/travertine-round-cone.png', alt: isNL ? 'Ronde travertin salontafel met conische basis' : 'Round travertine coffee table with conical base' }].
              map((img, i) =>
              <div key={i} className="aspect-[4/5] overflow-hidden bg-secondary/50">
                  <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy" />
                
                </div>
              )}
            </div>
          </Link>
        </motion.div>

        {/* Single CTA to lookbook */}
        <motion.div
          className="mt-8 lg:mt-12 text-center"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}>
          
          <Button asChild variant="sera-secondary" size="lg">
            <Link to="/collections">
              {isNL ? "Bekijk lookbook" : "View lookbook"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>);

}


// ============================================
// CARE SECTION - Advice only, no warranty
// ============================================
function CareSection({ isNL }: {isNL: boolean;}) {
  const { ref, isInView, variants } = useScrollReveal();

  const careTips = isNL ? [
  { number: '01', text: 'Vlekbescherming & impregnatie' },
  { number: '02', text: 'Dagelijkse reiniging met milde zeep' },
  { number: '03', text: 'Langdurige schoonheid door eenvoudig onderhoud' }] :
  [
  { number: '01', text: 'Stain protection & impregnation' },
  { number: '02', text: 'Daily cleaning with mild soap' },
  { number: '03', text: 'Long-lasting beauty through simple care' }];


  return (
    <section id="onderhoud" className="py-24 lg:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          className="flex items-center gap-6 mb-12 lg:mb-16"
          variants={variants.fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}>
          
          <Hairline className="flex-1" />
          <span className="micro-label shrink-0">{isNL ? 'Onderhoud' : 'Care'}</span>
          <Hairline className="flex-1" />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Content */}
          <motion.div
            variants={variants.slideInLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}>
            
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {isNL ? "Onderhoud & bescherming" : "Care & protection"}
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-8 max-w-md">
              {isNL ?
              "Natuursteen vraagt weinig onderhoud. Met de juiste bescherming en eenvoudige verzorging blijft uw stuk jarenlang mooi." :
              "Natural stone requires little maintenance. With proper protection and simple care, your piece stays beautiful for years."}
            </p>
            
            {/* Care tips - 3 bullets */}
            <div className="space-y-0 border-t border-foreground/8 mb-8">
              {careTips.map((tip) =>
              <div key={tip.number} className="py-4 border-b border-foreground/8 flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 w-5">
                    {tip.number}
                  </span>
                  <span className="text-body-md text-foreground">{tip.text}</span>
                </div>
              )}
            </div>
            
            {/* Text link only - not counted as CTA */}
            <Link
              to="/care"
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground/70 transition-colors group">
              
              {isNL ? 'Lees meer over onderhoud' : 'Read more about care'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          
          {/* Right: Visual */}
          <motion.div
            className="relative hidden lg:block"
            variants={variants.slideInRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}>
            
            <div className="aspect-[4/3] bg-gradient-to-br from-background to-secondary/50 border border-foreground/5 flex items-center justify-center">
              <div className="text-center p-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 block mb-3">
                  {isNL ? 'ADVIES OP MAAT' : 'TAILORED ADVICE'}
                </span>
                <p className="font-serif text-xl text-foreground/80">
                  {isNL ? 'Wij adviseren wat past bij uw gebruik' : 'We advise what suits your usage'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}

// ============================================
// FINAL CTA SECTION - "Neem contact op" only
// ============================================
function FinalCTASection({ isNL }: {isNL: boolean;}) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section id="contact" className="py-20 lg:py-28 bg-foreground text-background" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          className="max-w-xl mx-auto text-center"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}>
          
          <h2 className="font-serif text-display-sm text-background mb-4">
            {isNL ? "Klaar om te beginnen?" : "Ready to begin?"}
          </h2>
          <p className="text-background/70 text-body-md mb-8">
            {isNL ?
            "Plan een vrijblijvend gesprek. Wij reageren snel." :
            "Schedule a no-obligation conversation. We respond quickly."}
          </p>
          <Button asChild variant="sera-primary" size="default" className="bg-background text-foreground hover:bg-background/95 h-12 px-8">
            <Link to="/atelier">
              {isNL ? "Ontwerp uw tafel" : "Design your table"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-4">
            <Link to="/contact" className="text-background/60 hover:text-background text-sm underline underline-offset-4 transition-colors">
              {isNL ? "Of neem contact op" : "Or get in touch"}
            </Link>
          </p>
        </motion.div>
      </div>
    </section>);

}

// ============================================
// STICKY MOBILE CTA
// ============================================
function StickyMobileCTA({ isNL }: {isNL: boolean;}) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMobile) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 lg:hidden"
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}>
      
      <Button asChild variant="sera-primary" size="lg" className="w-full">
        <Link to="/atelier">
          {isNL ? 'Ontwerp uw tafel' : 'Design your table'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </motion.div>);

}

export default Index;