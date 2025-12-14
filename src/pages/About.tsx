import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const About = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const seoTitle = isNL 
    ? "Over SERA NORR | Stenen Meubels Atelier Amsterdam"
    : "About SERA NORR | Stone Furniture Atelier Amsterdam";

  const seoDescription = isNL
    ? "SERA NORR is een maatwerk atelier voor sculpturale stenen meubels. Ontworpen in Nederland uit travertin, Calacatta Viola en andere zeldzame steensoorten."
    : "SERA NORR is a bespoke atelier for sculptural stone furniture. Designed in the Netherlands from travertine, Calacatta Viola and other rare stones.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Over Ons' : 'About', url: '/about' },
  ]);

  const values = isNL ? [
    {
      title: "Materiaal Obsessie",
      description: "We zoeken 's werelds zeldzaamste stenen, maanden besteedend aan het vinden van de perfecte plaat. Elk blok travertin, elke Calacatta Viola plaat wordt persoonlijk geselecteerd.",
    },
    {
      title: "Sculpturale Intentie", 
      description: "Elk stuk bestaat op het snijvlak van meubilair en kunstobject. We beschouwen negatieve ruimte even zorgvuldig als vorm, zodat elk stuk ademt binnen zijn omgeving.",
    },
    {
      title: "Ontworpen in Nederland",
      description: "Elk ontwerp ontstaat in onze Nederlandse studio. Met oog voor detail en vakkennis werken we samen met ambachtslieden wereldwijd.",
    },
    {
      title: "Permanentie",
      description: "We creëren objecten bedoeld om generaties mee te gaan. In een tijdperk van wegwerpbaarheid geloven we in dingen die blijven—stukken die worden geërfd, niet weggegooid.",
    },
    {
      title: "Ingetogenheid",
      description: "Ware luxe ligt in wat wordt weggelaten. We ontwerpen met bewuste terughoudendheid, het onnodige eliminerend om het essentiële te onthullen.",
    },
    {
      title: "Samenwerking",
      description: "De meest betekenisvolle stukken ontstaan uit dialoog—tussen materiaal en maker, tussen atelier en klant. Uw visie is het startpunt voor iets buitengewoons.",
    },
  ] : [
    {
      title: "Material Obsession",
      description: "We source only exceptional materials—stones quarried in limited quantities, chosen for their unique character. Every piece of Calacatta Viola, every block of travertine, is personally selected.",
    },
    {
      title: "Sculptural Intent",
      description: "Our furniture is designed to command space, to create moments of pause. We consider negative space as carefully as form, allowing each piece to breathe within its environment.",
    },
    {
      title: "Designed in the Netherlands",
      description: "Every design originates from our Dutch studio. With attention to detail and expertise, we collaborate with artisans worldwide.",
    },
    {
      title: "Permanence",
      description: "We create objects meant to last generations. In an age of disposability, we believe in the quiet revolution of making things that endure—pieces that will be inherited, not discarded.",
    },
    {
      title: "Restraint",
      description: "True luxury lies in what is left out. We design with deliberate restraint, eliminating the unnecessary to reveal the essential.",
    },
    {
      title: "Collaboration",
      description: "The most meaningful pieces emerge from dialogue—between material and maker, between atelier and client. We welcome your vision as the starting point.",
    },
  ];

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "over SERA NORR, atelier Amsterdam, stenen meubels, Europees vakmanschap, maatwerk" 
          : "about SERA NORR, atelier Amsterdam, stone furniture, European craftsmanship, bespoke"}
        structuredData={breadcrumbSchema}
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

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {isNL ? 'Onze Waarden' : 'Our Values'}
            </p>
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? 'Principes van Praktijk' : 'Principles of Practice'}
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {values.map((value, index) => (
              <article key={index}>
                <h3 className="font-serif text-2xl text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-body-sm leading-relaxed">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Studio */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/60 mb-6">
              {isNL ? 'De Studio' : 'The Studio'}
            </p>
            <h2 className="font-serif text-display-sm mb-8">
              {isNL ? 'Vervaardigd in Europa' : 'Crafted in Europe'}
            </h2>
            <p className="text-background/80 text-body-lg leading-relaxed mb-12">
              {isNL
                ? 'Ons atelier is zowel werkplaats als toevluchtsoord—een ruimte waar zeldzame materialen worden getransformeerd tot objecten van permanentie. Bezoekers zijn welkom op afspraak om ons vakmanschap van dichtbij te ervaren.'
                : 'Our atelier is both workshop and sanctuary—a space where rare materials are transformed into objects of permanence. Visitors are welcome by appointment to experience our craft firsthand.'}
            </p>
            <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
              <Link to="/contact">{isNL ? 'Maak een Afspraak' : 'Arrange a Visit'}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
