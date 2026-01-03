import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead, generateBreadcrumbSchema, generateFAQSchema } from "@/components/seo";
import { ArrowRight, Calendar, Droplets, Shield, Sparkles } from "lucide-react";
import { SectionBand } from "@/components/ui/section-band";
import { PremiumTimeline, TimelineStep } from "@/components/ui/premium-timeline";

const Care = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

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

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        structuredData={combinedSchema}
      />
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          {/* Header */}
          <header className="text-center mb-12">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {isNL ? "Informatie" : "Information"}
            </p>
            <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-4">
              {isNL ? "Onderhoud & bescherming" : "Care & protection"}
            </h1>
            <p className="text-muted-foreground text-body-md max-w-xl mx-auto">
              {isNL 
                ? "Natuursteen blijft het mooist met de juiste bescherming en eenvoudig onderhoud. Wij adviseren wat past bij uw gebruik."
                : "Natural stone looks best with proper protection and simple care. We advise what suits your use."}
            </p>
          </header>

          {/* Section 1: Dagelijks onderhoud */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Droplets className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-foreground mb-2">
                  {isNL ? "Dagelijks onderhoud" : "Daily care"}
                </h2>
                <p className="text-muted-foreground text-body-md leading-relaxed">
                  {isNL 
                    ? "Reinig uw stenen meubel regelmatig met een zachte, licht vochtige doek. Vermijd agressieve schoonmaakmiddelen, zure vloeistoffen (citroensap, azijn) en schurende materialen. Voor dagelijks gebruik is water voldoende."
                    : "Clean your stone furniture regularly with a soft, lightly damp cloth. Avoid aggressive cleaning products, acidic liquids (lemon juice, vinegar) and abrasive materials. For daily use, water is sufficient."}
                </p>
              </div>
            </div>
            <ul className="ml-14 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                {isNL ? "Gebruik een zachte microvezel doek" : "Use a soft microfiber cloth"}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                {isNL ? "Veeg gemorste vloeistoffen direct op" : "Wipe up spilled liquids immediately"}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                {isNL ? "Gebruik onderzetters onder hete voorwerpen" : "Use coasters under hot objects"}
              </li>
            </ul>
          </section>

          {/* Section 2: Impregnatie */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-foreground mb-2">
                  {isNL ? "Impregnatie & bescherming" : "Sealing & protection"}
                </h2>
                <p className="text-muted-foreground text-body-md leading-relaxed">
                  {isNL 
                    ? "Impregnatie beschermt natuursteen tegen vlekken door een onzichtbare beschermlaag te creëren. Het sluit de poriën af zonder het natuurlijke karakter aan te tasten. Wij gebruiken hoogwaardige impregneermiddelen die langdurige bescherming bieden."
                    : "Sealing protects natural stone against stains by creating an invisible protective layer. It closes the pores without affecting the natural character. We use high-quality sealants that offer long-lasting protection."}
                </p>
              </div>
            </div>
            <div className="ml-14 bg-secondary/30 border border-border/30 p-4">
              <p className="text-sm text-foreground font-medium mb-1">
                {isNL ? "Onze aanbeveling" : "Our recommendation"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isNL 
                  ? "Intensief gebruikte oppervlakken (eettafels): jaarlijks impregneren. Consoles en bijzettafels: om de 2-3 jaar."
                  : "Heavily used surfaces (dining tables): annual sealing. Consoles and side tables: every 2-3 years."}
              </p>
            </div>
          </section>

          {/* Section 3: Wat wij adviseren */}
          <section className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-foreground mb-2">
                  {isNL ? "Wat wij adviseren" : "What we recommend"}
                </h2>
                <p className="text-muted-foreground text-body-md leading-relaxed mb-4">
                  {isNL 
                    ? "Elk type steen heeft een eigen karakter en vraagt om aangepaste verzorging. Bij levering ontvangt u advies op maat en een verzorgingsset."
                    : "Each type of stone has its own character and requires tailored care. Upon delivery you receive customized advice and a care kit."}
                </p>
              </div>
            </div>
            <div className="ml-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-border/30 p-4">
                <p className="text-sm font-medium text-foreground mb-1">Travertin</p>
                <p className="text-xs text-muted-foreground">
                  {isNL 
                    ? "Warm en poreus. Impregneert uitstekend. Lichte patina verdiept karakter."
                    : "Warm and porous. Seals excellently. Light patina deepens character."}
                </p>
              </div>
              <div className="border border-border/30 p-4">
                <p className="text-sm font-medium text-foreground mb-1">{isNL ? "Marmer" : "Marble"}</p>
                <p className="text-xs text-muted-foreground">
                  {isNL 
                    ? "Elegant en delicaat. Extra aandacht voor zure vloeistoffen. Regelmatige impregnatie."
                    : "Elegant and delicate. Extra attention for acidic liquids. Regular sealing."}
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-border/30 my-12" />

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="font-serif text-xl text-foreground mb-6 text-center">
              {isNL ? "Veelgestelde vragen" : "Frequently asked questions"}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/30">
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CTA */}
          <div className="text-center pt-8 border-t border-border/30">
            <h3 className="font-serif text-lg text-foreground mb-2">
              {isNL ? "Bescherming meenemen in uw voorstel?" : "Include protection in your proposal?"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {isNL 
                ? "Wij adviseren wat past bij uw gebruik en kunnen bescherming meenemen in het voorstel."
                : "We advise what suits your use and can include protection in the proposal."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="atelier-filled" size="lg">
                <Link to="/voorstel">
                  {isNL ? "Ontvang voorstel binnen 48 uur" : "Receive proposal within 48 hours"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="atelier" size="lg">
                <Link to="/contact">
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
