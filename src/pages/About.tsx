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
import materialsImage from "@/assets/about-materials.jpg";
import interiorImage from "@/assets/vanta-collection.jpg";

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
          ? "over SERA NORR, online atelier, maatwerk natuursteenmeubels, ontworpen in Nederland, travertijn, marmer" 
          : "about SERA NORR, online atelier, bespoke natural stone furniture, designed in the Netherlands, travertine, marble"}
        structuredData={combinedSchema}
      />

      {/* Hero: beeld over de volle hoogte, met de kerngegevens op een
          hairline onderin zodat de pagina meteen gewicht heeft. */}
      <section className="relative h-[72vh] lg:h-[82vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={atelierImage}
            alt={isNL ? "SERA NORR atelier werkplaats" : "SERA NORR atelier workspace"}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 58%' }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/70 to-foreground/20" />
        </div>

        <div className="relative z-10 w-full pb-10 lg:pb-12">
          <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
            <Breadcrumbs className="mb-8 opacity-50 text-[10px] text-background/60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
              <div className="lg:col-span-7">
                <p className="text-[10px] font-sans font-medium uppercase tracking-[0.3em] text-background/60 mb-6">
                  {isNL ? 'Over het atelier' : 'About the atelier'}
                </p>
                <h1 className="font-serif text-display-md lg:text-display-lg text-background leading-[1.02] [text-shadow:0_4px_24px_hsl(var(--foreground)/0.4)]">
                  {isNL ? 'Vorm volgt materiaal.' : 'Form follows material.'}
                </h1>
              </div>
              <div className="lg:col-span-5 lg:pb-3">
                <p className="text-background text-body-md leading-relaxed [text-shadow:0_2px_20px_hsl(var(--foreground)/0.8)]">
                  {isNL
                    ? 'Een atelier voor maatwerk meubels in natuursteen, opgezet vanuit jarenlange ervaring in de interieurbouw. Eén materiaal, volle aandacht.'
                    : 'An atelier for bespoke natural stone furniture, built on years of experience in interior craftsmanship. One material, full attention.'}
                </p>
              </div>
            </div>

            {/* Kerngegevens op een hairline */}
            <div className="mt-10 lg:mt-14 pt-5 border-t border-background/25 flex flex-wrap gap-x-10 gap-y-3">
              {[
                [isNL ? 'Gevestigd' : 'Based', 'Amersfoort, NL'],
                [isNL ? 'Vakgebied' : 'Discipline', isNL ? 'Natuursteen op maat' : 'Bespoke natural stone'],
                [isNL ? 'Levering' : 'Delivery', isNL ? 'White-glove, Europa' : 'White-glove, Europe'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-background/50">{label}</p>
                  <p className="text-sm text-background/90 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Het verhaal, met het materiaalbeeld als rustpunt */}
      <FounderStorySection isNL={isNL} />

      {/* Over de oprichter */}
      <FounderProfileSection isNL={isNL} />

      {/* Hoe wij werken, gevolgd door de nuchtere bedrijfsgegevens */}
      <InfoBlocksSection isNL={isNL} />
      <OriginSection isNL={isNL} />

      {/* De twee beloftes bouwen op naar de persoonlijke garantie; die is het
          slot van de pagina en loopt in dezelfde donkere kleur over in de
          oproep om te beginnen. */}
      <GuaranteeSection isNL={isNL} />
      <PersonalGuaranteeSection isNL={isNL} />

      {/* CTA Band */}
      <section className="pt-16 lg:pt-20 pb-24 lg:pb-32 bg-foreground text-background border-t border-background/15">
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
    <section className="pt-24 lg:pt-32 pb-20 lg:pb-24" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-6 mb-14 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Het verhaal' : 'The story'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-6">
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground leading-[1.05] max-w-md">
                {isNL ? 'Waarom een eigen merk' : 'Why an own brand'}
              </h2>
            </div>
            <div className="lg:col-span-6 space-y-6 lg:pt-3">
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {isNL
                  ? 'Onze achtergrond ligt in maatwerk interieurs en keukens, een vak waarin natuursteen vaak een bijrol speelt. Met Sera Norr maken we er de hoofdrol van. Eén materiaal, volle aandacht, sculpturale meubels die generaties meegaan.'
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

      {/* Materiaalbeeld: rustpunt tussen de tekstblokken, en het onderwerp
          waar de hele pagina over gaat ook echt laten zien. */}
      <motion.figure
        className="mt-16 lg:mt-24"
        variants={variants.fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="relative overflow-hidden bg-muted h-[45vh] lg:h-[62vh]">
          <img
            src={materialsImage}
            alt={isNL ? 'Platen travertijn en marmer in het atelier' : 'Slabs of travertine and marble in the atelier'}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="mt-4 pt-4 border-t border-foreground/10 flex flex-wrap items-baseline justify-between gap-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {isNL ? 'Travertijn en marmer' : 'Travertine and marble'}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {isNL ? 'Per project geselecteerd' : 'Selected per project'}
            </span>
          </div>
        </figcaption>
      </motion.figure>
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
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-6 mb-14 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Onze belofte' : 'Our promise'}</span>
            <Hairline className="flex-1" />
          </div>

          <h2 className="font-serif text-display-sm lg:text-display-md text-foreground leading-[1.05] mb-12 lg:mb-16 max-w-2xl">
            {isNL ? 'Twee beloftes' : 'Two promises'}
          </h2>

          {/* Open kolommen op een hairline; het cijfer draagt de structuur,
              niet een omlijnd vlak. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 border-t border-foreground/15 pt-10 lg:pt-12">
            {items.map((value, index) => (
              <div key={index} className={index === 0 ? 'md:pr-10 lg:pr-16' : 'md:pl-10 lg:pl-16 md:border-l md:border-foreground/10'}>
                <span className="font-serif text-4xl lg:text-5xl text-foreground/20 leading-none block mb-6">
                  0{index + 1}
                </span>
                <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-body-md text-muted-foreground leading-relaxed">
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
      description: 'Onze steen komt uit de groeven die wereldwijd bekend staan om hun kwaliteit en karakter. Italiaans marmer uit Carrara en de Apuaanse Alpen, travertijn uit Italië en Turkije, kwartsiet uit Brazilië. Per project selecteren wij de platen op tekening en kleur, passend bij uw ontwerp. Geen voorraadsteen, geen toevalstreffer.',
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
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-6 mb-14 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Werkwijze' : 'How we work'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end mb-12 lg:mb-16">
            <h2 className="lg:col-span-6 font-serif text-display-sm lg:text-display-md text-foreground leading-[1.05]">
              {isNL ? 'Hoe wij werken' : 'How we work'}
            </h2>
            <p className="lg:col-span-6 text-body-md text-muted-foreground lg:pb-2">
              {isNL
                ? 'Van de keuze van de plaat tot het moment dat het stuk op zijn plek staat, ligt elke stap bij een vaste partij die wij kennen.'
                : 'From choosing the slab to the moment the piece stands in place, every step sits with a fixed partner we know.'}
            </p>
          </div>

          {/* Genummerde index: elke stap een regel op een hairline. */}
          <div className="border-t border-foreground/15">
            {blocks.map((b, i) => (
              <div
                key={b.label}
                className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-10 py-7 lg:py-9 border-b border-foreground/10"
              >
                <div className="lg:col-span-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="lg:col-span-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                    {b.label}
                  </p>
                  <h3 className="font-serif text-xl lg:text-2xl text-foreground leading-snug">
                    {b.title}
                  </h3>
                </div>
                <div className="lg:col-span-7">
                  <p className="text-body-md text-muted-foreground leading-relaxed">
                    {b.description}
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

function OriginSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section className="py-16 lg:py-20" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-baseline border-t border-foreground/15 pt-8"
        >
          <div className="lg:col-span-4">
            <p className="micro-label mb-3">{isNL ? 'Vestiging' : 'Based in'}</p>
            <h2 className="font-serif text-xl lg:text-2xl text-foreground leading-snug">
              {isNL ? 'Waar wij vandaan komen' : 'Where we come from'}
            </h2>
          </div>
          <p className="lg:col-span-8 text-body-md text-muted-foreground leading-relaxed">
            {isNL
              ? 'Sera Norr is gevestigd in Amersfoort en onderdeel van LS Capital (KvK 89004213). Wij ontwerpen en coördineren vanuit Nederland en leveren in heel Europa.'
              : 'Sera Norr is based in Amersfoort and part of LS Capital, registered with the Dutch Chamber of Commerce (KvK 89004213). We design and coordinate from the Netherlands and deliver throughout Europe.'}
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
    <section className="py-24 lg:py-32 bg-secondary/20" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="flex items-center gap-6 mb-14 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">
              {isNL ? 'Over de oprichter' : 'About the founder'}
            </span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Werk in plaats van een portret: waar het over gaat is het stuk */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden bg-muted aspect-[4/5]">
                <img
                  src={interiorImage}
                  alt={isNL ? 'Salontafel in Calacatta Viola in een Amsterdams interieur' : 'Calacatta Viola coffee table in an Amsterdam interior'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10 pointer-events-none" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground leading-[1.05] mb-8 lg:mb-10">
                {isNL ? 'Wie staat er achter Sera Norr' : 'Who stands behind Sera Norr'}
              </h2>

              <div className="border-t border-foreground/15 pt-6 mb-8">
                <p className="font-serif text-2xl lg:text-3xl text-foreground">Laurens Soedito</p>
                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2">
                  {isNL
                    ? 'Oprichter Sera Norr · Managing Director LS Capital'
                    : 'Founder Sera Norr · Managing Director LS Capital'}
                </p>
              </div>

              <div className="space-y-5">
                <p className="text-body-md text-muted-foreground leading-relaxed">
                  {isNL
                    ? 'Via LS Capital begeleid ik al jaren high-end interieurbouw in Nederland. Ik ken de leveranciers, de groeven en de standaard die premium kopers verwachten. Sera Norr is daar het logische vervolg op: hetzelfde niveau, nu in natuursteen.'
                    : 'Through LS Capital I have guided high-end interior construction in the Netherlands for years. I know the suppliers, the quarries and the standard premium buyers expect. Sera Norr is the logical next step: the same level, now in natural stone.'}
                </p>
                <p className="text-body-md text-muted-foreground leading-relaxed">
                  {isNL
                    ? 'U heeft dus niet met een webshop te maken, maar met één persoon die uw project van eerste tekening tot oplevering bewaakt en er met zijn naam aan verbonden is.'
                    : 'So you are not dealing with a webshop, but with one person who guards your project from first drawing through to delivery and stands behind it with his name.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PersonalGuaranteeSection({ isNL }: { isNL: boolean }) {
  const { ref, isInView, variants } = useScrollReveal();

  return (
    <section className="bg-foreground text-background py-28 lg:py-40" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="flex items-center gap-6 mb-14 lg:mb-20">
            <div className="h-px flex-1 bg-background/15" />
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-background/50 shrink-0">
              {isNL ? 'Garantie' : 'Guarantee'}
            </span>
            <div className="h-px flex-1 bg-background/15" />
          </div>

          {/* De belofte als uitspraak, niet als tekstblok in een kader */}
          <blockquote className="max-w-4xl">
            <p className="font-serif text-2xl md:text-4xl lg:text-[2.75rem] text-background leading-[1.25] tracking-[-0.01em]">
              {isNL
                ? 'Voor elk project kies ik de steen zelf uit, leg ik de specificaties vast en bewaak ik de kwaliteit tot het stuk bij u staat.'
                : 'For every project I select the stone myself, lock in the specifications and guard the quality until the piece stands in your home.'}
            </p>
            <p className="font-sans text-base lg:text-lg text-background/70 leading-relaxed mt-8 max-w-2xl">
              {isNL
                ? 'U heeft één aanspreekpunt, van de eerste tekening tot de oplevering. Klopt er iets niet, dan los ik het op.'
                : 'You have one point of contact, from the first drawing through to delivery. If something is not right, I resolve it.'}
            </p>
          </blockquote>

          <div className="mt-14 lg:mt-20 pt-8 border-t border-background/15 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p
                className="text-background/80 text-4xl lg:text-5xl leading-none mb-4"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Laurens Soedito
              </p>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-background/50">
                {isNL
                  ? 'Oprichter Sera Norr · Managing Director LS Capital'
                  : 'Founder Sera Norr · Managing Director LS Capital'}
              </p>
            </div>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-background/40 sm:text-right">
              {isNL ? 'Amersfoort, Nederland' : 'Amersfoort, the Netherlands'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
