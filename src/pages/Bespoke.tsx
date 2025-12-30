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
import { TrustBadges, BespokeTimeline, USPBullets } from "@/components/trust";
import { ArrowRight, FileText, MessageSquare, Upload } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics";
import BespokeHero from "@/components/bespoke/BespokeHero";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track lead submission
    trackLeadSubmit('bespoke', {
      productType: formData.projectType,
    });

    toast({
      title: t('bespoke.formSuccess'),
      description: t('bespoke.formSuccessDescription'),
    });
    setFormData({ name: "", email: "", phone: "", projectType: "", dimensions: "", budget: "", message: "" });
    setFileName(null);
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

  // FAQ items for structured data and on-page content
  const faqItems = isNL ? [
    { question: 'Hoe werkt het traject?', answer: 'Na uw aanvraag plannen we een korte intake (telefonisch of video). We bespreken steenkeuze, afmetingen en afwerking. U ontvangt een visualisatie en offerte binnen 48 uur.' },
    { question: 'Hoe lang is de doorlooptijd?', answer: 'Gemiddeld 13-15 weken vanaf akkoord, afhankelijk van steenkeuze en complexiteit. Travertin is doorgaans sneller beschikbaar dan zeldzame marmersoorten.' },
    { question: 'Welke materialen zijn mogelijk?', answer: 'Wij werken met travertin, Calacatta Viola marmer en geselecteerde natuurstenen. Steenkeuze stemmen we af op uw ruimte, gebruik en esthetische voorkeur.' },
    { question: 'Hoe werkt levering en plaatsing?', answer: 'White-glove levering in Nederland en België. Wij plaatsen het meubel op locatie en verwijderen alle verpakking. Buitenland in overleg.' },
    { question: 'Is er garantie?', answer: 'Ja, 5 jaar garantie op constructie en materiaal. Natuursteen is duurzaam en gaat bij goed onderhoud generaties mee.' },
    { question: 'Hoe onderhoud ik natuursteen?', answer: 'Regelmatig reinigen met een vochtige doek. Wij leveren onderhoudsadvies op maat. Bij levering ontvangt u een verzorgingsset.' },
    { question: 'Wat kost een maatwerk meubel?', answer: 'De prijs hangt af van steenkeuze, afmetingen, afwerking en levering. Na intake ontvangt u een heldere offerte zonder verplichtingen.' },
    { question: 'Kan ik het ontwerp aanpassen?', answer: 'Absoluut. Elke tafel, console of bijzettafel wordt op maat gemaakt. U bepaalt vorm, maat, randafwerking en onderstel.' },
  ] : [
    { question: 'How does the process work?', answer: 'After your inquiry, we schedule a brief intake (phone or video). We discuss stone choice, dimensions and finish. You receive a visualization and quote within 48 hours.' },
    { question: 'What is the lead time?', answer: 'Average 13-15 weeks from approval, depending on stone choice and complexity. Travertine is typically available faster than rare marbles.' },
    { question: 'What materials are available?', answer: 'We work with travertine, Calacatta Viola marble and selected natural stones. Stone selection is tailored to your space, use and aesthetic preference.' },
    { question: 'How does delivery and installation work?', answer: 'White-glove delivery in the Netherlands and Belgium. We place the furniture on location and remove all packaging. International on request.' },
    { question: 'Is there a warranty?', answer: 'Yes, 5-year warranty on construction and materials. Natural stone is durable and lasts generations with proper care.' },
    { question: 'How do I care for natural stone?', answer: 'Clean regularly with a damp cloth. We provide tailored care advice. Upon delivery you receive a care kit.' },
    { question: 'What does a bespoke piece cost?', answer: 'Price depends on stone choice, dimensions, finish and delivery. After intake you receive a clear quote with no obligations.' },
    { question: 'Can I customize the design?', answer: 'Absolutely. Every table, console or side table is made to measure. You determine shape, size, edge finish and base.' },
  ];

  const faqSchema = generateFAQSchema(faqItems);

  // Combined structured data
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbSchema,
      faqSchema,
      {
        '@type': 'Service',
        '@id': 'https://sera-norr.com/bespoke/#service',
        name: isNL ? 'Maatwerk natuursteen meubels' : 'Bespoke natural stone furniture',
        description: isNL 
          ? 'SERA NORR is een online atelier voor maatwerk meubels in natuursteen (travertin, marmer en geselecteerde steensoorten). Steenkeuze en afwerking stemmen we samen af tijdens de intake.'
          : 'SERA NORR is an online atelier for bespoke natural stone furniture (travertine, marble and selected stones). Stone choice and finish are coordinated together during the intake.',
        provider: {
          '@id': 'https://sera-norr.com/#organization',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Netherlands',
        },
        serviceType: 'Bespoke furniture design and manufacturing',
      },
    ],
  };

  // Use-case inspiration items (editorial style, no per-item CTAs)
  const inspirationItems = [
    {
      title: isNL ? 'Naast de bank' : 'Beside the sofa',
      line: isNL ? 'Compact statement, subtiel aanwezig.' : 'Compact statement, subtly present.',
      spec: 'Ø45 × H55',
      material: 'Travertin',
    },
    {
      title: isNL ? 'Voor de zithoek' : 'For the sitting area',
      line: isNL ? 'Rustige basis voor dagelijkse momenten.' : 'Calm foundation for daily moments.',
      spec: 'L120 × B80',
      material: 'Travertin',
    },
    {
      title: isNL ? 'In de hal' : 'In the hallway',
      line: isNL ? 'Architecturale lijn met verfijnde details.' : 'Architectural line with refined details.',
      spec: 'L160 × B45',
      material: isNL ? 'Marmer' : 'Marble',
    },
    {
      title: isNL ? 'Als centerpiece' : 'As centerpiece',
      line: isNL ? 'Gemaakt om samen te komen.' : 'Made for gathering together.',
      spec: 'L200 × B100',
      material: 'Travertin',
    },
  ];


  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "SERA NORR, maatwerk natuursteenmeubels, online atelier, travertin tafel op maat, marmeren tafel, Calacatta Viola" 
          : "SERA NORR, bespoke natural stone furniture, online atelier, custom travertine table, marble table, Calacatta Viola"}
        structuredData={combinedSchema}
      />

      {/* Hero with Scroll Animations */}
      <BespokeHero />

      {/* Entity Definition Block - SEO critical */}
      <section className="py-10 lg:py-12 bg-background border-b border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-xl lg:text-2xl text-foreground mb-3">
              {isNL ? 'Online atelier voor maatwerk natuursteenmeubels' : 'Online atelier for bespoke natural stone furniture'}
            </h2>
            <p className="text-muted-foreground text-body-md leading-relaxed">
              {isNL 
                ? 'SERA NORR is een online atelier voor maatwerk meubels in natuursteen (travertin, marmer en geselecteerde steensoorten). Steenkeuze en afwerking stemmen we samen af tijdens de intake.'
                : 'SERA NORR is an online atelier for bespoke furniture in natural stone (travertine, marble and selected stone types). Stone choice and finish are coordinated together during the intake.'}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges - Tighter spacing with top divider */}
      <section className="py-6 lg:py-8 bg-ivory/50 border-t border-border/40">
        <div className="container mx-auto px-6 lg:px-12">
          <TrustBadges variant="horizontal" />
        </div>
      </section>

      {/* Maatwerk op aanvraag Section - Editorial Style */}
      <section id="voorbeelden" className="py-16 lg:py-20 bg-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="mb-10 max-w-3xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {isNL ? 'Maatwerk' : 'Bespoke'}
            </p>
            <h2 className="font-serif text-display-sm text-foreground mb-5">
              {isNL ? 'Maatwerk op aanvraag' : 'Bespoke on request'}
            </h2>
            <p className="text-muted-foreground text-body-md leading-relaxed">
              {isNL 
                ? 'Elke SERA NORR piece wordt op maat gemaakt. Materiaal, maatvoering, randafwerking, onderstel en levering/plaatsing bepalen de uiteindelijke prijs. Na een korte intake ontvang je een voorstel op maat.'
                : 'Every SERA NORR piece is made to measure. Material, dimensions, edge finish, base and delivery/installation determine the final price. After a brief intake you receive a tailored proposal.'}
            </p>
          </header>

          {/* Price line - refined, small */}
          <p className="text-sm text-muted-foreground mb-8 pb-6 border-b border-border/30">
            {isNL 
              ? 'Prijs op aanvraag — op basis van steenkeuze, maatvoering, afwerking en levering/plaatsing.'
              : 'Price on request — based on stone choice, dimensions, finish and delivery/installation.'}
          </p>

          {/* Editorial Curated List - 2 columns desktop, 1 column mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-10">
            {inspirationItems.map((item, index) => (
              <div 
                key={index} 
                className={`py-6 ${
                  index < 2 ? 'md:border-b md:border-border/30' : ''
                } ${
                  index % 2 === 0 ? 'md:pr-10 md:border-r md:border-border/30' : 'md:pl-10'
                } ${
                  index < inspirationItems.length - 1 ? 'border-b border-border/30 md:border-b-0' : ''
                } ${
                  index >= 2 && index < inspirationItems.length - 1 ? 'md:border-b md:border-border/30' : ''
                }`}
              >
                <h3 className="font-serif text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{item.line}</p>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground/60">
                    {isNL ? 'Voorbeeldformaat' : 'Example dimensions'}: {item.spec}
                  </p>
                  <p className="text-xs text-muted-foreground/60">{item.material}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Single CTA row - only place to request offer */}
          <div className="flex flex-wrap gap-3 mb-10 pt-2">
            <Button asChild variant="atelier-filled" size="lg">
              <a href="#offerte">
                {isNL ? 'Vraag een offerte aan' : 'Request a quote'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="atelier" size="lg">
              <Link to="/collections">
                {isNL ? 'Bekijk voorbeelden' : 'View examples'}
              </Link>
            </Button>
          </div>

          {/* Footer note */}
          <div className="text-center pt-6 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              {isNL 
                ? 'Calacatta Viola & zeldzame steensoorten op aanvraag. Prijzen excl. btw. Levering & plaatsing afhankelijk van locatie.'
                : 'Calacatta Viola & rare stones on request. Prices excl. VAT. Delivery & installation depend on location.'}
            </p>
          </div>
        </div>
      </section>

      {/* Materialen & afwerking section */}
      <section className="py-10 lg:py-12 bg-background border-t border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="font-serif text-xl lg:text-2xl text-foreground mb-3">
              {isNL ? 'Materialen & afwerking' : 'Materials & finish'}
            </h2>
            <p className="text-muted-foreground text-body-md leading-relaxed mb-4">
              {isNL 
                ? 'Steenkeuze, afwerking en details stemmen we samen af tijdens de intake. U ontvangt advies op basis van uw ruimte en gebruik.'
                : 'Stone choice, finish and details are coordinated together during the intake. You receive advice based on your space and use.'}
            </p>
            <Link 
              to="/materials" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              {isNL ? 'Bekijk een selectie stenen →' : 'View a selection of stones →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Process Timeline - True 2-column layout */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="mb-8">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {t('bespoke.journeySubtitle')}
            </p>
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? 'Van idee tot meubel in 5 stappen' : 'From idea to furniture in 5 steps'}
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Left: Numbered Timeline (3 cols) */}
            <div className="lg:col-span-3">
              <div className="space-y-0">
                {/* Step 1 */}
                <div className="flex gap-4 pb-5 border-l-2 border-border/50 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">1</span>
                  <div>
                    <h4 className="font-serif text-base text-foreground mb-0.5">{isNL ? 'Consultatie' : 'Consultation'}</h4>
                    <p className="text-sm text-muted-foreground">{isNL ? 'Vrijblijvend gesprek over uw wensen en ruimte.' : 'No-obligation conversation about your wishes and space.'}</p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex gap-4 pb-5 border-l-2 border-border/50 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">2</span>
                  <div>
                    <h4 className="font-serif text-base text-foreground mb-0.5">{isNL ? 'Voorstel & Offerte' : 'Proposal & Quote'}</h4>
                    <p className="text-sm text-muted-foreground">{isNL ? 'Schetsen, materiaalopties en offerte.' : 'Sketches, material options and quote.'}</p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex gap-4 pb-5 border-l-2 border-border/50 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">3</span>
                  <div>
                    <h4 className="font-serif text-base text-foreground mb-0.5">{isNL ? 'Materiaalselectie' : 'Material Selection'}</h4>
                    <p className="text-sm text-muted-foreground">{isNL ? 'Selecteer uw steenplaat aan de hand van foto\'s.' : 'Select your stone slab based on photos.'}</p>
                  </div>
                </div>
                {/* Step 4 */}
                <div className="flex gap-4 pb-5 border-l-2 border-border/50 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">4</span>
                  <div>
                    <h4 className="font-serif text-base text-foreground mb-0.5">{isNL ? 'Productie' : 'Production'}</h4>
                    <p className="text-sm text-muted-foreground">{isNL ? 'Vakkundige productie door onze ambachtslieden.' : 'Expert production by our artisans.'}</p>
                  </div>
                </div>
                {/* Step 5 */}
                <div className="flex gap-4 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">5</span>
                  <div>
                    <h4 className="font-serif text-base text-foreground mb-0.5">{isNL ? 'Levering & Plaatsing' : 'Delivery & Installation'}</h4>
                    <p className="text-sm text-muted-foreground">{isNL ? 'White-glove levering en professionele plaatsing.' : 'White-glove delivery and professional installation.'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Compact "Wat u krijgt" card (2 cols) */}
            <div className="lg:col-span-2">
              <div className="bg-background p-5 lg:p-6 border border-border/50 h-full">
                <h3 className="font-serif text-base text-foreground mb-4">
                  {isNL ? 'Wat u krijgt' : 'What you receive'}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-foreground">✓</span>
                    {isNL ? '3D-visualisaties' : '3D visualizations'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-foreground">✓</span>
                    {isNL ? 'Materiaalmonsters' : 'Material samples'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-foreground">✓</span>
                    {isNL ? 'Foto-updates productie' : 'Production photo updates'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-foreground">✓</span>
                    {isNL ? 'White-glove levering' : 'White-glove delivery'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-foreground">✓</span>
                    {isNL ? '5 jaar garantie' : '5 year warranty'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-foreground">✓</span>
                    {isNL ? 'Onderhoudsinstructies' : 'Care instructions'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Total bar */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-center text-sm text-foreground">
              <span className="font-medium">{isNL ? 'Gemiddelde doorlooptijd:' : 'Average lead time:'}</span>{' '}
              <span className="text-muted-foreground">
                {isNL 
                  ? '12–16 weken (afhankelijk van steenkeuze en locatie)'
                  : '12–16 weeks (depending on stone choice and location)'}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Options - Unified Two-Choice Module */}
      <section className="py-12 lg:py-14 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="text-center mb-8">
            <h2 className="font-serif text-display-sm text-foreground mb-3">
              {isNL ? 'Hoe wilt u beginnen?' : 'How would you like to start?'}
            </h2>
            <p className="text-muted-foreground text-body-md max-w-xl mx-auto">
              {isNL 
                ? 'Kies de aanpak die bij u past. Alle opties zijn vrijblijvend.'
                : 'Choose the approach that suits you. All options are no-obligation.'}
            </p>
          </header>

          {/* Unified Container */}
          <div className="max-w-3xl mx-auto border border-border/40 bg-secondary/20">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Choice A: Vrijblijvend gesprek */}
              <div className="p-6 lg:p-8 flex flex-col border-b md:border-b-0 md:border-r border-border/30">
                <MessageSquare className="w-5 h-5 text-foreground mb-4" />
                <h3 className="font-serif text-lg text-foreground mb-2">
                  {isNL ? 'Vrijblijvend gesprek' : 'Free consultation'}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  {isNL 
                    ? 'Telefonisch of via videocall. Binnen 2 werkdagen reactie.' 
                    : 'By phone or video call. Response within 2 business days.'}
                </p>
                <p className="text-xs text-muted-foreground/60 mb-5 flex-1">
                  {isNL 
                    ? 'Geschikt als u nog twijfelt over formaat of steensoort.' 
                    : 'Suitable if you\'re still undecided about size or stone type.'}
                </p>
                <Button asChild variant="atelier" size="default">
                  <a href="#offerte">
                    {isNL ? 'Plan een gesprek' : 'Schedule a call'}
                  </a>
                </Button>
              </div>

              {/* Choice B: Offerte aanvragen (Primary) */}
              <div className="relative p-6 lg:p-8 flex flex-col bg-secondary/30">
                {/* Meest gekozen pill */}
                <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] uppercase tracking-widest font-medium text-muted-foreground border border-border/50 bg-background/50">
                  {isNL ? 'Meest gekozen' : 'Most popular'}
                </span>
                <FileText className="w-5 h-5 text-foreground mb-4" />
                <h3 className="font-serif text-lg text-foreground mb-2">
                  {isNL ? 'Offerte aanvragen' : 'Request quote'}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  {isNL 
                    ? 'Binnen 48 uur een voorstel met schetsen en offerte.' 
                    : 'Proposal with sketches and quote within 48 hours.'}
                </p>
                <p className="text-xs text-muted-foreground/60 mb-5 flex-1">
                  {isNL 
                    ? 'Geschikt als u al een richting of maat in gedachten heeft.' 
                    : 'Suitable if you already have a direction or size in mind.'}
                </p>
                <Button asChild variant="atelier-filled" size="default">
                  <a href="#offerte">
                    {isNL ? 'Vraag offerte aan' : 'Request quote'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Shared reassurance line */}
            <div className="px-6 lg:px-8 py-4 border-t border-border/30 bg-background/40">
              <p className="text-xs text-muted-foreground text-center">
                {isNL 
                  ? 'Online atelier — materiaalkeuze en details stemmen we samen af. Geen verplichtingen.' 
                  : 'Online atelier — we align material choices and details together. No obligations.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Aligned with structured data */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <header className="text-center mb-8">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                {isNL ? 'Veelgestelde vragen' : 'Frequently asked questions'}
              </p>
              <h2 className="font-serif text-display-sm text-foreground">
                {isNL ? 'Alles over ons maatwerkproces' : 'Everything about our bespoke process'}
              </h2>
            </header>

            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`} className="border border-border/50 px-5">
                  <AccordionTrigger className="text-left font-serif text-base hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Inquiry Form - Couture Styling */}
      <section id="offerte" className="py-14 lg:py-20 bg-foreground text-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            {/* Enhanced form container with inner shadow and better border */}
            <div className="border border-background/15 bg-background/[0.03] p-8 lg:p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <header className="text-center mb-8">
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/60 mb-3">
                  {isNL ? 'Offerte aanvragen' : 'Request quote'}
                </p>
                <h2 className="font-serif text-display-sm mb-3">
                  {isNL ? 'Vertel ons over uw project' : 'Tell us about your project'}
                </h2>
                <p className="text-background/70 text-body-md">
                  {isNL 
                    ? 'Binnen 48 uur ontvangt u een vrijblijvend voorstel met schetsen.'
                    : 'Receive a no-obligation proposal with sketches within 48 hours.'}
                </p>
              </header>

              {/* Required fields note */}
              <p className="text-xs text-background/50 mb-6 text-center">
                {isNL ? 'Velden met * zijn verplicht.' : 'Fields marked with * are required.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="bespoke-name" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                      {t('bespoke.formName')} *
                    </label>
                    <Input
                      id="bespoke-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background/10 border-background/25 text-background placeholder:text-background/40 focus:border-background/50 focus:ring-1 focus:ring-background/20 transition-all"
                      placeholder={t('bespoke.formNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="bespoke-email" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                      {t('bespoke.formEmail')} *
                    </label>
                    <Input
                      id="bespoke-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background/10 border-background/25 text-background placeholder:text-background/40 focus:border-background/50 focus:ring-1 focus:ring-background/20 transition-all"
                      placeholder={t('bespoke.formEmailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="bespoke-phone" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                      {isNL ? 'Telefoon' : 'Phone'}
                    </label>
                    <Input
                      id="bespoke-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background/10 border-background/25 text-background placeholder:text-background/40 focus:border-background/50 focus:ring-1 focus:ring-background/20 transition-all"
                      placeholder={isNL ? '+31 6 12345678' : '+31 6 12345678'}
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                      {t('bespoke.formProjectType')} *
                    </label>
                    <Select 
                      value={formData.projectType} 
                      onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/10 border-background/25 text-background focus:border-background/50 focus:ring-1 focus:ring-background/20 [&>span]:text-background/40 data-[state=open]:border-background/50">
                        <SelectValue placeholder={isNL ? 'Selecteer type stuk' : 'Select piece type'} />
                      </SelectTrigger>
                      <SelectContent className="bg-foreground border-background/20">
                        <SelectItem value="side-table" className="text-background focus:bg-background/10 focus:text-background">{isNL ? 'Bijzettafel' : 'Side table'}</SelectItem>
                        <SelectItem value="coffee-table" className="text-background focus:bg-background/10 focus:text-background">{isNL ? 'Salontafel' : 'Coffee table'}</SelectItem>
                        <SelectItem value="dining-table" className="text-background focus:bg-background/10 focus:text-background">{isNL ? 'Eettafel' : 'Dining table'}</SelectItem>
                        <SelectItem value="console" className="text-background focus:bg-background/10 focus:text-background">{isNL ? 'Console' : 'Console'}</SelectItem>
                        <SelectItem value="desk" className="text-background focus:bg-background/10 focus:text-background">{isNL ? 'Bureau' : 'Desk'}</SelectItem>
                        <SelectItem value="other" className="text-background focus:bg-background/10 focus:text-background">{isNL ? 'Anders' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="bespoke-dimensions" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                      {isNL ? 'Gewenste afmetingen' : 'Desired dimensions'}
                    </label>
                    <Input
                      id="bespoke-dimensions"
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="bg-background/10 border-background/25 text-background placeholder:text-background/40 focus:border-background/50 focus:ring-1 focus:ring-background/20 transition-all"
                      placeholder={isNL ? 'bijv. L120 × B80 × H45 cm' : 'e.g. L120 × W80 × H45 cm'}
                    />
                  </div>
                  <div>
                    <label htmlFor="bespoke-budget" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                      {isNL ? 'Budget indicatie' : 'Budget indication'}
                    </label>
                    <Input
                      id="bespoke-budget"
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="bg-background/10 border-background/25 text-background placeholder:text-background/40 focus:border-background/50 focus:ring-1 focus:ring-background/20 transition-all"
                      placeholder={isNL ? 'bijv. €3.000 - €5.000' : 'e.g. €3,000 - €5,000'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bespoke-message" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    {t('bespoke.formVision')} *
                  </label>
                  <Textarea
                    id="bespoke-message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="bg-background/10 border-background/25 text-background placeholder:text-background/40 focus:border-background/50 focus:ring-1 focus:ring-background/20 transition-all resize-none"
                    placeholder={isNL 
                      ? 'Beschrijf uw wensen: materiaalvoorkeuren, stijl, ruimte waar het stuk komt...'
                      : 'Describe your wishes: material preferences, style, space where the piece will go...'}
                  />
                </div>

                {/* Optional file upload */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    {isNL ? 'Inspiratie / foto ruimte (optioneel)' : 'Inspiration / room photo (optional)'}
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFileName(file ? file.name : null);
                    }}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-background/25 bg-background/5 text-background/60 hover:border-background/40 hover:bg-background/10 transition-all text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    {fileName || (isNL ? 'Upload bestand' : 'Upload file')}
                  </button>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="outline" size="lg" className="w-full border-background/40 text-background hover:bg-background hover:text-foreground">
                    {isNL ? 'Verstuur aanvraag' : 'Submit request'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Trust microcopy */}
                <p className="text-xs text-background/50 text-center pt-2">
                  {isNL 
                    ? 'Reactie binnen 48 uur. Geen verplichtingen. Geen spam.'
                    : 'Response within 48 hours. No obligations. No spam.'}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bespoke;
