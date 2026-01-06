import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { SEOHead, generateBreadcrumbSchema, generateFAQSchema, Breadcrumbs } from "@/components/seo";
import { ArrowRight, Check } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics";
import { Hairline, MicroLabel } from "@/components/ui/hairline";
import { usePageTracking } from "@/hooks/use-tracking";
import { trackFormStart, trackFormSubmit } from "@/lib/tracking";
import { AtelierFlow, ProjectDossier, initialAtelierFlowData } from "@/components/bespoke";
import type { AtelierFlowData } from "@/components/bespoke";
import bespokeHero from "@/assets/bespoke-hero.png";

const Bespoke = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  
  // Atelier Flow data
  const [flowData, setFlowData] = useState<AtelierFlowData>(initialAtelierFlowData);
  
  // Contact form data
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStartedFlow, setHasStartedFlow] = useState(false);
  
  usePageTracking();

  const handleFlowDataChange = (data: AtelierFlowData) => {
    if (!hasStartedFlow) {
      setHasStartedFlow(true);
      trackFormStart('bespoke');
    }
    setFlowData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactData.name || !contactData.email) {
      toast({
        title: isNL ? "Vul uw gegevens in" : "Please fill in your details",
        description: isNL ? "Naam en e-mail zijn verplicht." : "Name and email are required.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Track submission
      trackLeadSubmit('bespoke', { 
        productType: flowData.productType,
        stone: flowData.stone,
      });
      trackFormSubmit('bespoke');

      // TODO: Actually submit to backend
      
      toast({
        title: isNL ? "Dossier verzonden" : "Dossier submitted",
        description: isNL 
          ? "Wij nemen binnen 48 uur contact op met vervolgstappen." 
          : "We will contact you within 48 hours with next steps.",
      });
      
      // Reset form
      setFlowData(initialAtelierFlowData);
      setContactData({ name: "", email: "", phone: "" });
      setHasStartedFlow(false);
      
    } catch (error) {
      toast({
        title: isNL ? "Er ging iets mis" : "Something went wrong",
        description: isNL ? "Probeer het opnieuw." : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if flow is complete enough to submit
  const isFlowComplete = flowData.direction && flowData.productType && flowData.shape && flowData.stone;

  const seoTitle = isNL 
    ? "Maatwerk natuursteen meubels | SERA NORR Atelier"
    : "Bespoke Natural Stone Furniture | SERA NORR Atelier";

  const seoDescription = isNL
    ? "Maatwerk in travertin en marmer, afgestemd op uw ruimte. Configureer uw stuk via de Atelier Flow en ontvang een voorstel op maat."
    : "Bespoke travertine and marble furniture tailored to your space. Configure your piece via the Atelier Flow and receive a tailored proposal.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Maatwerk' : 'Bespoke', url: '/bespoke' },
  ]);

  const faqItems = isNL ? [
    { question: 'Hoe werkt de Atelier Flow?', answer: 'U doorloopt 5 stappen om uw wensen en specificaties te verzamelen. Alles komt samen in uw Project Dossier, dat wij gebruiken om een voorstel op maat te maken.' },
    { question: 'Hoe lang is de doorlooptijd?', answer: 'Gemiddeld 8–12 weken vanaf akkoord, afhankelijk van steenkeuze en complexiteit.' },
    { question: 'Welke materialen zijn mogelijk?', answer: 'Wij werken met travertin, Calacatta Viola marmer en geselecteerde natuurstenen op aanvraag.' },
    { question: 'Hoe werkt levering en plaatsing?', answer: 'White-glove levering in Nederland en België. Wij plaatsen het meubel op locatie en verwijderen alle verpakking.' },
    { question: 'Is er garantie?', answer: '2 jaar garantie op constructie en materiaal.' },
  ] : [
    { question: 'How does the Atelier Flow work?', answer: 'You go through 5 steps to collect your wishes and specifications. Everything comes together in your Project Dossier, which we use to create a tailored proposal.' },
    { question: 'What is the lead time?', answer: 'Average 8–12 weeks from approval, depending on stone choice and complexity.' },
    { question: 'What materials are available?', answer: 'We work with travertine, Calacatta Viola marble and selected natural stones on request.' },
    { question: 'How does delivery work?', answer: 'White-glove delivery in the Netherlands and Belgium. We place the furniture on location and remove all packaging.' },
    { question: 'Is there a warranty?', answer: '2-year warranty on construction and materials.' },
  ];

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
        keywords={isNL 
          ? "SERA NORR, maatwerk natuursteenmeubels, atelier flow, travertin tafel op maat, marmeren tafel" 
          : "SERA NORR, bespoke natural stone furniture, atelier flow, custom travertine table, marble table"}
        structuredData={combinedSchema}
      />

      {/* ============================================
          SECTION 1: HERO
          ============================================ */}
      <section className="pt-24 lg:pt-28 pb-16 lg:pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Content */}
            <div>
              <MicroLabel className="mb-4 block">
                {isNL ? 'MAATWERK' : 'BESPOKE'}
              </MicroLabel>
              
              <h1 className="font-serif text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] text-foreground leading-[1.15] tracking-[-0.01em] mb-4 max-w-lg">
                {isNL 
                  ? "Van signatuur naar uw ruimte."
                  : "From signature to your space."
                }
              </h1>
              
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-5 max-w-md">
                {isNL 
                  ? "U start met richting. Wij vertalen het naar proportie, steen en detail — op maat gemaakt."
                  : "You start with direction. We translate it into proportion, stone and detail — made to measure."}
              </p>
              
              {/* Premium micro-tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  isNL ? 'Ontworpen in Nederland' : 'Designed in Netherlands',
                  isNL ? 'White-glove NL/BE' : 'White-glove NL/BE',
                  isNL ? '8–12 weken' : '8–12 weeks',
                  isNL ? '2 jaar garantie' : '2 year warranty',
                ].map((chip) => (
                  <span 
                    key={chip}
                    className="inline-flex items-center px-2.5 py-1 border border-foreground/12 text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* Single CTA */}
              <Button 
                variant="sera-primary" 
                size="default" 
                className="h-11 px-6"
                onClick={() => {
                  document.getElementById('atelier-flow')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {isNL ? 'Start uw project' : 'Start your project'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Right: Image */}
            <div className="relative">
              <div className="aspect-[4/5] lg:aspect-[5/6] bg-muted overflow-hidden border border-foreground/5">
                <img
                  src={bespokeHero}
                  alt={isNL ? "SERA NORR maatwerk natuursteen meubels" : "SERA NORR bespoke natural stone furniture"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-end">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  TERRA / VANTA — {isNL ? 'maatwerk voorbeelden' : 'bespoke examples'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: ATELIER FLOW (de funnel)
          ============================================ */}
      <section id="atelier-flow" className="py-16 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="max-w-xl mb-10">
            <MicroLabel className="mb-4 block">ATELIER FLOW</MicroLabel>
            <h2 className="font-serif text-display-sm text-foreground mb-3">
              {isNL ? "Stel uw stuk samen" : "Compose your piece"}
            </h2>
            <p className="text-body-md text-muted-foreground">
              {isNL 
                ? "Verzamel inspiratie. Kies specificaties. Bundel alles in één dossier."
                : "Gather inspiration. Choose specifications. Bundle everything in one dossier."}
            </p>
          </div>
          
          {/* Atelier Flow Component */}
          <AtelierFlow 
            isNL={isNL} 
            data={flowData} 
            onDataChange={handleFlowDataChange} 
          />
        </div>
      </section>

      {/* ============================================
          SECTION 3: PROJECT DOSSIER
          ============================================ */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: Dossier Preview */}
            <div>
              <div className="mb-6">
                <MicroLabel className="mb-3 block">
                  {isNL ? 'UW SELECTIE' : 'YOUR SELECTION'}
                </MicroLabel>
                <h2 className="font-serif text-display-sm text-foreground mb-2">
                  {isNL ? "Project Dossier" : "Project Dossier"}
                </h2>
                <p className="text-body-md text-muted-foreground">
                  {isNL 
                    ? "Uw keuzes, inspiratie en context — gebundeld tot één overzicht."
                    : "Your choices, inspiration and context — bundled into one overview."}
                </p>
              </div>
              
              <ProjectDossier 
                isNL={isNL} 
                data={flowData} 
                contactData={contactData}
              />
            </div>
            
            {/* Right: Submit Form */}
            <div id="submit-form">
              <div className="mb-6">
                <MicroLabel className="mb-3 block">
                  {isNL ? 'VERSTUUR' : 'SUBMIT'}
                </MicroLabel>
                <h2 className="font-serif text-display-sm text-foreground mb-2">
                  {isNL ? "Verstuur uw dossier" : "Submit your dossier"}
                </h2>
                <p className="text-body-md text-muted-foreground">
                  {isNL 
                    ? "Wij nemen contact op met vervolgstappen en werken een voorstel uit."
                    : "We will contact you with next steps and work out a proposal."}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    {isNL ? 'Naam *' : 'Name *'}
                  </label>
                  <Input
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    placeholder={isNL ? "Uw naam" : "Your name"}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    {isNL ? 'E-mail *' : 'Email *'}
                  </label>
                  <Input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder={isNL ? "uw@email.nl" : "your@email.com"}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    {isNL ? 'Telefoon (optioneel)' : 'Phone (optional)'}
                  </label>
                  <Input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="+31 6 ..."
                  />
                </div>
                
                {/* Submit button */}
                <div className="pt-4">
                  <Button 
                    type="submit"
                    variant="sera-primary" 
                    size="lg"
                    className="w-full h-12"
                    disabled={!isFlowComplete || isSubmitting}
                  >
                    {isSubmitting ? (
                      isNL ? "Verzenden..." : "Submitting..."
                    ) : (
                      <>
                        {isNL ? 'Vraag voorstel aan' : 'Request proposal'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  {!isFlowComplete && (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      {isNL 
                        ? "Vul eerst alle stappen in de Atelier Flow in"
                        : "First complete all steps in the Atelier Flow"}
                    </p>
                  )}
                </div>
                
                {/* Privacy disclaimer */}
                <p className="text-xs text-muted-foreground/70 text-center">
                  {isNL 
                    ? "Door te verzenden gaat u akkoord met ons privacybeleid."
                    : "By submitting you agree to our privacy policy."}
                </p>
              </form>
              
              {/* Completion indicators */}
              {isFlowComplete && (
                <div className="mt-8 p-4 bg-secondary/30 border border-foreground/8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                      <Check className="w-4 h-4 text-background" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isNL ? "Dossier compleet" : "Dossier complete"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isNL ? "Klaar om te verzenden" : "Ready to submit"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: FAQ (compact, at end)
          ============================================ */}
      <section className="py-16 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-10">
            <Hairline className="flex-1" />
            <MicroLabel>{isNL ? 'VEELGESTELDE VRAGEN' : 'FAQ'}</MicroLabel>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-0">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-foreground/8 first:border-t"
                >
                  <AccordionTrigger className="py-5 text-left font-serif text-lg hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: CLOSING CTA (minimal)
          ============================================ */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-display-sm text-foreground mb-4">
            {isNL ? "Vragen of liever persoonlijk contact?" : "Questions or prefer personal contact?"}
          </h2>
          <p className="text-body-md text-muted-foreground mb-6 max-w-md mx-auto">
            {isNL 
              ? "Neem gerust contact op. Wij denken graag mee."
              : "Feel free to get in touch. We're happy to help."}
          </p>
          <Button asChild variant="sera-secondary" size="default" className="h-11 px-6">
            <Link to="/contact">
              {isNL ? 'Neem contact op' : 'Get in touch'}
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Bespoke;
