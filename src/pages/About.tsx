import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema, BreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hairline } from "@/components/ui/hairline";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

import atelierImage from "@/assets/about-atelier.jpg";
import heroImage from "@/assets/hero-homepage.png";

const About = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const seoTitle = isNL
    ? "Over Sera Norr | Laurens Soedito & Ls Capital"
    : "About Sera Norr | Laurens Soedito & Ls Capital";

  const seoDescription = isNL
    ? "Sera Norr opgericht door Laurens Soedito, managing director Ls Capital. Het verhaal achter het atelier."
    : "Sera Norr founded by Laurens Soedito, managing director of Ls Capital. The story behind the atelier.";

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://sera-norr.com/over/#page',
    name: isNL ? 'Over SERA NORR' : 'About SERA NORR',
    description: seoDescription,
    url: 'https://sera-norr.com/over',
    mainEntity: { '@id': 'https://sera-norr.com/#organization' },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Over Ons' : 'About', url: '/over' },
  ]);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [aboutPageSchema, breadcrumbSchema],
  };

  return (
    <Layout>
      <BreadcrumbSchema
        items={[
          { name: "SERA NORR", url: "https://sera-norr.com" },
          { name: "Over ons", url: "https://sera-norr.com/over" },
        ]}
      />
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
            loading="eager"
            fetchPriority="high"
            decoding="async"
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
              <p className="font-serif text-background/85 text-xl lg:text-2xl italic mb-4">
                {isNL ? 'Het verhaal achter Sera Norr.' : 'The story behind Sera Norr.'}
              </p>
              <p className="text-background/70 text-body-lg max-w-lg">
                {isNL 
                  ? 'Een maatwerk atelier gewijd aan het sculpturale potentieel van natuursteen.'
                  : 'A bespoke atelier dedicated to the sculptural potential of natural stone.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section heading: identifies this as the Over page */}
      <section className="pt-20 lg:pt-28 pb-2">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">
              {isNL ? 'Het Atelier' : 'The Atelier'}
            </p>
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground">
              {isNL ? 'Wie wij zijn' : 'Who we are'}
            </h2>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <FounderStorySection isNL={isNL} />

      {/* Founder's Guarantee - 3 columns */}
      <GuaranteeSection isNL={isNL} />

      {/* Info blocks: Selectie / Maatwerk / Nazorg */}
      <InfoBlocksSection isNL={isNL} />

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

function FounderStorySection({ isNL }: { isNL: boolean }) {
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
            <span className="micro-label shrink-0">{isNL ? 'Het verhaal' : 'The story'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-display-sm text-foreground leading-tight">
                {isNL 
                  ? 'Een tafel is geen meubel. Het is het middelpunt van een leven.'
                  : 'A table is not furniture. It is the centre of a life.'}
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'SERA NORR is ontstaan uit een eenvoudige overtuiging: een tafel is geen meubel, maar het middelpunt van een leven. Elke steen die wij selecteren wordt met de hand gekozen in de Italiaanse en Spaanse groeven. Elk stuk draagt de signatuur van de aarde zelf.'
                  : 'SERA NORR was born from a simple conviction: a table is not furniture, but the centre of a life. Every stone we select is chosen by hand in the Italian and Spanish quarries. Each piece carries the signature of the earth itself.'}
              </p>
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'We werken uitsluitend op aanvraag. Geen voorraad, geen compromissen. Elke tafel wordt gemaakt voor één persoon, in één ruimte, voor een leven lang.'
                  : 'We work exclusively to order. No stock, no compromises. Every table is made for one person, in one room, for a lifetime.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GuaranteeSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  const items = isNL ? [
    { title: 'Atelier Garantie', description: '2 jaar garantie op vakmanschap en constructie. Elk stuk wordt vóór levering door ons atelier eindgekeurd.' },
    { title: 'Levenslang Advies', description: 'Wij blijven bereikbaar voor vragen over onderhoud, verplaatsing of restauratie. Voor altijd, zonder einddatum.' },
    { title: 'Echtheidsverklaring', description: 'Elk stuk wordt geleverd met een certificaat van herkomst: groeve, slabnummer en signatuur van de meester-steenzetter.' },
  ] : [
    { title: 'Atelier Guarantee', description: '2-year guarantee on craftsmanship and construction. Every piece passes a final atelier inspection before delivery.' },
    { title: 'Lifetime Advice', description: 'We remain reachable for questions on care, relocation or restoration. Forever, with no end date.' },
    { title: 'Certificate of Authenticity', description: 'Each piece is delivered with a certificate of origin: quarry, slab number and signature of the master stonemason.' },
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
            <span className="micro-label shrink-0">{isNL ? "Founder's Guarantee" : "Founder's Guarantee"}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? 'Drie beloftes, voor altijd' : 'Three promises, forever'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
            {items.map((value, index) => (
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

function InfoBlocksSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  const blocks = isNL ? [
    {
      label: 'Selectie',
      title: 'Hoe wij stenen kiezen',
      description: 'Wij bezoeken groeven in Italië en Spanje persoonlijk. Elke slab wordt beoordeeld op aderpatroon, kleurdiepte en structurele integriteit. Slechts één op de tien slabs haalt het atelier.',
      tone: 'beige',
    },
    {
      label: 'Maatwerk',
      title: 'Het proces van aanvraag tot levering',
      description: 'Na uw aanvraag volgt een persoonlijk gesprek, een dossier met slab-foto\'s en een definitief ontwerp. Productie 12–16 weken. White-glove levering en plaatsing in Nederland en België.',
      tone: 'stone',
    },
    {
      label: 'Nazorg',
      title: 'Levenslange begeleiding',
      description: 'Onderhoudskit bij levering, jaarlijkse digitale check-in en een levenslange lijn voor advies. Restauratie of herplaatsing — wij blijven uw aanspreekpunt.',
      tone: 'graphite',
    },
  ] : [
    {
      label: 'Selection',
      title: 'How we choose stone',
      description: 'We visit quarries in Italy and Spain in person. Every slab is assessed on veining, depth of colour and structural integrity. Only one in ten slabs reaches the atelier.',
      tone: 'beige',
    },
    {
      label: 'Bespoke',
      title: 'From request to delivery',
      description: 'Following your request: a personal conversation, a dossier with slab photographs and a final design. Production 12–16 weeks. White-glove delivery and placement in the Netherlands and Belgium.',
      tone: 'stone',
    },
    {
      label: 'Aftercare',
      title: 'Lifetime guidance',
      description: 'A care kit at delivery, an annual digital check-in and a lifetime line for advice. Restoration or relocation — we remain your point of contact.',
      tone: 'graphite',
    },
  ];

  const toneClass: Record<string, string> = {
    beige: 'bg-[hsl(35_25%_82%)]',
    stone: 'bg-[hsl(30_8%_62%)]',
    graphite: 'bg-[hsl(220_6%_28%)]',
  };

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
            <span className="micro-label shrink-0">{isNL ? 'Werkwijze' : 'How we work'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {blocks.map((b) => (
              <article key={b.label} className="border border-foreground/10 bg-background overflow-hidden flex flex-col">
                <div className={`${toneClass[b.tone]} aspect-[4/3]`} aria-hidden />
                <div className="p-8 lg:p-10 flex-1 flex flex-col">
                  <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {b.label}
                  </span>
                  <h3 className="font-serif text-xl text-foreground mt-3 mb-3">
                    {b.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
