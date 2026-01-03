import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionBand, SectionHeader } from "@/components/ui/section-band";
import { PremiumFeatureCards, FeatureCard } from "@/components/ui/premium-feature-cards";
import { Gem, Eye, MapPin, Clock, Minimize2, Users } from "lucide-react";

const About = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const seoTitle = isNL 
    ? "Over SERA NORR | Online Atelier voor Maatwerk Natuursteenmeubels"
    : "About SERA NORR | Online Atelier for Bespoke Natural Stone Furniture";

  const seoDescription = isNL
    ? "SERA NORR is een online atelier voor sculpturale meubels in natuursteen. Ontworpen in Nederland uit travertin, Calacatta Viola en andere geselecteerde steensoorten."
    : "SERA NORR is an online atelier for sculptural natural stone furniture. Designed in the Netherlands from travertine, Calacatta Viola and other selected stones.";

  // About page schema
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://sera-norr.com/about/#page',
    name: isNL ? 'Over SERA NORR' : 'About SERA NORR',
    description: seoDescription,
    url: 'https://sera-norr.com/about',
    mainEntity: {
      '@id': 'https://sera-norr.com/#organization',
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Over Ons' : 'About', url: '/about' },
  ]);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [aboutPageSchema, breadcrumbSchema],
  };

  const valueCards: FeatureCard[] = isNL ? [
    {
      icon: Gem,
      title: "Materiaal Obsessie",
      description: "We zoeken 's werelds zeldzaamste stenen, maanden besteedend aan het vinden van de perfecte plaat.",
    },
    {
      icon: Eye,
      title: "Sculpturale Intentie", 
      description: "Elk stuk bestaat op het snijvlak van meubilair en kunstobject. We beschouwen negatieve ruimte even zorgvuldig als vorm.",
    },
    {
      icon: MapPin,
      title: "Ontworpen in Nederland",
      description: "Elk ontwerp ontstaat in onze Nederlandse studio. Met oog voor detail werken we samen met ambachtslieden wereldwijd.",
    },
    {
      icon: Clock,
      title: "Permanentie",
      description: "We creëren objecten bedoeld om generaties mee te gaan. Stukken die worden geërfd, niet weggegooid.",
    },
    {
      icon: Minimize2,
      title: "Ingetogenheid",
      description: "Ware luxe ligt in wat wordt weggelaten. We ontwerpen met bewuste terughoudendheid.",
    },
    {
      icon: Users,
      title: "Samenwerking",
      description: "De meest betekenisvolle stukken ontstaan uit dialoog—tussen materiaal en maker, tussen atelier en klant.",
    },
  ] : [
    {
      icon: Gem,
      title: "Material Obsession",
      description: "We source only exceptional materials—stones quarried in limited quantities, chosen for their unique character.",
    },
    {
      icon: Eye,
      title: "Sculptural Intent",
      description: "Our furniture is designed to command space, to create moments of pause. We consider negative space as carefully as form.",
    },
    {
      icon: MapPin,
      title: "Designed in the Netherlands",
      description: "Every design originates from our Dutch studio. With attention to detail, we collaborate with artisans worldwide.",
    },
    {
      icon: Clock,
      title: "Permanence",
      description: "We create objects meant to last generations. Pieces that will be inherited, not discarded.",
    },
    {
      icon: Minimize2,
      title: "Restraint",
      description: "True luxury lies in what is left out. We design with deliberate restraint, eliminating the unnecessary.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "The most meaningful pieces emerge from dialogue—between material and maker, between atelier and client.",
    },
  ];

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

      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8" />
          
          <header className="max-w-4xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              {isNL ? 'Over het Atelier' : 'About the Atelier'}
            </p>
            <h1 className="font-serif text-display-lg text-foreground mb-8">
              {isNL ? 'Vorm Volgt Materiaal' : 'Form Follows Material'}
            </h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed max-w-2xl">
              {isNL 
                ? 'Sera Norr is een maatwerk atelier gewijd aan het sculpturale potentieel van natuursteen. We creëren objecten die bestaan op het snijvlak van architectuur, kunst en functie.'
                : 'Sera Norr is a bespoke furniture atelier dedicated to the sculptural potential of natural stone. We create objects that exist at the intersection of architecture, art, and function.'}
            </p>
          </header>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-8">
                {isNL 
                  ? 'Objecten gevormd door materiaal, proportie en stilte.'
                  : 'Objects shaped by material, proportion, and silence.'}
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-muted-foreground text-body-md leading-relaxed">
                {isNL
                  ? 'Wij geloven dat meubels meer moeten zijn dan functioneel—ze moeten betekenisvol zijn. Elk Sera Norr stuk begint met steen: zijn gewicht, zijn geschiedenis, zijn unieke karakter. We leggen geen vormen op aan onze materialen. In plaats daarvan luisteren we ernaar, laten hun natuurlijke eigenschappen onze handen leiden.'
                  : 'We believe furniture should be more than functional—it should be meaningful. Each Sera Norr piece begins with stone: its weight, its history, its unique character. We do not impose forms upon our materials. Instead, we listen to them, allowing their natural qualities to guide our hands.'}
              </p>
              <p className="text-muted-foreground text-body-md leading-relaxed">
                {isNL
                  ? 'Onze naam verwijst naar het noordelijke licht—de zachte, diffuse kwaliteit die waarheid onthult in oppervlakken. Zoals dat licht zoeken wij de inherente schoonheid van zeldzame materialen te verlichten, stukken creërend die mooier worden met tijd en gebruik.'
                  : 'Our name draws from the northern light—the soft, diffused quality that reveals truth in surfaces. Like that light, we seek to illuminate the inherent beauty of rare materials, creating pieces that grow more beautiful with time and use.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Premium Feature Cards */}
      <SectionBand variant="default" size="lg">
        <SectionHeader
          eyebrow={isNL ? 'Onze Waarden' : 'Our Values'}
          title={isNL ? 'Principes van Praktijk' : 'Principles of Practice'}
        />
        
        <PremiumFeatureCards cards={valueCards} columns={3} />
      </SectionBand>

      {/* Studio */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/60 mb-6">
              {isNL ? 'De Studio' : 'The Studio'}
            </p>
            <h2 className="font-serif text-display-sm mb-8">
              {isNL ? 'Online Atelier' : 'Online Atelier'}
            </h2>
            <p className="text-background/80 text-body-lg leading-relaxed mb-12">
              {isNL
                ? 'SERA NORR is een online atelier—onze creatieve ruimte waar zeldzame materialen worden getransformeerd tot objecten van permanentie. Via persoonlijke begeleiding op afstand begeleiden we u door elk stap van het ontwerpproces.'
                : 'SERA NORR is an online atelier—our creative space where rare materials are transformed into objects of permanence. Through personal remote guidance, we walk you through every step of the design process.'}
            </p>
            <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
              <Link to="/bespoke">{isNL ? 'Start uw traject' : 'Start your journey'}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
