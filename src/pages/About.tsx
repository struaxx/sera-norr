import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hairline } from "@/components/ui/hairline";
import { ProofGrid } from "@/components/ui/proof-grid";

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

  const values = isNL ? [
    { title: 'Materiaal Obsessie', description: "We zoeken 's werelds zeldzaamste stenen, maanden besteedend aan het vinden van de perfecte plaat." },
    { title: 'Sculpturale Intentie', description: 'Elk stuk bestaat op het snijvlak van meubilair en kunstobject. We beschouwen negatieve ruimte even zorgvuldig als vorm.' },
    { title: 'Ontworpen in Nederland', description: 'Elk ontwerp ontstaat in onze Nederlandse studio. Met oog voor detail werken we samen met ambachtslieden wereldwijd.' },
    { title: 'Permanentie', description: 'We creëren objecten bedoeld om generaties mee te gaan. Stukken die worden geërfd, niet weggegooid.' },
    { title: 'Ingetogenheid', description: 'Ware luxe ligt in wat wordt weggelaten. We ontwerpen met bewuste terughoudendheid.' },
    { title: 'Samenwerking', description: 'De meest betekenisvolle stukken ontstaan uit dialoog—tussen materiaal en maker, tussen atelier en klant.' },
  ] : [
    { title: 'Material Obsession', description: "We source only exceptional materials—stones quarried in limited quantities, chosen for their unique character." },
    { title: 'Sculptural Intent', description: 'Our furniture is designed to command space, to create moments of pause. We consider negative space as carefully as form.' },
    { title: 'Designed in the Netherlands', description: 'Every design originates from our Dutch studio. With attention to detail, we collaborate with artisans worldwide.' },
    { title: 'Permanence', description: 'We create objects meant to last generations. Pieces that will be inherited, not discarded.' },
    { title: 'Restraint', description: 'True luxury lies in what is left out. We design with deliberate restraint, eliminating the unnecessary.' },
    { title: 'Collaboration', description: 'The most meaningful pieces emerge from dialogue—between material and maker, between atelier and client.' },
  ];

  const proofItems = isNL ? [
    { title: '5 jaar garantie', description: 'Op constructie en materiaal.' },
    { title: 'White-glove levering', description: 'Plaatsing op locatie in NL/BE.' },
    { title: 'Ontworpen in Nederland', description: 'Elk stuk uniek en op maat.' },
  ] : [
    { title: '5 year warranty', description: 'On construction and materials.' },
    { title: 'White-glove delivery', description: 'Installation on location in NL/BE.' },
    { title: 'Designed in Netherlands', description: 'Each piece unique and bespoke.' },
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
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8 opacity-60 text-[10px]" />
          
          <div className="max-w-3xl">
            <p className="micro-label mb-6">
              {isNL ? 'Over het Atelier' : 'About the Atelier'}
            </p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {isNL ? 'Vorm Volgt Materiaal' : 'Form Follows Material'}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl">
              {isNL 
                ? 'Sera Norr is een maatwerk atelier gewijd aan het sculpturale potentieel van natuursteen. We creëren objecten die bestaan op het snijvlak van architectuur, kunst en functie.'
                : 'Sera Norr is a bespoke furniture atelier dedicated to the sculptural potential of natural stone. We create objects that exist at the intersection of architecture, art, and function.'}
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy - Editorial Split */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Filosofie' : 'Philosophy'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-display-sm text-foreground">
                {isNL 
                  ? 'Objecten gevormd door materiaal, proportie en stilte.'
                  : 'Objects shaped by material, proportion, and silence.'}
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'Wij geloven dat meubels meer moeten zijn dan functioneel—ze moeten betekenisvol zijn. Elk Sera Norr stuk begint met steen: zijn gewicht, zijn geschiedenis, zijn unieke karakter. We leggen geen vormen op aan onze materialen. In plaats daarvan luisteren we ernaar, laten hun natuurlijke eigenschappen onze handen leiden.'
                  : 'We believe furniture should be more than functional—it should be meaningful. Each Sera Norr piece begins with stone: its weight, its history, its unique character. We do not impose forms upon our materials. Instead, we listen to them, allowing their natural qualities to guide our hands.'}
              </p>
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'Onze naam verwijst naar het noordelijke licht—de zachte, diffuse kwaliteit die waarheid onthult in oppervlakken. Zoals dat licht zoeken wij de inherente schoonheid van zeldzame materialen te verlichten, stukken creërend die mooier worden met tijd en gebruik.'
                  : 'Our name draws from the northern light—the soft, diffused quality that reveals truth in surfaces. Like that light, we seek to illuminate the inherent beauty of rare materials, creating pieces that grow more beautiful with time and use.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Editorial Grid */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Onze Waarden' : 'Our Values'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? 'Principes van Praktijk' : 'Principles of Practice'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <div key={index} className="relative">
                <span className="font-serif text-[60px] lg:text-[80px] text-foreground/[0.03] absolute -top-2 -left-1 leading-none select-none pointer-events-none">
                  0{index + 1}
                </span>
                <div className="relative pt-6 border-t border-foreground/8">
                  <h3 className="font-serif text-lg text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Grid */}
      <section className="py-20 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <ProofGrid items={proofItems} />
          </div>
        </div>
      </section>

      {/* Studio / CTA Band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-background/60 mb-6">
              {isNL ? 'De Studio' : 'The Studio'}
            </p>
            <h2 className="font-serif text-display-sm text-background mb-6">
              Online Atelier
            </h2>
            <p className="text-background/70 text-body-md leading-relaxed mb-10">
              {isNL
                ? 'SERA NORR is een online atelier—onze creatieve ruimte waar zeldzame materialen worden getransformeerd tot objecten van permanentie. Via persoonlijke begeleiding op afstand begeleiden we u door elk stap van het ontwerpproces.'
                : 'SERA NORR is an online atelier—our creative space where rare materials are transformed into objects of permanence. Through personal remote guidance, we walk you through every step of the design process.'}
            </p>
            <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
              <Link to="/bespoke">
                {isNL ? 'Start uw traject' : 'Start your journey'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;