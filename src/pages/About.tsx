import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hairline } from "@/components/ui/hairline";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

import atelierImage from "@/assets/about-atelier.jpg";
import materialsImage from "@/assets/about-materials.jpg";
import heroImage from "@/assets/hero-homepage.png";

const About = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const seoTitle = isNL 
    ? "Over SERA NORR | Online Atelier voor Maatwerk Natuursteenmeubels"
    : "About SERA NORR | Online Atelier for Bespoke Natural Stone Furniture";

  const seoDescription = isNL
    ? "SERA NORR is een online atelier voor sculpturale meubels in natuursteen. Ontworpen in Nederland uit travertin, Calacatta Viola en andere geselecteerde steensoorten."
    : "SERA NORR is an online atelier for sculptural natural stone furniture. Designed in the Netherlands from travertine, Calacatta Viola and other selected stones.";

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://sera-norr.com/about/#page',
    name: isNL ? 'Over SERA NORR' : 'About SERA NORR',
    description: seoDescription,
    url: 'https://sera-norr.com/about',
    mainEntity: { '@id': 'https://sera-norr.com/#organization' },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Over Ons' : 'About', url: '/about' },
  ]);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [aboutPageSchema, breadcrumbSchema],
  };

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "over SERA NORR, online atelier, maatwerk natuursteenmeubels, ontworpen in Nederland, travertin, marmer" 
          : "about SERA NORR, online atelier, bespoke natural stone furniture, designed in the Netherlands, travertine, marble"}
        structuredData={combinedSchema}
      />

      {/* Hero - Full-bleed image with overlay */}
      <section className="relative h-[70vh] lg:h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={atelierImage}
            alt={isNL ? "SERA NORR atelier werkplaats" : "SERA NORR atelier workspace"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-foreground/10" />
        </div>
        <div className="relative z-10 w-full pb-16 lg:pb-24">
          <div className="container mx-auto px-6 lg:px-12">
            <Breadcrumbs className="mb-6 opacity-50 text-[10px] text-background/60" />
            <div className="max-w-2xl">
              <p className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-background/50 mb-4">
                {isNL ? 'Over het Atelier' : 'About the Atelier'}
              </p>
              <h1 className="font-serif text-display-md lg:text-display-lg text-background mb-4">
                {isNL ? 'Vorm volgt materiaal.' : 'Form follows material.'}
              </h1>
              <p className="text-background/70 text-body-lg max-w-lg">
                {isNL 
                  ? 'Een maatwerk atelier gewijd aan het sculpturale potentieel van natuursteen.'
                  : 'A bespoke atelier dedicated to the sculptural potential of natural stone.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story - Editorial Split */}
      <OriginSection isNL={isNL} />

      {/* Material Philosophy - Image + Text */}
      <MaterialSection isNL={isNL} />

      {/* Values - Numbered Grid */}
      <ValuesSection isNL={isNL} />

      {/* Process - How We Work */}
      <ProcessSection isNL={isNL} />

      {/* CTA Band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-background/60 mb-6">
              {isNL ? 'Begin hier' : 'Start here'}
            </p>
            <h2 className="font-serif text-display-sm text-background mb-6">
              {isNL ? 'Ontwerp uw stuk' : 'Design your piece'}
            </h2>
            <p className="text-background/70 text-body-md leading-relaxed mb-10 max-w-md mx-auto">
              {isNL
                ? 'Configureer uw tafel in ons digitaal atelier. Kies materiaal, afmetingen en afwerking—wij doen de rest.'
                : 'Configure your table in our digital atelier. Choose material, dimensions and finish—we handle the rest.'}
            </p>
            <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
              <Link to="/atelier">
                {isNL ? 'Ontwerp uw tafel' : 'Design your table'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

function OriginSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Oorsprong' : 'Origin'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-display-sm text-foreground leading-tight">
                {isNL 
                  ? 'Objecten gevormd door materiaal, proportie en stilte.'
                  : 'Objects shaped by material, proportion, and silence.'}
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'SERA NORR ontstond vanuit een eenvoudige overtuiging: meubels moeten meer zijn dan functioneel. Elk stuk begint bij de steen—zijn gewicht, zijn geschiedenis, zijn karakter. We leggen geen vormen op. We luisteren naar het materiaal.'
                  : 'SERA NORR was born from a simple conviction: furniture should be more than functional. Each piece begins with stone—its weight, its history, its character. We don\'t impose forms. We listen to the material.'}
              </p>
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'Onze naam verwijst naar het noordelijke licht—de zachte, diffuse kwaliteit die waarheid onthult in oppervlakken. Zoals dat licht zoeken wij de inherente schoonheid van zeldzame materialen te verlichten.'
                  : 'Our name draws from the northern light—the soft, diffused quality that reveals truth in surfaces. Like that light, we seek to illuminate the inherent beauty of rare materials.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MaterialSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section className="bg-secondary/20" ref={ref}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-[4/5] lg:aspect-auto overflow-hidden">
          <motion.img
            src={materialsImage}
            alt={isNL ? "Travertin en marmer samples" : "Travertine and marble samples"}
            className="w-full h-full object-cover"
            variants={variants.fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />
        </div>
        
        {/* Text */}
        <motion.div 
          className="flex items-center py-16 lg:py-24 px-6 lg:px-16 xl:px-24"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="max-w-md">
            <p className="micro-label mb-6">
              {isNL ? 'Materiaal' : 'Material'}
            </p>
            <h2 className="font-serif text-display-sm text-foreground mb-6">
              {isNL ? 'Geselecteerd, niet gesourced.' : 'Selected, not sourced.'}
            </h2>
            <div className="space-y-5">
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'We werken uitsluitend met travertin en marmer. Twee materialen, zorgvuldig geselecteerd op kleur, textuur en structurele integriteit.'
                  : 'We work exclusively with travertine and marble. Two materials, carefully selected for colour, texture and structural integrity.'}
              </p>
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'Elke plaat wordt beoordeeld voordat deze het atelier binnenkomt. We zoeken niet naar perfectie—we zoeken naar karakter.'
                  : 'Every slab is assessed before entering the atelier. We don\'t look for perfection—we look for character.'}
              </p>
            </div>
            <Hairline className="my-8" />
            <div className="flex gap-12">
              <div>
                <p className="font-serif text-2xl text-foreground">30+</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mt-1">
                  {isNL ? 'Steensoorten' : 'Stone types'}
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-foreground">2</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mt-1">
                  {isNL ? 'Collecties' : 'Collections'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValuesSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  const values = isNL ? [
    { title: 'Sculpturale intentie', description: 'Elk stuk bestaat op het snijvlak van meubel en object. We beschouwen negatieve ruimte even zorgvuldig als vorm.' },
    { title: 'Ontworpen in Nederland', description: 'Elk ontwerp ontstaat in onze Nederlandse studio, in samenwerking met ambachtslieden wereldwijd.' },
    { title: 'Permanentie', description: 'We creëren objecten bedoeld om generaties mee te gaan. Stukken die worden geërfd, niet vervangen.' },
    { title: 'Ingetogenheid', description: 'Ware luxe ligt in wat wordt weggelaten. We ontwerpen met bewuste terughoudendheid.' },
  ] : [
    { title: 'Sculptural intent', description: 'Each piece exists at the intersection of furniture and object. We consider negative space as carefully as form.' },
    { title: 'Designed in the Netherlands', description: 'Every design originates in our Dutch studio, collaborating with artisans worldwide.' },
    { title: 'Permanence', description: 'We create objects meant to last generations. Pieces that will be inherited, not replaced.' },
    { title: 'Restraint', description: 'True luxury lies in what is left out. We design with deliberate restraint.' },
  ];

  return (
    <section className="py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Waarden' : 'Values'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/8">
            {values.map((value, index) => (
              <div key={index} className="bg-background p-8 lg:p-12">
                <span className="font-serif text-[48px] lg:text-[64px] text-foreground/[0.04] leading-none block mb-4">
                  0{index + 1}
                </span>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  const steps = isNL ? [
    { label: '01', title: 'Configureer', description: 'Kies vorm, materiaal, afmetingen en afwerking in ons digitaal atelier.' },
    { label: '02', title: 'Persoonlijk voorstel', description: 'Wij bevestigen uw keuzes en presenteren een voorstel binnen 48 uur.' },
    { label: '03', title: 'Vervaardiging', description: 'Uw stuk wordt met de hand gemaakt door gespecialiseerde ambachtslieden. Levertijd: 12–16 weken.' },
    { label: '04', title: 'White-glove levering', description: 'Bezorgd en geplaatst op locatie in Nederland en België.' },
  ] : [
    { label: '01', title: 'Configure', description: 'Choose shape, material, dimensions and finish in our digital atelier.' },
    { label: '02', title: 'Personal proposal', description: 'We confirm your choices and present a proposal within 48 hours.' },
    { label: '03', title: 'Craftsmanship', description: 'Your piece is handcrafted by specialised artisans. Lead time: 12–16 weeks.' },
    { label: '04', title: 'White-glove delivery', description: 'Delivered and placed on location in the Netherlands and Belgium.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-secondary/20" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Werkwijze' : 'Process'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? 'Van ontwerp tot plaatsing' : 'From design to placement'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step) => (
              <div key={step.label} className="relative">
                <div className="border-t border-foreground/10 pt-6">
                  <span className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    {step.label}
                  </span>
                  <h3 className="font-serif text-lg text-foreground mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
