import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { SEOHead, generateBreadcrumbSchema, generateFAQSchema } from "@/components/seo";
import { ArrowRight, Upload } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics";
import { BespokeTimeline, BespokeTimelineStep } from "@/components/ui/bespoke-timeline";
import { ProofGrid } from "@/components/ui/proof-grid";
import { Hairline } from "@/components/ui/hairline";
import { usePageTracking, useCTATracking } from "@/hooks/use-tracking";
import { trackFormStart, trackFormSubmit } from "@/lib/tracking";
import bespokeHero from "@/assets/bespoke-hero.png";

const Bespoke = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    dimensions: "",
    budget: "",
    message: "",
  });
  
  usePageTracking();
  const { trackProposal } = useCTATracking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackLeadSubmit('bespoke', { productType: formData.projectType });
    trackFormSubmit('bespoke');

    toast({
      title: t('bespoke.formSuccess'),
      description: t('bespoke.formSuccessDescription'),
    });
    setFormData({ name: "", email: "", phone: "", projectType: "", dimensions: "", budget: "", message: "" });
    setFileName(null);
  };
  
  const handleFormFocus = () => {
    trackFormStart('bespoke');
  };

  const seoTitle = isNL 
    ? "Maatwerk natuursteen meubels | SERA NORR Online Atelier"
    : "Bespoke Natural Stone Furniture | SERA NORR Online Atelier";

  const seoDescription = isNL
    ? "Maatwerk in travertin en marmer, afgestemd op uw ruimte. Intake, materiaalkeuze, visualisaties en levering/plaatsing. Prijs op aanvraag."
    : "Bespoke travertine and marble furniture tailored to your space. Intake, material selection, visualizations and delivery. Price on request.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Maatwerk' : 'Bespoke', url: '/bespoke' },
  ]);

  const faqItems = isNL ? [
    { question: 'Hoe werkt het traject?', answer: 'Na uw aanvraag plannen we een korte intake. We bespreken steenkeuze, afmetingen en afwerking. U ontvangt een visualisatie en offerte binnen 48 uur.' },
    { question: 'Hoe lang is de doorlooptijd?', answer: 'Gemiddeld 12-16 weken vanaf akkoord, afhankelijk van steenkeuze en complexiteit.' },
    { question: 'Welke materialen zijn mogelijk?', answer: 'Wij werken met travertin, Calacatta Viola marmer en geselecteerde natuurstenen.' },
    { question: 'Hoe werkt levering en plaatsing?', answer: 'White-glove levering in Nederland en België. Wij plaatsen het meubel op locatie en verwijderen alle verpakking.' },
    { question: 'Is er garantie?', answer: '5 jaar garantie op constructie en materiaal.' },
  ] : [
    { question: 'How does the process work?', answer: 'After your inquiry, we schedule a brief intake. We discuss stone choice, dimensions and finish. You receive a visualization and quote within 48 hours.' },
    { question: 'What is the lead time?', answer: 'Average 12-16 weeks from approval, depending on stone choice and complexity.' },
    { question: 'What materials are available?', answer: 'We work with travertine, Calacatta Viola marble and selected natural stones.' },
    { question: 'How does delivery work?', answer: 'White-glove delivery in the Netherlands and Belgium. We place the furniture on location and remove all packaging.' },
    { question: 'Is there a warranty?', answer: '5-year warranty on construction and materials.' },
  ];

  const faqSchema = generateFAQSchema(faqItems);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbSchema, faqSchema],
  };

  // Process steps - Bespoke Timeline
  const processSteps: BespokeTimelineStep[] = isNL ? [
    { number: '01', title: 'Consultatie', description: 'Vrijblijvend gesprek over uw wensen.', tag: 'Binnen 24 uur reactie' },
    { number: '02', title: 'Voorstel', description: 'Schetsen, materiaalopties en offerte.', tag: 'Binnen 48 uur' },
    { number: '03', title: 'Realisatie', description: 'Productie en white-glove plaatsing.', tag: '12–16 weken' },
  ] : [
    { number: '01', title: 'Consultation', description: 'No-obligation conversation about your wishes.', tag: 'Response within 24 hours' },
    { number: '02', title: 'Proposal', description: 'Sketches, material options and quote.', tag: 'Within 48 hours' },
    { number: '03', title: 'Realization', description: 'Production and white-glove installation.', tag: '12–16 weeks' },
  ];

  // Proof items
  const proofItems = isNL ? [
    { title: '5 jaar garantie', description: 'Op constructie en materiaal.' },
    { title: 'White-glove levering', description: 'Plaatsing op locatie.' },
    { title: 'Voorstel in 48 uur', description: 'Snel en persoonlijk.' },
    { title: 'Geen verplichtingen', description: 'Vrijblijvende intake.' },
  ] : [
    { title: '5 year warranty', description: 'On construction and materials.' },
    { title: 'White-glove delivery', description: 'Installation on location.' },
    { title: 'Proposal in 48 hours', description: 'Fast and personal.' },
    { title: 'No obligations', description: 'Non-binding intake.' },
  ];

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "SERA NORR, maatwerk natuursteenmeubels, online atelier, travertin tafel op maat, marmeren tafel" 
          : "SERA NORR, bespoke natural stone furniture, online atelier, custom travertine table, marble table"}
        structuredData={combinedSchema}
      />

      {/* HERO - Editorial Split with micro-label */}
      <section className="min-h-[90vh] flex items-center pt-20 lg:pt-0">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <p className="micro-label mb-6">
                {isNL ? 'Online atelier' : 'Online atelier'}
              </p>
              <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
                {isNL ? "Maatwerk in natuursteen" : "Bespoke in natural stone"}
              </h1>
              <p className="text-body-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                {isNL 
                  ? "Elk meubel op maat. Materiaal, afmetingen en afwerking stemmen we samen af."
                  : "Every piece made to measure. Material, dimensions and finish aligned together."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="sera-primary" size="lg">
                  <a href="#offerte" onClick={trackProposal}>
                    {isNL ? "Ontvang voorstel" : "Receive proposal"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="sera-secondary" size="lg">
                  <Link to="/collections">
                    {isNL ? "Bekijk collecties" : "View collections"}
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Image */}
            <div className="order-1 lg:order-2 image-reveal">
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                <img
                  src={bespokeHero}
                  alt={isNL ? "SERA NORR maatwerk natuursteen meubels" : "SERA NORR bespoke natural stone furniture"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAAROM - Proof Grid */}
      <section className="py-20 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <ProofGrid items={proofItems} className="max-w-6xl mx-auto" />
        </div>
      </section>

      {/* WERKWIJZE - Process Timeline */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Werkwijze' : 'Process'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground">
              {isNL ? "Van gesprek tot plaatsing" : "From conversation to installation"}
            </h2>
          </div>
          
          {/* Bespoke Timeline */}
          <div className="border-t border-b" style={{ borderColor: 'hsl(var(--foreground) / 0.08)' }}>
            <BespokeTimeline steps={processSteps} className="max-w-6xl mx-auto" />
          </div>
        </div>
      </section>

      {/* Editorial Statement */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-display-sm text-foreground leading-[1.2]">
              {isNL 
                ? "De steen bepaalt het karakter. Wij vertalen het naar uw ruimte."
                : "The stone defines the character. We translate it to your space."}
            </p>
          </div>
        </div>
      </section>

      {/* MATERIALEN - Editorial Split */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image placeholder */}
            <div className="aspect-[4/5] bg-secondary/30 flex items-center justify-center border" style={{ borderColor: 'hsl(var(--foreground) / 0.08)' }}>
              <div className="text-center p-8">
                <p className="font-serif text-2xl text-foreground mb-2">
                  {isNL ? "Travertin & marmer" : "Travertine & marble"}
                </p>
                <p className="text-body-sm text-muted-foreground">
                  {isNL ? "Geselecteerde steensoorten" : "Selected stone types"}
                </p>
              </div>
            </div>
            
            {/* Content */}
            <div>
              <p className="micro-label mb-6">
                {isNL ? 'Materialen' : 'Materials'}
              </p>
              <h2 className="font-serif text-display-sm text-foreground mb-5">
                {isNL ? "Steenkeuze op maat" : "Stone selection on request"}
              </h2>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-8 max-w-md">
                {isNL 
                  ? "Steenkeuze, afwerking en details stemmen we samen af tijdens de intake."
                  : "Stone choice, finish and details are aligned together during the intake."}
              </p>
              <Button asChild variant="sera-secondary" size="lg">
                <Link to="/materials">
                  {isNL ? "Bekijk materialen" : "View materials"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">FAQ</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mx-auto text-center mb-12">
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? "Veelgestelde vragen" : "Frequently asked questions"}
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-0">
              {faqItems.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index + 1}`} 
                  className="border-t bg-background px-0"
                  style={{ borderColor: 'hsl(var(--foreground) / 0.08)' }}
                >
                  <AccordionTrigger className="text-left font-serif text-lg hover:no-underline py-6 px-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-body-sm pb-6 px-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
              {/* Bottom border */}
              <div className="h-px" style={{ backgroundColor: 'hsl(var(--foreground) / 0.08)' }} />
            </Accordion>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="offerte" className="py-24 lg:py-32 bg-foreground text-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="micro-label text-background/50 mb-4">
                {isNL ? 'Offerte aanvragen' : 'Request quote'}
              </p>
              <h2 className="font-serif text-display-sm mb-4">
                {isNL ? 'Start uw project' : 'Start your project'}
              </h2>
              <p className="text-background/70 text-body-md">
                {isNL 
                  ? 'Voorstel met schetsen binnen 48 uur.'
                  : 'Proposal with sketches within 48 hours.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bespoke-name" className="block micro-label text-background/50 mb-3">
                    {t('bespoke.formName')} *
                  </label>
                  <Input
                    id="bespoke-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 h-12"
                    placeholder={t('bespoke.formNamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="bespoke-email" className="block micro-label text-background/50 mb-3">
                    {t('bespoke.formEmail')} *
                  </label>
                  <Input
                    id="bespoke-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 h-12"
                    placeholder={t('bespoke.formEmailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bespoke-phone" className="block micro-label text-background/50 mb-3">
                    {isNL ? 'Telefoon' : 'Phone'}
                  </label>
                  <Input
                    id="bespoke-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 h-12"
                    placeholder="+31 6 12345678"
                  />
                </div>
                <div>
                  <label className="block micro-label text-background/50 mb-3">
                    {t('bespoke.formProjectType')} *
                  </label>
                  <Select 
                    value={formData.projectType} 
                    onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                  >
                    <SelectTrigger className="bg-background/10 border-background/20 text-background focus:border-background/40 [&>span]:text-background/40 h-12">
                      <SelectValue placeholder={isNL ? 'Selecteer type' : 'Select type'} />
                    </SelectTrigger>
                    <SelectContent className="bg-foreground border-background/20">
                      <SelectItem value="side-table" className="text-background focus:bg-background/10">{isNL ? 'Bijzettafel' : 'Side table'}</SelectItem>
                      <SelectItem value="coffee-table" className="text-background focus:bg-background/10">{isNL ? 'Salontafel' : 'Coffee table'}</SelectItem>
                      <SelectItem value="dining-table" className="text-background focus:bg-background/10">{isNL ? 'Eettafel' : 'Dining table'}</SelectItem>
                      <SelectItem value="console" className="text-background focus:bg-background/10">{isNL ? 'Console' : 'Console'}</SelectItem>
                      <SelectItem value="other" className="text-background focus:bg-background/10">{isNL ? 'Anders' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="bespoke-dimensions" className="block micro-label text-background/50 mb-3">
                  {isNL ? 'Gewenste afmetingen' : 'Desired dimensions'}
                </label>
                <Input
                  id="bespoke-dimensions"
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 h-12"
                  placeholder={isNL ? 'bijv. L120 × B80 × H45 cm' : 'e.g. L120 × W80 × H45 cm'}
                />
              </div>

              <div>
                <label htmlFor="bespoke-message" className="block micro-label text-background/50 mb-3">
                  {t('bespoke.formVision')} *
                </label>
                <Textarea
                  id="bespoke-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 resize-none"
                  placeholder={isNL 
                    ? 'Beschrijf uw project, gewenste materialen, stijl en eventuele referentiebeelden...'
                    : 'Describe your project, desired materials, style and any reference images...'}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block micro-label text-background/50 mb-3">
                  {isNL ? 'Referentiebeelden (optioneel)' : 'Reference images (optional)'}
                </label>
                <div 
                  className="border border-dashed border-background/20 py-6 px-4 text-center cursor-pointer hover:border-background/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFileName(file.name);
                    }}
                  />
                  <Upload className="h-5 w-5 mx-auto mb-2 text-background/50" />
                  <p className="text-body-sm text-background/60">
                    {fileName || (isNL ? 'Klik om bestand te uploaden' : 'Click to upload file')}
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="sera-primary" 
                size="lg"
                className="w-full bg-background text-foreground hover:bg-background/95"
              >
                {isNL ? 'Verstuur aanvraag' : 'Submit request'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-center text-background/50 text-body-sm">
                {isNL 
                  ? 'U ontvangt binnen 24 uur een bevestiging.'
                  : 'You will receive a confirmation within 24 hours.'}
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bespoke;
