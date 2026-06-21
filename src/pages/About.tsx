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

const About = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const seoTitle = isNL
    ? "Over Sera Norr | Atelier voor natuursteen meubels op maat"
    : "About Sera Norr | Atelier for bespoke natural stone furniture";

  const seoDescription = isNL
    ? "Sera Norr is een atelier voor maatwerk meubels in natuursteen. Eén materiaal, volle aandacht, sculpturale stukken die generaties meegaan."
    : "Sera Norr is an atelier for bespoke natural stone furniture. One material, full attention, sculptural pieces that last for generations.";

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
                {isNL ? 'Over het atelier' : 'About the atelier'}
              </p>
              <h1 className="font-serif text-display-md lg:text-display-lg text-background mb-4">
                {isNL ? 'Vorm volgt materiaal.' : 'Form follows material.'}
              </h1>
              <p className="font-serif text-background/85 text-xl lg:text-2xl italic mb-4">
                {isNL ? 'Het verhaal achter Sera Norr.' : 'The story behind Sera Norr.'}
              </p>
              <p className="text-background/70 text-body-lg max-w-lg">
                {isNL 
                  ? 'Sera Norr is een atelier voor maatwerk meubels in natuursteen, opgezet vanuit jarenlange ervaring in de interieurbouw. Een eigen tak met focus op één materiaal: de zeldzame, langzame schoonheid van natuursteen.'
                  : 'Sera Norr is an atelier for bespoke natural stone furniture, built on years of experience in interior craftsmanship. A dedicated practice focused on one material: the rare, slow beauty of natural stone.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <FounderStorySection isNL={isNL} />

      {/* Over de oprichter */}
      <FounderProfileSection isNL={isNL} />

      {/* Onze belofte - 2 kaarten */}
      <GuaranteeSection isNL={isNL} />

      {/* Persoonlijke garantie */}
      <PersonalGuaranteeSection isNL={isNL} />

      {/* Hoe wij werken - 4 blokken */}
      <InfoBlocksSection isNL={isNL} />

      {/* Waar wij vandaan komen */}
      <OriginSection isNL={isNL} />

      {/* CTA Band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-background/60 mb-6">
              {isNL ? 'Begin hier' : 'Start here'}
            </p>
            <h2 className="font-serif text-display-sm text-background mb-6">
              {isNL ? 'Klaar om te beginnen?' : 'Ready to begin?'}
            </h2>
            <p className="text-background/70 text-body-md leading-relaxed mb-10 max-w-md mx-auto">
              {isNL
                ? 'Bekijk het lookbook voor inspiratie of start direct in het atelier om uw eigen tafel te ontwerpen.'
                : 'Browse the lookbook for inspiration, or start directly in the atelier to design your own table.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
                <Link to="/atelier">
                  {isNL ? 'Ontwerp uw tafel' : 'Design your table'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-background/40 text-background hover:bg-background/10 hover:text-background">
                <Link to="/collections">
                  {isNL ? 'Lookbook bekijken' : 'View lookbook'}
                </Link>
              </Button>
            </div>
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
                {isNL ? 'Waarom een eigen merk' : 'Why an own brand'}
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'Onze achtergrond ligt in maatwerk interieurs en keukens, een vak waarin natuursteen vaak een bijrol speelt. Met Sera Norr zetten we die rol om naar hoofdrol. Eén materiaal, volle aandacht, sculpturale meubels die generaties meegaan.'
                  : 'Our background lies in bespoke interiors and kitchens, a craft in which natural stone often plays a supporting role. With Sera Norr we move that role to the centre. One material, full attention, sculptural furniture that lasts for generations.'}
              </p>
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'Natuursteen is geen accessoire. Het is een levend materiaal met eigen wetten, herkomst en karakter. Dat verdient een eigen atelier, een eigen taal, en een proces dat is gebouwd rond de steen zelf.'
                  : 'Natural stone is not an accessory. It is a living material with its own laws, origin and character. That deserves its own atelier, its own language, and a process built around the stone itself.'}
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
    { title: 'Garantie', description: 'Twee jaar garantie op vakmanschap en constructie conform Nederlands consumentenrecht. Elk stuk wordt vóór levering door ons gecontroleerd op afwerking en maatvoering.' },
    { title: 'Levenslang advies', description: 'Wij blijven bereikbaar voor vragen over onderhoud, verplaatsing of restauratie. Zonder einddatum, ook na de garantieperiode.' },
  ] : [
    { title: 'Warranty', description: 'Two-year warranty on craftsmanship and construction under Dutch consumer law. Every piece is checked by us for finish and dimensions before delivery.' },
    { title: 'Lifetime advice', description: 'We remain reachable for questions on care, relocation or restoration. With no end date, also after the warranty period.' },
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
            <span className="micro-label shrink-0">{isNL ? 'Onze belofte' : 'Our promise'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? 'Twee beloftes, voor altijd' : 'Two promises, forever'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 max-w-4xl mx-auto">
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
      label: 'Herkomst',
      title: 'Waar onze steen vandaan komt',
      description: 'Onze steen komt uit de groeven die wereldwijd bekend staan om hun kwaliteit en karakter. Italiaans marmer uit Carrara en de Apuaanse Alpen, travertijn uit Italië en Turkije, kwartsiet uit Brazilië. Per project selecteren wij slabs op tekening, kleur en passend bij uw ontwerp. Geen voorraadsteen, geen toevalstreffer.',
      image: undefined as string | undefined,
    },
    {
      label: 'Productie',
      title: 'Vervaardigd in een vast atelier',
      description: 'Onze meubels worden vervaardigd in een gespecialiseerd steenatelier waarmee wij langdurig samenwerken. Een vaste partner, met ervaren steenhouwers en moderne techniek, die werkt volgens onze specificaties en kwaliteitsnormen.',
      image: undefined as string | undefined,
    },
    {
      label: 'Montage',
      title: 'White-glove levering en plaatsing',
      description: 'Levering en plaatsing verzorgen wij via een gespecialiseerde white-glove partner. Verzekerd transport, voorzichtige plaatsing op locatie, alle verpakking wordt direct meegenomen. Bij grotere of complexere installaties zijn wij zelf aanwezig.',
      image: undefined as string | undefined,
    },
    {
      label: 'Contact',
      title: 'Eén aanspreekpunt',
      description: 'Korte lijnen. U heeft één aanspreekpunt vanaf eerste vraag tot na oplevering.',
      image: undefined as string | undefined,
    },
  ] : [
    {
      label: 'Origin',
      title: 'Where our stone comes from',
      description: 'Our stone comes from quarries known worldwide for their quality and character. Italian marble from Carrara and the Apuan Alps, travertine from Italy and Turkey, quartzite from Brazil. For each project we select slabs on figure, colour and fit with your design. No stock stone, no coincidence.',
      image: undefined as string | undefined,
    },
    {
      label: 'Production',
      title: 'Made in a dedicated atelier',
      description: 'Our furniture is made in a specialised stone atelier with whom we have a long-term partnership. A fixed partner, with experienced stonemasons and modern technique, working to our specifications and quality standards.',
      image: undefined as string | undefined,
    },
    {
      label: 'Delivery',
      title: 'White-glove delivery and placement',
      description: 'Delivery and placement are handled by a specialised white-glove partner. Insured transport, careful placement on site, all packaging removed immediately. For larger or more complex installations we are present ourselves.',
      image: undefined as string | undefined,
    },
    {
      label: 'Contact',
      title: 'One point of contact',
      description: 'Short lines. You have one point of contact from first question through to after delivery.',
      image: undefined as string | undefined,
    },
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
            <span className="micro-label shrink-0">{isNL ? 'Werkwijze' : 'How we work'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mb-16">
            <h2 className="font-serif text-display-sm text-foreground leading-tight">
              {isNL ? 'Hoe wij werken' : 'How we work'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {blocks.map((b) => (
              <article key={b.label} className="border border-foreground/10 bg-background overflow-hidden flex flex-col">
                {b.image ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={b.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : null}
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

function OriginSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-secondary/20" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-6 mb-10 lg:mb-12">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">
              {isNL ? 'Vestiging' : 'Based in'}
            </span>
            <Hairline className="flex-1" />
          </div>

          <h2 className="font-serif text-display-sm text-foreground leading-tight mb-6">
            {isNL ? 'Waar wij vandaan komen' : 'Where we come from'}
          </h2>
          <p className="text-body-md text-muted-foreground leading-relaxed">
            {isNL
              ? 'Sera Norr is gevestigd in Amersfoort en onderdeel van Ls Capital (KVK 89004213). Wij ontwerpen en coördineren vanuit Nederland en leveren in heel Europa.'
              : 'Sera Norr is based in Amersfoort and part of Ls Capital, registered with the Dutch Chamber of Commerce (KVK 89004213). We design and coordinate from the Netherlands and deliver throughout Europe.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default About;

function FounderProfileSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 border-t border-foreground/10" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="flex items-center gap-6 mb-10 lg:mb-12">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">
              {isNL ? 'Over de oprichter' : 'About the founder'}
            </span>
            <Hairline className="flex-1" />
          </div>

          <h2 className="font-serif text-display-sm text-foreground leading-tight mb-3">
            {isNL ? 'Wie staat er achter Sera Norr' : 'Who stands behind Sera Norr'}
          </h2>
          <h3 className="font-serif text-3xl md:text-4xl tracking-[-0.01em] text-foreground mb-2 mt-10">
            Laurens Soedito
          </h3>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
            {isNL
              ? 'Oprichter Sera Norr · Managing Director Ls Capital'
              : 'Founder Sera Norr · Managing Director Ls Capital'}
          </p>
          <p className="font-sans text-base text-foreground/80 leading-relaxed mb-5">
            {isNL
              ? 'Via Ls Capital heb ik de afgelopen jaren tientallen high-end interieurbouw-projecten begeleid in Nederland. Ik ken de markt, de leveranciers, en de standaard die premium kopers verwachten. Sera Norr is het logische vervolg: hetzelfde niveau, maar in natuursteen.'
              : 'Through Ls Capital I have guided dozens of high-end interior construction projects in the Netherlands over the past years. I know the market, the suppliers, and the standard that premium buyers expect. Sera Norr is the logical next step: the same level, but in natural stone.'}
          </p>
          <p className="font-sans text-base text-foreground/80 leading-relaxed">
            {isNL
              ? 'Dat betekent dat u niet met een webshop te maken heeft, maar met iemand die uw investering begrijpt en persoonlijk verantwoordelijk is voor het eindresultaat.'
              : 'That means you are not dealing with a webshop, but with someone who understands your investment and is personally responsible for the end result.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function PersonalGuaranteeSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section className="bg-foreground text-background py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="border border-background/20 p-10 md:p-14"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-background/50 mb-6">
            {isNL ? 'Garantie' : 'Guarantee'}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-[-0.01em] text-background mb-8 leading-tight">
            {isNL ? 'Mijn persoonlijke garantie' : 'My personal guarantee'}
          </h2>
          <p className="font-sans text-base md:text-lg text-background/80 leading-relaxed mb-10">
            {isNL
              ? 'Ik sta met mijn naam voor elk stuk dat wij leveren. Niet tevreden binnen 30 dagen na levering? Volledig terugbetaald, ophalen op mijn kosten. Geen procedure, geen discussie.'
              : 'I stand with my name behind every piece we deliver. Not satisfied within 30 days of delivery? Full refund, picked up at my cost. No procedure, no discussion.'}
          </p>
          <div className="pt-8 border-t border-background/15">
            <p className="font-serif italic text-xl text-background mb-2">
              Laurens Soedito
            </p>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-background/50">
              {isNL ? 'Oprichter Sera Norr en Ls Capital' : 'Founder Sera Norr and Ls Capital'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
