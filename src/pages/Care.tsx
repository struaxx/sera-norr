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
    { question: 'Levert SERA NORR onderhoudsmiddelen?', answer: 'Bij levering ontvangt u een verzorgingsset met geschikte producten en instructies. Aanvullende producten zijn op aanvraag verkrijgbaar.' },
  ] : [
    { question: 'Can I place hot pans on natural stone?', answer: 'Natural stone is heat resistant, but we always recommend a trivet to prevent thermal shock and protect the finish.' },
    { question: 'How do I remove stains?', answer: 'Most stains can be removed with a damp cloth. For stubborn stains, we recommend a pH-neutral stone cleaner. Avoid acidic or abrasive products.' },
    { question: 'How often should I seal the stone?', answer: 'For heavily used surfaces (dining tables) we recommend annual sealing. Consoles and side tables can be treated every 2-3 years.' },
    { question: 'Does travertine change color?', answer: 'Travertine may develop a slight patina through use, which deepens its character. This is a natural process that contributes to the unique beauty of the material.' },
    { question: 'Is marble prone to scratches?', answer: 'Marble is softer than granite and may develop light use marks with intensive use. This is normal and contributes to the lived-in character.' },
    { question: 'Does SERA NORR supply care products?', answer: 'Upon delivery you receive a care kit with suitable products and instructions. Additional products are available on request.' },
  ];

  const seoTitle = isNL 
    ? "Onderhoud & bescherming | SERA NORR"
    : "Care & Protection | SERA NORR";

  const seoDescription = isNL
    ? "Natuursteen blijft het mooist met de juiste bescherming en eenvoudig onderhoud. Advies voor travertin en marmer meubels van SERA NORR."
    : "Natural stone looks best with proper protection and simple care. Advice for travertine and marble furniture from SERA NORR.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Onderhoud' : 'Care', url: '/care' },
  ]);

  const faqSchema = generateFAQSchema(faqItems);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbSchema, faqSchema],
  };

  const careSteps = isNL ? [
    { title: 'Dagelijks onderhoud', description: 'Reinig regelmatig met een zachte, licht vochtige doek. Vermijd agressieve middelen.' },
    { title: 'Impregnatie', description: 'Bescherm het oppervlak met hoogwaardige impregneermiddelen. Jaarlijks voor eettafels.' },
    { title: 'Advies op maat', description: 'Elk type steen vraagt om aangepaste verzorging. Bij levering ontvangt u advies.' },
  ] : [
    { title: 'Daily care', description: 'Clean regularly with a soft, slightly damp cloth. Avoid aggressive products.' },
    { title: 'Sealing', description: 'Protect the surface with high-quality sealants. Annually for dining tables.' },
    { title: 'Tailored advice', description: 'Each type of stone requires tailored care. You receive advice upon delivery.' },
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
              {isNL ? "Onderhoud & bescherming" : "Care & protection"}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl">
              {isNL 
                ? "Natuursteen blijft het mooist met de juiste bescherming en eenvoudig onderhoud. Wij adviseren wat past bij uw gebruik."
                : "Natural stone looks best with proper protection and simple care. We advise what suits your use."}
            </p>
          </div>
        </div>
      </section>

      {/* Care Steps - Editorial Grid */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Verzorging' : 'Care'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {careSteps.map((step, index) => (
              <div key={index} className="relative">
                <span className="font-serif text-[80px] lg:text-[100px] text-foreground/[0.03] absolute -top-4 -left-2 leading-none select-none pointer-events-none">
                  0{index + 1}
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

      {/* Material Specifics - Editorial Split */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Per materiaal' : 'Per material'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Travertine */}
            <div className="p-8 lg:p-10 border border-foreground/8 bg-background">
              <p className="editorial-caption-label mb-3">01</p>
              <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-4">
                Travertin
              </h3>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-6">
                {isNL 
                  ? "Warm en poreus. Impregneert uitstekend en ontwikkelt met de tijd een mooie patina die het karakter verdiept."
                  : "Warm and porous. Seals excellently and develops a beautiful patina over time that deepens its character."}
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full shrink-0" />
                  {isNL ? "Gebruik zachte microvezel doek" : "Use soft microfiber cloth"}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full shrink-0" />
                  {isNL ? "Vermijd zure vloeistoffen" : "Avoid acidic liquids"}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full shrink-0" />
                  {isNL ? "Jaarlijkse impregnatie aanbevolen" : "Annual sealing recommended"}
                </li>
              </ul>
            </div>

            {/* Marble */}
            <div className="p-8 lg:p-10 border border-foreground/8 bg-background">
              <p className="editorial-caption-label mb-3">02</p>
              <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-4">
                {isNL ? "Marmer" : "Marble"}
              </h3>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-6">
                {isNL 
                  ? "Elegant en delicaat. Vraagt extra aandacht voor zure vloeistoffen. Regelmatige impregnatie beschermt het oppervlak."
                  : "Elegant and delicate. Requires extra attention for acidic liquids. Regular sealing protects the surface."}
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full shrink-0" />
                  {isNL ? "Veeg gemorste vloeistoffen direct op" : "Wipe up spilled liquids immediately"}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full shrink-0" />
                  {isNL ? "Gebruik onderzetters" : "Use coasters"}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full shrink-0" />
                  {isNL ? "pH-neutrale reiniger" : "pH-neutral cleaner"}
                </li>
              </ul>
            </div>
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
                <Link to="/voorstel" onClick={trackProposal}>
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