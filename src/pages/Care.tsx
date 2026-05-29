import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead, generateBreadcrumbSchema, generateFAQSchema, Breadcrumbs } from "@/components/seo";
import { ArrowRight, Calendar } from "lucide-react";
import { Hairline } from "@/components/ui/hairline";
import { ProofGrid } from "@/components/ui/proof-grid";
import { usePageTracking, useTopicTracking, useFAQTracking, useCTATracking } from "@/hooks/use-tracking";

const Care = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  
  // Track page view and topic view
  usePageTracking();
  useTopicTracking('care');
  
  const { trackFAQ } = useFAQTracking();
  const { trackProposal, trackConsult } = useCTATracking();

  const faqItems = isNL ? [
    { question: 'Kan ik hete pannen op natuursteen zetten?', answer: 'Natuursteen is hittebestendig, maar wij raden altijd een onderzetter aan om thermische schokken te voorkomen en de afwerking te beschermen.' },
    { question: 'Hoe verwijder ik vlekken?', answer: 'De meeste vlekken kunnen met een vochtige doek worden verwijderd. Bij hardnekkige vlekken adviseren wij een pH-neutrale steenreiniger. Vermijd zure of schurende middelen.' },
    { question: 'Hoe vaak moet ik impregneren?', answer: 'Voor intensief gebruikte oppervlakken (eettafels) adviseren wij jaarlijks impregneren. Consoles en bijzettafels kunnen om de 2-3 jaar worden behandeld.' },
    { question: 'Verandert travertin van kleur?', answer: 'Travertin kan licht patineren door gebruik, wat het karakter verdiept. Dit is een natuurlijk proces dat bijdraagt aan de unieke schoonheid van het materiaal.' },
    { question: 'Is marmer gevoelig voor krassen?', answer: 'Marmer is zachter dan graniet en kan bij intensief gebruik lichte gebruikssporen krijgen. Dit is normaal en draagt bij aan het geleefde karakter.' },
  ] : [
    { question: 'Can I place hot pans on natural stone?', answer: 'Natural stone is heat resistant, but we always recommend a trivet to prevent thermal shock and protect the finish.' },
    { question: 'How do I remove stains?', answer: 'Most stains can be removed with a damp cloth. For stubborn stains, we recommend a pH-neutral stone cleaner. Avoid acidic or abrasive products.' },
    { question: 'How often should I seal the stone?', answer: 'For heavily used surfaces (dining tables) we recommend annual sealing. Consoles and side tables can be treated every 2-3 years.' },
    { question: 'Does travertine change color?', answer: 'Travertine may develop a slight patina through use, which deepens its character. This is a natural process that contributes to the unique beauty of the material.' },
    { question: 'Is marble prone to scratches?', answer: 'Marble is softer than granite and may develop light use marks with intensive use. This is normal and contributes to the lived-in character.' },
  ];

  const seoTitle = isNL 
    ? "Onderhoud & verzorging | SERA NORR"
    : "Care & maintenance | SERA NORR";

  const seoDescription = isNL
    ? "Natuursteen is een levend materiaal. Algemene basis plus specifieke verzorging voor marmer, travertijn en kwartsiet."
    : "Natural stone is a living material. General basics and specific care for marble, travertine and quartzite."

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Onderhoud' : 'Care', url: '/care' },
  ]);

  const faqSchema = generateFAQSchema(faqItems);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbSchema, faqSchema],
  };

  const basics = isNL ? [
    {
      title: 'Dagelijks',
      description: 'Stof afnemen met een zachte, droge of licht vochtige microvezeldoek. Gemorste vloeistoffen direct opnemen, met name wijn, citrusvruchten, koffie, azijn en olie. Snel handelen voorkomt vlekken.',
    },
    {
      title: 'Schoonmaakmiddelen',
      description: 'Gebruik pH-neutrale reinigers, speciaal voor natuursteen. Vermijd azijn, citroen, ammoniak, bleek, allesreinigers, schuurmiddelen en glasreiniger. Deze middelen kunnen het oppervlak aantasten.',
    },
    {
      title: 'Bescherming in gebruik',
      description: 'Gebruik onderzetters onder glazen, vazen en hete pannen. Plaats hete schalen niet rechtstreeks op de steen. Snijden doet u altijd op een snijplank.',
    },
    {
      title: 'Impregneren',
      description: 'Natuursteen is poreus en wordt bij ons standaard ingespoten met een hoogwaardige impregneer. Herhaal dit elke 12 tot 24 maanden, afhankelijk van gebruik. Eenvoudige test: leg een druppel water op het oppervlak. Parelt het op, dan is de bescherming nog actief. Trekt het binnen seconden in, dan is het tijd voor een nieuwe behandeling.',
    },
  ] : [
    {
      title: 'Daily',
      description: 'Dust with a soft, dry or slightly damp microfibre cloth. Wipe up spills immediately, especially wine, citrus, coffee, vinegar and oil. Acting quickly prevents stains.',
    },
    {
      title: 'Cleaning products',
      description: 'Use pH-neutral cleaners made for natural stone. Avoid vinegar, lemon, ammonia, bleach, all-purpose cleaners, abrasives and glass cleaner. These can damage the surface.',
    },
    {
      title: 'Protection in use',
      description: 'Use coasters under glasses, vases and hot pans. Do not place hot dishes directly on the stone. Always cut on a cutting board.',
    },
    {
      title: 'Sealing',
      description: 'Natural stone is porous and is treated by us with a high-quality sealant as standard. Repeat every 12 to 24 months, depending on use. Simple test: place a drop of water on the surface. If it beads, the protection is still active. If it absorbs within seconds, it is time to reseal.',
    },
  ];

  const materials = isNL ? [
    {
      name: 'Marmer',
      examples: 'Calacatta, Carrara, Calacatta Viola, Arabescato, Statuario en vergelijkbare soorten.',
      character: 'Marmer is kalksteen en reageert gevoelig op zuren. Een druppel citroensap of wijn die te lang blijft staan, kan een lichte matte plek achterlaten. Veel eigenaren waarderen juist deze patina die in de loop der jaren ontstaat als deel van het karakter van marmer.',
      specifics: [
        'Op gepolijst marmer zijn matte plekken iets zichtbaarder dan op gezoet marmer.',
        'Gezoete afwerking is iets vergevingsgezinder voor dagelijks gebruik.',
        'Vermijd langdurige directe zoninstraling, dit kan kleurverandering geven bij sommige soorten.',
      ],
      yearly: 'Eén keer per jaar een grondige reiniging met professionele natuursteenreiniger. Bij lichte doffe plekken of kleine etsingen is een marmer-polijstpoeder verkrijgbaar voor thuisgebruik. Bij twijfel of grotere schade kunt u altijd contact met ons opnemen.',
    },
    {
      name: 'Travertijn',
      examples: 'Tiramisu, Classic Cloudy, Noce, Romano en vergelijkbare soorten.',
      character: 'Travertijn is herkenbaar aan de natuurlijke gaatjes en open poriën, ontstaan door warmwaterbronnen. Bij productie worden deze poriën standaard opgevuld. Net als marmer is travertijn kalksteen en gevoelig voor zuren.',
      specifics: [
        'Controleer af en toe of de gevulde poriën nog intact zijn. Bij dagelijks gebruik kunnen kleine deeltjes loslaten, dit is normaal en eenvoudig bij te werken.',
        'Droog het oppervlak goed af na schoonmaken, open poriën kunnen vocht vasthouden.',
        'Gezoete travertijn heeft een mat oppervlak dat verkleuringen iets sneller absorbeert.',
      ],
      yearly: 'Eén keer per jaar grondige reiniging plus controle van de poriën. Een travertijn-vulpasta in de juiste kleur is beschikbaar voor het bijwerken van gaatjes. Wij adviseren u graag bij twijfel.',
    },
    {
      name: 'Kwartsiet',
      examples: 'Taj Mahal, Mont Blanc, Cristallo, Macaubas en vergelijkbare soorten.',
      character: 'Kwartsiet is een metamorf gesteente, ontstaan uit zandsteen onder hoge druk. Het is harder dan marmer en minder gevoelig voor zuren en krassen. De meest robuuste keuze voor intensief gebruik.',
      specifics: [
        'Echt kwartsiet is bestand tegen citroensap, wijn en de meeste huishoudelijke vloeistoffen, maar blijft poreus. Impregneren blijft daarom belangrijk.',
        'Verwar kwartsiet niet met kwartscomposiet: kwartsiet is 100% natuursteen, kwartscomposiet is een industrieel product.',
      ],
      yearly: 'Eén keer per jaar grondige reiniging en hertesten van de impregneer. Door de hardheid van het materiaal is verder onderhoud zelden nodig.',
    },
  ] : [
    {
      name: 'Marble',
      examples: 'Calacatta, Carrara, Calacatta Viola, Arabescato, Statuario and similar types.',
      character: 'Marble is a limestone and reacts to acids. A drop of lemon juice or wine left too long can leave a slight matte mark. Many owners value this patina that develops over the years as part of marble\u2019s character.',
      specifics: [
        'On polished marble, matte spots are slightly more visible than on honed marble.',
        'A honed finish is a little more forgiving for daily use.',
        'Avoid prolonged direct sunlight, as this can cause colour change in some types.',
      ],
      yearly: 'Once a year, a thorough clean with a professional stone cleaner. For light dull spots or small etchings, a marble polishing powder is available for home use. When in doubt, or for larger damage, please contact us.',
    },
    {
      name: 'Travertine',
      examples: 'Tiramisu, Classic Cloudy, Noce, Romano and similar types.',
      character: 'Travertine is recognisable by its natural holes and open pores, formed by hot springs. During production these pores are filled as standard. Like marble, travertine is a limestone and sensitive to acids.',
      specifics: [
        'Check now and then whether the filled pores are still intact. With daily use, small particles can come loose. This is normal and easy to touch up.',
        'Dry the surface well after cleaning, as open pores can hold moisture.',
        'Honed travertine has a matte surface that absorbs discolouration slightly faster.',
      ],
      yearly: 'Once a year a thorough clean and a check of the pores. A travertine filler paste in the matching colour is available to touch up holes. We are happy to advise.',
    },
    {
      name: 'Quartzite',
      examples: 'Taj Mahal, Mont Blanc, Cristallo, Macaubas and similar types.',
      character: 'Quartzite is a metamorphic rock, formed from sandstone under high pressure. It is harder than marble and less sensitive to acids and scratches. The most robust choice for intensive use.',
      specifics: [
        'True quartzite resists lemon juice, wine and most household liquids, but remains porous. Sealing is therefore still important.',
        'Do not confuse quartzite with quartz composite: quartzite is 100% natural stone, quartz composite is an industrial product.',
      ],
      yearly: 'Once a year a thorough clean and a re-test of the sealant. Thanks to the hardness of the material, further maintenance is rarely needed.',
    },
  ];

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: isNL ? 'Onderhoud' : 'Care', href: "/care" },
  ];

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        structuredData={combinedSchema}
      />
      
      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} className="mb-8 opacity-60 text-[10px]" />
          
          <div className="max-w-3xl">
            <p className="micro-label mb-6">
              {isNL ? "Informatie" : "Information"}
            </p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {isNL ? "Onderhoud & verzorging" : "Care & maintenance"}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl">
              {isNL 
                ? "Natuursteen is een levend, eerlijk materiaal. Met de juiste verzorging wordt uw tafel mooier met de jaren. Hieronder de algemene basis voor alle natuursteen, gevolgd door de specifieke aandachtspunten per steensoort."
                : "Natural stone is a living, honest material. With the right care, your table only grows more beautiful over the years. Below the general basics for all natural stone, followed by specific points of attention per stone type."}
            </p>
          </div>
        </div>
      </section>

      {/* General basics - Editorial Grid */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Algemene basis' : 'General basics'}</span>
            <Hairline className="flex-1" />
          </div>

          <p className="text-body-md text-muted-foreground max-w-2xl mb-12 lg:mb-16">
            {isNL ? 'Geldt voor marmer, travertijn en kwartsiet.' : 'Applies to marble, travertine and quartzite.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {basics.map((step, index) => (
              <div key={index} className="relative">
                <span className="font-serif text-[80px] lg:text-[100px] text-foreground/[0.03] absolute -top-4 -left-2 leading-none select-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="relative pt-8">
                  <h3 className="font-serif text-xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Per stone type - Editorial Cards */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Per steensoort' : 'Per stone type'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {materials.map((m, index) => (
              <div key={m.name} className="p-8 lg:p-10 border border-foreground/8 bg-background flex flex-col">
                <p className="editorial-caption-label mb-3">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-3">
                  {m.name}
                </h3>
                <p className="text-body-sm text-muted-foreground italic mb-6">
                  {m.examples}
                </p>

                <p className="micro-label mb-2">{isNL ? 'Karakter' : 'Character'}</p>
                <p className="text-body-sm text-muted-foreground leading-relaxed mb-6">
                  {m.character}
                </p>

                <p className="micro-label mb-2">{isNL ? 'Specifiek' : 'Specifics'}</p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  {m.specifics.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full shrink-0 mt-2" />
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>

                <p className="micro-label mb-2">{isNL ? 'Jaarlijks' : 'Yearly'}</p>
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  {m.yearly}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions or doubts */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="micro-label mb-4">{isNL ? 'Vragen of twijfel' : 'Questions or doubts'}</p>
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {isNL ? 'Wij denken graag mee.' : 'We are happy to help.'}
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-8">
              {isNL
                ? 'Bij vragen over een vlek, kras of onderhoudssituatie kunt u altijd contact met ons opnemen.'
                : 'For any question about a stain, scratch or care situation, you are welcome to get in touch.'}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-foreground text-body-sm uppercase tracking-[0.15em] border-b border-foreground/40 hover:border-foreground pb-1 transition-colors"
            >
              {isNL ? 'Neem contact op' : 'Get in touch'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Veelgestelde vragen' : 'FAQ'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-foreground/8">
                  <AccordionTrigger 
                    className="text-left text-body-md font-medium text-foreground hover:no-underline py-6"
                    onClick={() => trackFAQ('care')}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-body-sm text-muted-foreground pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-sm text-background mb-4">
              {isNL ? "Bescherming meenemen in uw voorstel?" : "Include protection in your proposal?"}
            </h2>
            <p className="text-background/70 text-body-md mb-10">
              {isNL 
                ? "Wij adviseren wat past bij uw gebruik en kunnen bescherming meenemen in het voorstel."
                : "We advise what suits your use and can include protection in the proposal."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
                <Link to="/atelier" onClick={trackProposal}>
                  {isNL ? "Ontvang voorstel binnen 48 uur" : "Receive proposal within 48 hours"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="sera-secondary" size="lg" className="border-background/40 text-background hover:border-background/60 hover:bg-background/5">
                <Link to="/contact" onClick={trackConsult}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {isNL ? "Plan vrijblijvend gesprek" : "Schedule free consultation"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Care;