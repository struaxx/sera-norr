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
import { PremiumTimeline, TimelineStep } from "@/components/ui/premium-timeline";
import { SectionBand, SectionHeader } from "@/components/ui/section-band";
import { TrustBand } from "@/components/ui/trust-band";
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

  // Process steps
  const processSteps: TimelineStep[] = isNL ? [
    { number: '01', title: 'Consultatie', description: 'Vrijblijvend gesprek over uw wensen.', detail: 'Binnen 24 uur reactie' },
    { number: '02', title: 'Voorstel', description: 'Schetsen, materiaalopties en offerte.', detail: 'Binnen 48 uur' },
    { number: '03', title: 'Realisatie', description: 'Productie en white-glove plaatsing.', detail: '12–16 weken' },
  ] : [
    { number: '01', title: 'Consultation', description: 'No-obligation conversation about your wishes.', detail: 'Response within 24 hours' },
    { number: '02', title: 'Proposal', description: 'Sketches, material options and quote.', detail: 'Within 48 hours' },
    { number: '03', title: 'Realization', description: 'Production and white-glove installation.', detail: '12–16 weeks' },
  ];

  // Trust items
  const trustItems = isNL ? [
    { text: '5 jaar garantie' },
    { text: 'White-glove levering' },
    { text: 'Voorstel in 48 uur' },
    { text: 'Geen verplichtingen' },
  ] : [
    { text: '5 year warranty' },
    { text: 'White-glove delivery' },
    { text: 'Proposal in 48 hours' },
    { text: 'No obligations' },
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

      {/* Hero - Editorial Split */}
      <section className="min-h-[85vh] flex items-center pt-20 lg:pt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <p className="text-eyebrow uppercase text-muted-foreground mb-4">
                {isNL ? 'Online atelier' : 'Online atelier'}
              </p>
              <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
                {isNL ? "Maatwerk in natuursteen" : "Bespoke in natural stone"}
              </h1>
              <p className="text-body-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                {isNL 
                  ? "Elk meubel wordt op maat gemaakt. Materiaal, afmetingen en afwerking stemmen we samen af."
                  : "Every piece is made to measure. Material, dimensions and finish are aligned together."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="atelier-filled" size="lg">
                  <a href="#offerte" onClick={trackProposal}>
                    {isNL ? "Ontvang voorstel" : "Receive proposal"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="lg">
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

      {/* Trust Band */}
      <TrustBand items={trustItems} />

      {/* Process Timeline */}
      <SectionBand variant="default" size="lg">
        <SectionHeader
          eyebrow={isNL ? 'Werkwijze' : 'Process'}
          title={isNL ? "Van gesprek tot plaatsing" : "From conversation to installation"}
          centered
        />
        <PremiumTimeline steps={processSteps} className="max-w-5xl mx-auto" />
      </SectionBand>

      {/* Editorial Statement */}
      <SectionBand variant="sand" size="md">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-display-sm text-foreground leading-[1.2]">
            {isNL 
              ? "De steen bepaalt het karakter. Wij vertalen het naar uw ruimte."
              : "The stone defines the character. We translate it to your space."}
          </p>
        </div>
      </SectionBand>

      {/* Materials CTA - Editorial Split */}
      <SectionBand variant="default" size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/5] bg-secondary/30 flex items-center justify-center">
            <div className="text-center p-8">
              <p className="font-serif text-2xl text-foreground mb-2">
                {isNL ? "Travertin & marmer" : "Travertine & marble"}
              </p>
              <p className="text-body-sm text-muted-foreground">
                {isNL ? "Geselecteerde steensoorten" : "Selected stone types"}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-eyebrow uppercase text-muted-foreground mb-4">
              {isNL ? 'Materialen' : 'Materials'}
            </p>
            <h2 className="font-serif text-display-sm text-foreground mb-5">
              {isNL ? "Steenkeuze op maat" : "Stone selection on request"}
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-8">
              {isNL 
                ? "Steenkeuze, afwerking en details stemmen we samen af tijdens de intake. U ontvangt advies op basis van uw ruimte en gebruik."
                : "Stone choice, finish and details are aligned together during the intake. You receive advice based on your space and use."}
            </p>
            <Button asChild variant="atelier" size="lg">
              <Link to="/materials">
                {isNL ? "Bekijk materialen" : "View materials"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </SectionBand>

      {/* FAQ Section */}
      <SectionBand variant="cream" size="lg">
        <SectionHeader
          eyebrow={isNL ? 'FAQ' : 'FAQ'}
          title={isNL ? "Veelgestelde vragen" : "Frequently asked questions"}
          centered
          size="sm"
        />

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`} className="border border-border/40 px-6 bg-background">
                <AccordionTrigger className="text-left font-serif text-lg hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-body-sm pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionBand>

      {/* Inquiry Form */}
      <section id="offerte" className="py-20 lg:py-28 bg-foreground text-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl mx-auto">
            <header className="text-center mb-10">
              <p className="text-eyebrow uppercase text-background/60 mb-4">
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
            </header>

            <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="bespoke-name" className="block text-eyebrow uppercase text-background/60 mb-2">
                    {t('bespoke.formName')} *
                  </label>
                  <Input
                    id="bespoke-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40"
                    placeholder={t('bespoke.formNamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="bespoke-email" className="block text-eyebrow uppercase text-background/60 mb-2">
                    {t('bespoke.formEmail')} *
                  </label>
                  <Input
                    id="bespoke-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40"
                    placeholder={t('bespoke.formEmailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="bespoke-phone" className="block text-eyebrow uppercase text-background/60 mb-2">
                    {isNL ? 'Telefoon' : 'Phone'}
                  </label>
                  <Input
                    id="bespoke-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40"
                    placeholder="+31 6 12345678"
                  />
                </div>
                <div>
                  <label className="block text-eyebrow uppercase text-background/60 mb-2">
                    {t('bespoke.formProjectType')} *
                  </label>
                  <Select 
                    value={formData.projectType} 
                    onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                  >
                    <SelectTrigger className="bg-background/10 border-background/20 text-background focus:border-background/40 [&>span]:text-background/40">
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
                <label htmlFor="bespoke-dimensions" className="block text-eyebrow uppercase text-background/60 mb-2">
                  {isNL ? 'Gewenste afmetingen' : 'Desired dimensions'}
                </label>
                <Input
                  id="bespoke-dimensions"
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40"
                  placeholder={isNL ? 'bijv. L120 × B80 × H45 cm' : 'e.g. L120 × W80 × H45 cm'}
                />
              </div>

              <div>
                <label htmlFor="bespoke-message" className="block text-eyebrow uppercase text-background/60 mb-2">
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
                    ? 'Beschrijf uw wensen: materiaalvoorkeuren, stijl, ruimte...'
                    : 'Describe your wishes: material preferences, style, space...'}
                />
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-background/20 text-background/60 hover:border-background/40 transition-all text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {fileName || (isNL ? 'Upload inspiratie (optioneel)' : 'Upload inspiration (optional)')}
                </button>
              </div>

              <Button type="submit" variant="outline" size="lg" className="w-full border-background/30 text-background hover:bg-background hover:text-foreground">
                {isNL ? 'Verstuur aanvraag' : 'Submit request'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-background/50 text-center">
                {isNL ? 'Reactie binnen 48 uur. Geen verplichtingen.' : 'Response within 48 hours. No obligations.'}
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bespoke;