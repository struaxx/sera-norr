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
import { SEOHead, generateBreadcrumbSchema, generateFAQSchema, Breadcrumbs } from "@/components/seo";
import { ArrowRight, Upload, Phone, FileText, Eye, Package, Truck, Shield } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics";
import { BespokeTimeline, BespokeTimelineStep } from "@/components/ui/bespoke-timeline";
import { ProofGrid } from "@/components/ui/proof-grid";
import { Hairline, MicroLabel } from "@/components/ui/hairline";
import { usePageTracking, useCTATracking } from "@/hooks/use-tracking";
import { trackFormStart, trackFormSubmit } from "@/lib/tracking";
import bespokeHero from "@/assets/bespoke-hero.png";
import otherStonesMaterials from "@/assets/other-stones-materials.png";

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

  // Process steps for timeline
  const processSteps: BespokeTimelineStep[] = isNL ? [
    { number: '01', title: 'Consultatie', description: 'Vrijblijvend gesprek over uw wensen en ruimte.', tag: 'Binnen 24 uur reactie' },
    { number: '02', title: 'Voorstel & Offerte', description: 'Schetsen, materiaalopties en heldere offerte.', tag: 'Binnen 48 uur' },
    { number: '03', title: 'Materiaalselectie', description: 'Selecteer uw steenplaat aan de hand van foto\'s.', tag: 'Persoonlijk advies' },
  ] : [
    { number: '01', title: 'Consultation', description: 'No-obligation conversation about your wishes and space.', tag: 'Response within 24 hours' },
    { number: '02', title: 'Proposal & Quote', description: 'Sketches, material options and clear quote.', tag: 'Within 48 hours' },
    { number: '03', title: 'Material Selection', description: 'Select your stone slab based on photos.', tag: 'Personal advice' },
  ];

  // Proof items
  const proofItems = isNL ? [
    { title: 'Ontworpen in Nederland', description: 'Lokaal atelier.' },
    { title: '5 jaar garantie', description: 'Op constructie en materiaal.' },
    { title: 'White-glove levering', description: 'Plaatsing op locatie.' },
    { title: 'Maatwerk mogelijk', description: 'Afgestemd op uw ruimte.' },
  ] : [
    { title: 'Designed in the Netherlands', description: 'Local atelier.' },
    { title: '5 year warranty', description: 'On construction and materials.' },
    { title: 'White-glove delivery', description: 'Installation on location.' },
    { title: 'Bespoke possible', description: 'Tailored to your space.' },
  ];

  // Use case cards
  const useCases = isNL ? [
    { title: 'Naast de bank', description: 'Compact statement, subtiel aanwezig.', format: 'Ø45 × H55', material: 'Travertin' },
    { title: 'Voor de zithoek', description: 'Rustige basis voor dagelijkse momenten.', format: 'L120 × B80', material: 'Travertin' },
    { title: 'In de hal', description: 'Architecturale lijn met verfijnde details.', format: 'L160 × B45', material: 'Marmer' },
    { title: 'Als centerpiece', description: 'Gemaakt om samen te komen.', format: 'L200 × B100', material: 'Travertin' },
  ] : [
    { title: 'Next to the sofa', description: 'Compact statement, subtly present.', format: 'Ø45 × H55', material: 'Travertine' },
    { title: 'For the seating area', description: 'Calm base for daily moments.', format: 'L120 × W80', material: 'Travertine' },
    { title: 'In the hallway', description: 'Architectural lines with refined details.', format: 'L160 × W45', material: 'Marble' },
    { title: 'As centerpiece', description: 'Made to gather around.', format: 'L200 × W100', material: 'Travertine' },
  ];

  // "Wat u ontvangt" items
  const deliverables = isNL ? [
    { icon: Eye, title: '3D-visualisaties', description: 'Uw ontwerp in realistische renders.' },
    { icon: Package, title: 'Materiaalmonsters', description: 'Voel de steen voor u beslist.' },
    { icon: Truck, title: 'White-glove levering', description: 'Professionele plaatsing inbegrepen.' },
    { icon: Shield, title: '5 jaar garantie', description: 'Op constructie en materiaal.' },
  ] : [
    { icon: Eye, title: '3D visualizations', description: 'Your design in realistic renders.' },
    { icon: Package, title: 'Material samples', description: 'Feel the stone before you decide.' },
    { icon: Truck, title: 'White-glove delivery', description: 'Professional installation included.' },
    { icon: Shield, title: '5 year warranty', description: 'On construction and materials.' },
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

      {/* Breadcrumb utility line */}
      <div className="pt-24 lg:pt-28 pb-4">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs />
        </div>
      </div>

      {/* ============================================
          1) HERO SECTION — Editorial 2-column grid
          ============================================ */}
      <section className="pb-20 lg:pb-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left: Content column */}
            <div className="order-2 lg:order-1 lg:col-span-5 lg:pt-4">
              <MicroLabel className="mb-4 block">
                {isNL ? 'MAATWERK ATELIER' : 'BESPOKE ATELIER'}
              </MicroLabel>
              
              {/* H1 with controlled typography */}
              <h1 className="font-serif text-[1.875rem] sm:text-[2.25rem] lg:text-[2.5rem] text-foreground leading-[1.15] tracking-[-0.01em] mb-4 max-w-md">
                {isNL 
                  ? "Maatwerk in natuursteen — ontworpen voor uw ruimte"
                  : "Bespoke natural stone — designed for your space"
                }
              </h1>
              
              <p className="text-base text-muted-foreground leading-relaxed mb-5 max-w-sm">
                {isNL 
                  ? "Van eerste schets tot plaatsing. Een zorgvuldig traject met materiaalkeuze, visualisaties en white-glove levering."
                  : "From first sketch to installation. A careful process with material selection, visualizations and white-glove delivery."}
              </p>
              
              {/* Premium micro-tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  isNL ? 'Prijs op aanvraag' : 'Price on request',
                  isNL ? '12–16 weken' : '12–16 weeks',
                  isNL ? '5 jaar garantie' : '5 year warranty',
                ].map((chip) => (
                  <span 
                    key={chip}
                    className="inline-flex items-center px-2.5 py-1 border border-foreground/12 text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* CTA rail */}
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <Button asChild variant="sera-primary" size="default" className="h-11 px-6">
                  <a href="#offerte" onClick={trackProposal}>
                    {isNL ? 'Ontvang voorstel' : 'Get proposal'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="sera-secondary" size="default" className="h-11 px-6">
                  <Link to="/contact">
                    {isNL ? 'Plan gesprek' : 'Schedule call'}
                  </Link>
                </Button>
              </div>
              
              {/* Micro-note */}
              <p className="text-xs text-muted-foreground/70">
                {isNL ? 'Reactie binnen 48 uur — geen verplichtingen.' : 'Response within 48 hours — no obligations.'}
              </p>
            </div>
            
            {/* Right: Image column */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="relative">
                <div className="aspect-[4/5] lg:aspect-[5/6] bg-muted overflow-hidden border border-foreground/5">
                  <img
                    src={bespokeHero}
                    alt={isNL ? "SERA NORR maatwerk natuursteen meubels" : "SERA NORR bespoke natural stone furniture"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Editorial caption */}
                <div className="mt-3 flex items-center justify-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    TERRA / VANTA — {isNL ? 'maatwerk voorbeelden' : 'bespoke examples'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          2) INTRO SECTION
          ============================================ */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <Hairline className="mb-12" />
          <div className="max-w-3xl">
            <h2 className="font-serif text-display-sm text-foreground mb-5">
              {isNL 
                ? "Online atelier voor maatwerk natuursteenmeubels"
                : "Online atelier for bespoke natural stone furniture"}
            </h2>
            <p className="text-body-lg text-muted-foreground leading-relaxed">
              {isNL 
                ? "SERA NORR is een online atelier voor maatwerk meubels in natuursteen (travertin, marmer en geselecteerde steensoorten). Steenkeuze en afwerking stemmen we samen af tijdens de intake."
                : "SERA NORR is an online atelier for bespoke furniture in natural stone (travertine, marble and selected stone types). Stone choice and finish are aligned together during the intake."}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          3) PROOF GRID (4 kernpunten)
          ============================================ */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <ProofGrid items={proofItems} className="max-w-6xl mx-auto" />
        </div>
      </section>

      {/* ============================================
          4) MAATWERK OP AANVRAAG
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-12 lg:mb-16">
            <Hairline className="flex-1" />
            <MicroLabel>{isNL ? 'MAATWERK' : 'BESPOKE'}</MicroLabel>
            <Hairline className="flex-1" />
          </div>
          
          <div className="max-w-3xl">
            <h2 className="font-serif text-display-sm text-foreground mb-5">
              {isNL ? "Maatwerk op aanvraag" : "Bespoke on request"}
            </h2>
            <p className="text-body-lg text-muted-foreground leading-relaxed mb-5">
              {isNL 
                ? "Elke SERA NORR piece wordt op maat gemaakt. Materiaal, maatvoering, randafwerking, onderstel en levering/plaatsing bepalen de uiteindelijke prijs. Na een korte intake ontvang je een voorstel op maat."
                : "Every SERA NORR piece is made to measure. Material, dimensions, edge finish, base and delivery/installation determine the final price. After a short intake you receive a tailored proposal."}
            </p>
            <p className="text-body-md text-foreground/80 font-medium">
              {isNL 
                ? "Prijs op aanvraag — op basis van steenkeuze, maatvoering, afwerking en levering/plaatsing."
                : "Price on request — based on stone choice, dimensions, finish and delivery/installation."}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          5) USE CASES (Editorial Matrix)
          ============================================ */}
      <section className="py-20 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/8">
            {useCases.map((item, index) => (
              <div 
                key={index} 
                className="bg-background p-8 lg:p-10"
              >
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed mb-5">
                  {item.description}
                </p>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
                    {isNL ? 'Voorbeeldformaat' : 'Example'}: {item.format}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
                    {item.material}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA + Footnote */}
          <div className="mt-12">
            <div className="flex flex-wrap gap-3 mb-5">
              <Button asChild variant="sera-primary" size="default" className="h-11 px-6">
                <a href="#offerte">
                  {isNL ? 'Ontvang voorstel binnen 48 uur' : 'Receive proposal within 48 hours'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="sera-secondary" size="default" className="h-11 px-6">
                <Link to="/collections">
                  {isNL ? 'Bekijk voorbeelden' : 'View examples'}
                </Link>
              </Button>
            </div>
            <p className="text-body-sm text-muted-foreground max-w-xl">
              {isNL 
                ? "Calacatta Viola & zeldzame steensoorten op aanvraag. Prijzen excl. btw. Levering & plaatsing afhankelijk van locatie."
                : "Calacatta Viola & rare stone types on request. Prices excl. VAT. Delivery & installation depending on location."}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          6) DONKERE CTA BAND
          ============================================ */}
      <section className="py-20 lg:py-24 bg-foreground">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-display-sm text-background mb-4">
              {isNL ? "Vertaal dit naar uw ruimte." : "Translate this to your space."}
            </h2>
            <p className="text-body-lg text-background/70 mb-7">
              {isNL 
                ? "Deel uw afmetingen en voorkeuren — wij maken een voorstel op maat."
                : "Share your dimensions and preferences — we create a tailored proposal."}
            </p>
            <Button asChild variant="sera-primary" size="default" className="bg-background text-foreground hover:bg-background/95 h-11 px-6">
              <a href="#offerte">
                {isNL ? 'Ontvang voorstel' : 'Receive proposal'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================
          7) MATERIALEN & AFWERKING
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="aspect-[4/5] bg-muted overflow-hidden">
              <img
                src={otherStonesMaterials}
                alt={isNL ? "Natuursteen materialen" : "Natural stone materials"}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div>
              <MicroLabel className="mb-4 block">
                {isNL ? 'MATERIALEN' : 'MATERIALS'}
              </MicroLabel>
              <h2 className="font-serif text-display-sm text-foreground mb-4">
                {isNL ? "Materialen & afwerking" : "Materials & finish"}
              </h2>
              <p className="text-body-lg text-muted-foreground leading-relaxed mb-7 max-w-md">
                {isNL 
                  ? "Steenkeuze, afwerking en details stemmen we samen af tijdens de intake. U ontvangt advies op basis van uw ruimte en gebruik."
                  : "Stone choice, finish and details are aligned together during the intake. You receive advice based on your space and usage."}
              </p>
              <Button asChild variant="sera-secondary" size="default" className="h-11 px-6">
                <Link to="/materials">
                  {isNL ? "Bekijk een selectie stenen" : "View a selection of stones"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          8) TRAJECT / TIMELINE + WAT U ONTVANGT
          ============================================ */}
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-12 lg:mb-16">
            <Hairline className="flex-1" />
            <MicroLabel>{isNL ? 'HET TRAJECT' : 'THE PROCESS'}</MicroLabel>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-lg mb-12">
            <h2 className="font-serif text-display-sm text-foreground mb-3">
              {isNL ? "Van idee tot realisatie" : "From idea to realization"}
            </h2>
            <p className="text-body-md text-muted-foreground">
              {isNL 
                ? "Ons traject is ontworpen voor maximale transparantie en een soepele ervaring."
                : "Our process is designed for maximum transparency and a smooth experience."}
            </p>
          </div>
          
          {/* Timeline with side panel layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Timeline (2 cols) */}
            <div className="lg:col-span-2 border-t border-b border-foreground/8">
              <BespokeTimeline steps={processSteps} className="max-w-full" />
            </div>
            
            {/* Side panel: Wat u ontvangt */}
            <div className="relative border border-foreground/8 p-8 lg:p-10 bg-background">
              <MicroLabel className="mb-5 block">
                {isNL ? 'WAT U ONTVANGT' : 'WHAT YOU RECEIVE'}
              </MicroLabel>
              <div className="space-y-5">
                {deliverables.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <item.icon className="h-5 w-5 text-foreground/40 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-serif text-base text-foreground mb-1">{item.title}</h4>
                      <p className="text-body-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          9) HOE WILT U BEGINNEN? (Two panels)
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Lead time note */}
          <p className="text-body-sm text-muted-foreground mb-6">
            {isNL 
              ? "Gemiddelde doorlooptijd: 12–16 weken (afhankelijk van steenkeuze en locatie)"
              : "Average lead time: 12–16 weeks (depending on stone choice and location)"}
          </p>
          
          <div className="max-w-lg mb-10">
            <h2 className="font-serif text-display-sm text-foreground mb-3">
              {isNL ? "Hoe wilt u beginnen?" : "How would you like to start?"}
            </h2>
            <p className="text-body-md text-muted-foreground">
              {isNL 
                ? "Kies de aanpak die bij u past. Alle opties zijn vrijblijvend."
                : "Choose the approach that suits you. All options are non-binding."}
            </p>
          </div>
          
          {/* Two bespoke panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/8 max-w-4xl">
            {/* Option 1: Vrijblijvend gesprek */}
            <div className="bg-background p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-5">
                <Phone className="h-5 w-5 text-foreground/40" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                {isNL ? "Vrijblijvend gesprek" : "Free consultation"}
              </h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed mb-3">
                {isNL 
                  ? "Telefonisch of via videocall. Binnen 2 werkdagen reactie."
                  : "By phone or video call. Response within 2 business days."}
              </p>
              <p className="text-xs text-muted-foreground/70 mb-7">
                {isNL 
                  ? "Geschikt als u nog twijfelt over formaat of steensoort."
                  : "Suitable if you're still unsure about size or stone type."}
              </p>
              <Button asChild variant="sera-secondary" size="default" className="w-full justify-center h-11">
                <Link to="/contact">
                  {isNL ? 'Plan een gesprek' : 'Schedule a call'}
                </Link>
              </Button>
            </div>
            
            {/* Option 2: Offerte aanvragen (meest gekozen) */}
            <div className="bg-background p-8 lg:p-10 relative">
              <div className="absolute top-4 right-4">
                <span className="inline-block px-2.5 py-1 bg-foreground text-background text-[9px] uppercase tracking-[0.15em]">
                  {isNL ? 'Meest gekozen' : 'Most popular'}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <FileText className="h-5 w-5 text-foreground/40" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                {isNL ? "Offerte aanvragen" : "Request a quote"}
              </h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed mb-3">
                {isNL 
                  ? "Binnen 48 uur een voorstel met schetsen en offerte."
                  : "Within 48 hours a proposal with sketches and quote."}
              </p>
              <p className="text-xs text-muted-foreground/70 mb-7">
                {isNL 
                  ? "Geschikt als u al een richting of maat in gedachten heeft."
                  : "Suitable if you already have a direction or size in mind."}
              </p>
              <Button asChild variant="sera-primary" size="default" className="w-full justify-center h-11">
                <a href="#offerte">
                  {isNL ? 'Vraag offerte aan' : 'Request a quote'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Micro line */}
          <p className="text-body-sm text-muted-foreground mt-7">
            {isNL 
              ? "Online atelier — materiaalkeuze en details stemmen we samen af. Geen verplichtingen."
              : "Online atelier — material choice and details are aligned together. No obligations."}
          </p>
        </div>
      </section>

      {/* ============================================
          10) INSPIRATIE / LOOKBOOK
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-12 lg:mb-16">
            <Hairline className="flex-1" />
            <MicroLabel>{isNL ? 'INSPIRATIE' : 'INSPIRATION'}</MicroLabel>
            <Hairline className="flex-1" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="max-w-md">
              <h2 className="font-serif text-display-sm text-foreground mb-4">
                {isNL ? "Voorbeelden uit het atelier" : "Examples from the atelier"}
              </h2>
              <p className="text-body-lg text-muted-foreground leading-relaxed mb-8">
                {isNL 
                  ? "Ontvang toegang tot het lookbook — een selectie gerealiseerde projecten en materiaalcombinaties ter inspiratie."
                  : "Gain access to the lookbook — a selection of realized projects and material combinations for inspiration."}
              </p>
              <Button asChild variant="sera-primary" size="default" className="h-11 px-6">
                <Link to="/lookbook">
                  {isNL ? 'Bekijk online voorbeelden' : 'View online examples'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Right: Visual module */}
            <div className="relative">
              <div className="aspect-[4/3] bg-secondary/50 border border-foreground/8 flex items-center justify-center">
                <div className="text-center p-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 block mb-3">
                    {isNL ? 'ATELIER SELECTIE' : 'ATELIER SELECTION'}
                  </span>
                  <p className="font-serif text-xl text-foreground/80">
                    {isNL ? 'Terra · Vanta · Maatwerk' : 'Terra · Vanta · Bespoke'}
                  </p>
                </div>
              </div>
              {/* Caption rail */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  {isNL ? 'Gerealiseerde projecten' : 'Realized projects'}
                </span>
                <Hairline className="flex-1 mx-4" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          11) ONDERHOUD & BESCHERMING
          ============================================ */}
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-12 lg:mb-16">
            <Hairline className="flex-1" />
            <MicroLabel>{isNL ? 'ONDERHOUD' : 'CARE'}</MicroLabel>
            <Hairline className="flex-1" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Content + bullets + CTAs */}
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-4">
                {isNL ? "Onderhoud & bescherming" : "Care & protection"}
              </h2>
              <p className="text-body-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                {isNL 
                  ? "Natuursteen blijft het mooist met de juiste bescherming en eenvoudig onderhoud. Wij adviseren wat past bij uw gebruik en kunnen bescherming meenemen in het voorstel."
                  : "Natural stone stays most beautiful with the right protection and simple maintenance. We advise what suits your usage and can include protection in the proposal."}
              </p>
              
              {/* Bullets with hairline separators */}
              <div className="space-y-0 border-t border-foreground/8 mb-10">
                {[
                  isNL ? 'Vlekbescherming & impregnatie' : 'Stain protection & impregnation',
                  isNL ? 'Eenvoudige dagelijkse care' : 'Simple daily care',
                  isNL ? 'Langdurige schoonheid' : 'Long-lasting beauty',
                ].map((bullet, index) => (
                  <div key={index} className="py-4 border-b border-foreground/8 flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 w-5">
                      0{index + 1}
                    </span>
                    <span className="text-body-md text-foreground">{bullet}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA rail */}
              <div className="flex flex-wrap items-center gap-4">
                <Button asChild variant="sera-primary" size="default" className="h-11 px-6">
                  <Link to="/care">
                    {isNL ? 'Lees over care' : 'Read about care'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="sera-secondary" size="default" className="h-11 px-6">
                  <Link to="/voorstel">
                    {isNL ? 'Ontvang voorstel' : 'Get proposal'}
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right: Visual module with stone texture feel */}
            <div className="relative hidden lg:block">
              <div className="aspect-square bg-gradient-to-br from-secondary/80 to-secondary/30 border border-foreground/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="h-10 w-10 text-foreground/20 mx-auto mb-4" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 block">
                      {isNL ? '5 jaar garantie' : '5 year warranty'}
                    </span>
                  </div>
                </div>
              </div>
              {/* Caption */}
              <div className="mt-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  {isNL ? 'Bescherming inbegrepen op aanvraag' : 'Protection included on request'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          12) FAQ Section
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-12 lg:mb-16">
            <Hairline className="flex-1" />
            <MicroLabel>{isNL ? 'VEELGESTELDE VRAGEN' : 'FAQ'}</MicroLabel>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-lg mb-10">
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? "Alles over ons maatwerkproces" : "Everything about our bespoke process"}
            </h2>
          </div>

          <div className="max-w-2xl">
            <Accordion type="single" collapsible className="space-y-0">
              {faqItems.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index + 1}`} 
                  className="border-t border-foreground/8 bg-background/50 px-0"
                >
                  <AccordionTrigger className="text-left font-serif text-lg hover:no-underline py-5 px-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-body-sm pb-5 px-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
              {/* Bottom border */}
              <div className="h-px bg-foreground/8" />
            </Accordion>
          </div>
        </div>
      </section>

      {/* ============================================
          INQUIRY FORM
          ============================================ */}
      <section id="offerte" className="py-24 lg:py-32 bg-foreground text-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl">
            {/* Header */}
            <div className="mb-10">
              <MicroLabel className="text-background/50 mb-4 block">
                {isNL ? 'OFFERTE AANVRAGEN' : 'REQUEST QUOTE'}
              </MicroLabel>
              <h2 className="font-serif text-display-sm mb-3">
                {isNL ? 'Start uw project' : 'Start your project'}
              </h2>
              <p className="text-background/70 text-body-md">
                {isNL 
                  ? 'Voorstel met schetsen binnen 48 uur.'
                  : 'Proposal with sketches within 48 hours.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="bespoke-name" className="block text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">
                    {t('bespoke.formName')} *
                  </label>
                  <Input
                    id="bespoke-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 h-11"
                    placeholder={t('bespoke.formNamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="bespoke-email" className="block text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">
                    {t('bespoke.formEmail')} *
                  </label>
                  <Input
                    id="bespoke-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 h-11"
                    placeholder={t('bespoke.formEmailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="bespoke-phone" className="block text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">
                    {isNL ? 'Telefoon' : 'Phone'}
                  </label>
                  <Input
                    id="bespoke-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 h-11"
                    placeholder="+31 6 12345678"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">
                    {t('bespoke.formProjectType')} *
                  </label>
                  <Select 
                    value={formData.projectType} 
                    onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                  >
                    <SelectTrigger className="bg-background/10 border-background/20 text-background focus:border-background/40 [&>span]:text-background/40 h-11">
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
                <label htmlFor="bespoke-dimensions" className="block text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">
                  {isNL ? 'Gewenste afmetingen' : 'Desired dimensions'}
                </label>
                <Input
                  id="bespoke-dimensions"
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-background/40 h-11"
                  placeholder={isNL ? 'bijv. L120 × B80 × H45 cm' : 'e.g. L120 × W80 × H45 cm'}
                />
              </div>

              <div>
                <label htmlFor="bespoke-message" className="block text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">
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
                <label className="block text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">
                  {isNL ? 'Referentiebeelden (optioneel)' : 'Reference images (optional)'}
                </label>
                <div 
                  className="border border-dashed border-background/20 py-5 px-4 cursor-pointer hover:border-background/40 transition-colors"
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
                  <p className="text-body-sm text-background/60 text-center">
                    {fileName || (isNL ? 'Klik om bestand te uploaden' : 'Click to upload file')}
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="sera-primary" 
                size="default"
                className="w-full bg-background text-foreground hover:bg-background/95 h-11"
              >
                {isNL ? 'Verstuur aanvraag' : 'Submit request'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-background/50 text-body-sm">
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
