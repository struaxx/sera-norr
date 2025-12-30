import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TrustBadges, BespokeTimeline, USPBullets } from "@/components/trust";
import { ArrowRight, Calendar, FileText, MessageSquare } from "lucide-react";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";
import { trackLeadSubmit } from "@/lib/analytics";

const Bespoke = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
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
    setFormData({ name: "", email: "", phone: "", projectType: "", budget: "", message: "" });
  };

  const seoTitle = isNL 
    ? "Maatwerk Stenen Meubels | Offerte Aanvragen | SERA NORR"
    : "Bespoke Stone Furniture | Request Quote | SERA NORR";

  const seoDescription = isNL
    ? "Maatwerk stenen meubels vanaf €2.000. Travertin, Calacatta Viola en andere steensoorten. Doorlooptijd 8-12 weken. Vraag een vrijblijvende offerte aan."
    : "Bespoke stone furniture from €2,000. Travertine, Calacatta Viola and other stones. Lead time 8-12 weeks. Request a no-obligation quote.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Maatwerk' : 'Bespoke', url: '/bespoke' },
  ]);

  const priceExamples = [
    {
      type: isNL ? 'Bijzettafel' : 'Side Table',
      price: '€1.400',
      spec: 'Ø45 × H55 — travertin',
    },
    {
      type: isNL ? 'Salontafel' : 'Coffee Table',
      price: '€2.800',
      spec: 'L120 × B80 — travertin',
    },
    {
      type: isNL ? 'Console' : 'Console',
      price: '€3.800',
      spec: 'L160 × B45 — marmer',
    },
    {
      type: isNL ? 'Eettafel' : 'Dining Table',
      price: '€6.500',
      spec: 'L200 × B100 — travertin',
    },
  ];

  const ctaOptions = [
    {
      icon: MessageSquare,
      title: isNL ? 'Vrijblijvend gesprek' : 'Free consultation',
      description: isNL 
        ? 'Telefonisch of via videocall. Binnen 2 werkdagen reactie.' 
        : 'By phone or video call. Response within 2 business days.',
      cta: isNL ? 'Plan een gesprek' : 'Schedule a call',
      primary: false,
      label: null,
    },
    {
      icon: FileText,
      title: isNL ? 'Offerte aanvragen' : 'Request quote',
      description: isNL 
        ? 'Binnen 48 uur een voorstel met schetsen en prijsindicatie.' 
        : 'Proposal with sketches and price indication within 48 hours.',
      cta: isNL ? 'Vraag offerte aan' : 'Request quote',
      primary: true,
      label: isNL ? 'Meest gekozen' : 'Most popular',
    },
    {
      icon: Calendar,
      title: isNL ? 'Showroom bezoek' : 'Showroom visit',
      description: isNL 
        ? 'Materialen bekijken en afwerkingen voelen in Amsterdam.' 
        : 'View materials and feel finishes in Amsterdam.',
      cta: isNL ? 'Maak afspraak' : 'Book appointment',
      primary: false,
      label: null,
    },
  ];

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "maatwerk meubels, offerte stenen tafel, marmeren tafel op maat, travertin eettafel, ontworpen in Nederland" 
          : "bespoke furniture, stone table quote, custom marble table, travertine dining table, designed in the Netherlands"}
        structuredData={breadcrumbSchema}
      />

      {/* Hero with Clear Value Proposition */}
      <section className="pt-32 lg:pt-40 pb-14 lg:pb-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {t('bespoke.subtitle')}
              </p>
              <h1 className="font-serif text-display-lg text-foreground mb-5">
                {isNL ? 'Maatwerk in natuursteen, ontworpen voor uw ruimte' : 'Bespoke natural stone, designed for your space'}
              </h1>
              <p className="text-muted-foreground text-body-lg leading-relaxed mb-6">
                {isNL 
                  ? 'Van eerste schets tot plaatsing. Een zorgvuldig traject met materiaalkeuze, visualisaties en white-glove levering.'
                  : 'From first sketch to installation. A careful process with material selection, visualizations and white-glove delivery.'}
              </p>
              
              {/* Key Stats as Chips */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center px-3.5 py-1.5 bg-secondary/50 border border-border/50 text-sm text-foreground">
                  {isNL ? 'Projecten vanaf €2.000' : 'Projects from €2,000'}
                </span>
                <span className="inline-flex items-center px-3.5 py-1.5 bg-secondary/50 border border-border/50 text-sm text-foreground">
                  {isNL ? 'Gemiddeld 8–12 weken' : 'Average 8–12 weeks'}
                </span>
                <span className="inline-flex items-center px-3.5 py-1.5 bg-secondary/50 border border-border/50 text-sm text-foreground">
                  {isNL ? '5 jaar garantie' : '5 year warranty'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Button asChild variant="atelier-filled" size="lg">
                  <a href="#offerte">
                    {isNL ? 'Vraag offerte aan' : 'Request quote'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="atelier" size="lg">
                  <Link to="/contact">
                    {isNL ? 'Plan vrijblijvend gesprek' : 'Schedule free consultation'}
                  </Link>
                </Button>
              </div>
              
              {/* Trust line */}
              <p className="text-sm text-muted-foreground">
                {isNL ? 'Reactie binnen 48 uur — geen verplichtingen.' : 'Response within 48 hours — no obligations.'}
              </p>
            </div>
            
            {/* Dominant + Overlap Image Layout */}
            <div className="relative">
              {/* Main dominant image */}
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                <img 
                  src={terraImage} 
                  alt={isNL ? "Maatwerk travertin meubel" : "Bespoke travertine furniture"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {/* Overlap detail image */}
              <div className="absolute -bottom-6 -left-6 lg:-left-10 w-32 lg:w-40 aspect-square bg-muted overflow-hidden border-4 border-background shadow-xl">
                <img 
                  src={vantaImage} 
                  alt={isNL ? "Maatwerk marmeren tafel detail" : "Bespoke marble table detail"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {/* Caption */}
              <p className="absolute -bottom-6 right-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                TERRA / VANTA — {isNL ? 'maatwerk voorbeelden' : 'bespoke examples'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 lg:py-10 bg-ivory/50 border-y border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <TrustBadges variant="horizontal" />
        </div>
      </section>

      {/* Pricing Examples */}
      <section id="voorbeelden" className="py-12 lg:py-16 bg-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="mb-8">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {isNL ? 'Prijsindicatie' : 'Price Indication'}
              </p>
              <a 
                href="#voorbeelden" 
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                {isNL ? 'Bekijk voorbeelden ↓' : 'View examples ↓'}
              </a>
            </div>
            <h2 className="font-serif text-display-sm text-foreground mb-3">
              {isNL ? 'Vanafprijzen per categorie' : 'Starting prices by category'}
            </h2>
            <p className="text-muted-foreground text-body-md max-w-2xl">
              {isNL 
                ? 'Richtprijzen voor standaardformaten in travertin. Exacte prijs hangt af van steen, dikte, randafwerking en onderstel.'
                : 'Guide prices for standard dimensions in travertine. Exact price depends on stone, thickness, edge finish and base.'}
            </p>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {priceExamples.map((item, index) => (
              <div key={index} className="p-5 bg-secondary/30 border border-border/50">
                <h3 className="font-serif text-base text-foreground mb-1">{item.type}</h3>
                <p className="font-serif text-xl text-foreground mb-1.5">
                  <span className="text-sm font-sans text-muted-foreground mr-1">{isNL ? 'vanaf' : 'from'}</span>
                  {item.price}
                </p>
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed">{item.spec}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mt-6 space-y-1.5 text-center">
            <p className="text-xs text-muted-foreground">
              {isNL 
                ? 'Calacatta Viola & zeldzame steensoorten op aanvraag.'
                : 'Calacatta Viola & rare stones on request.'}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {isNL 
                ? 'Prijzen exclusief btw. Levering & plaatsing afhankelijk van locatie.'
                : 'Prices exclude VAT. Delivery & installation depend on location.'}
            </p>
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
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h4 className="font-serif text-base text-foreground">{isNL ? 'Consultatie' : 'Consultation'}</h4>
                      <span className="text-xs text-muted-foreground">1 week</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{isNL ? 'Vrijblijvend gesprek over uw wensen en ruimte.' : 'No-obligation conversation about your wishes and space.'}</p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex gap-4 pb-5 border-l-2 border-border/50 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">2</span>
                  <div>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h4 className="font-serif text-base text-foreground">{isNL ? 'Voorstel & Offerte' : 'Proposal & Quote'}</h4>
                      <span className="text-xs text-muted-foreground">1 week</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{isNL ? 'Schetsen, materiaalopties en prijsvoorstel.' : 'Sketches, material options and price proposal.'}</p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex gap-4 pb-5 border-l-2 border-border/50 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">3</span>
                  <div>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h4 className="font-serif text-base text-foreground">{isNL ? 'Materiaalselectie' : 'Material Selection'}</h4>
                      <span className="text-xs text-muted-foreground">{isNL ? '1–2 weken' : '1–2 weeks'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{isNL ? 'Selecteer uw steenplaat. Foto\'s of showroombezoek.' : 'Select your stone slab. Photos or showroom visit.'}</p>
                  </div>
                </div>
                {/* Step 4 */}
                <div className="flex gap-4 pb-5 border-l-2 border-border/50 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">4</span>
                  <div>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h4 className="font-serif text-base text-foreground">{isNL ? 'Productie' : 'Production'}</h4>
                      <span className="text-xs text-muted-foreground">{isNL ? '4–6 weken' : '4–6 weeks'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{isNL ? 'Vakkundige productie door onze ambachtslieden.' : 'Expert production by our artisans.'}</p>
                  </div>
                </div>
                {/* Step 5 */}
                <div className="flex gap-4 pl-6 relative">
                  <span className="absolute -left-3 top-0 w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-medium">5</span>
                  <div>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h4 className="font-serif text-base text-foreground">{isNL ? 'Levering & Plaatsing' : 'Delivery & Installation'}</h4>
                      <span className="text-xs text-muted-foreground">1 week</span>
                    </div>
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
              <span className="font-medium">{isNL ? 'Totaal:' : 'Total:'}</span>{' '}
              <span className="text-muted-foreground">
                {isNL 
                  ? 'gemiddeld 8–12 weken (afhankelijk van complexiteit en materiaal)'
                  : 'average 8–12 weeks (depending on complexity and material)'}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Options */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {ctaOptions.map((option, index) => (
              <div 
                key={index} 
                className={`relative p-5 border flex flex-col ${option.primary ? 'bg-foreground text-background border-foreground' : 'bg-background border-border/50'}`}
              >
                {/* Label for primary option */}
                {option.label && (
                  <span className="absolute -top-3 left-5 px-2 py-0.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-medium">
                    {option.label}
                  </span>
                )}
                <option.icon className={`w-5 h-5 mb-2.5 ${option.primary ? 'text-background' : 'text-foreground'}`} />
                <h3 className={`font-serif text-base mb-1.5 ${option.primary ? 'text-background' : 'text-foreground'}`}>
                  {option.title}
                </h3>
                <p className={`text-sm leading-relaxed flex-1 ${option.primary ? 'text-background/80' : 'text-muted-foreground'}`}>
                  {option.description}
                </p>
                <Button 
                  asChild 
                  variant={option.primary ? 'outline' : 'atelier'} 
                  size="sm"
                  className={`mt-4 ${option.primary ? 'border-background/40 text-background hover:bg-background hover:text-foreground' : ''}`}
                >
                  <a href="#offerte">{option.cta}</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="offerte" className="py-14 lg:py-20 bg-foreground text-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            {/* Form container with subtle border */}
            <div className="border border-background/10 p-8 lg:p-10">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
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
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder={t('bespoke.formEmailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bespoke-phone" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    {isNL ? 'Telefoon' : 'Phone'}
                  </label>
                  <Input
                    id="bespoke-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder={isNL ? '+31 6 12345678' : '+31 6 12345678'}
                  />
                </div>
                <div>
                  <label htmlFor="bespoke-projectType" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    {t('bespoke.formProjectType')} *
                  </label>
                  <Input
                    id="bespoke-projectType"
                    type="text"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    required
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder={t('bespoke.formProjectTypePlaceholder')}
                  />
                </div>
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
                  className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                  placeholder={isNL ? 'bijv. €3.000 - €5.000' : 'e.g. €3,000 - €5,000'}
                />
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
                  rows={5}
                  className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60 resize-none"
                  placeholder={isNL 
                    ? 'Beschrijf uw wensen: type meubel, gewenste afmetingen, materiaalvoorkeuren...'
                    : 'Describe your wishes: type of furniture, desired dimensions, material preferences...'}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" variant="outline" size="lg" className="w-full border-background/40 text-background hover:bg-background hover:text-foreground">
                  {isNL ? 'Verstuur aanvraag' : 'Submit request'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
            
            {/* Trust indicators below form */}
            <div className="mt-6 pt-6 border-t border-background/10 text-center">
              <p className="text-xs text-background/50 mb-3">
                {isNL 
                  ? 'Wij reageren binnen 48 uur. Geen verplichtingen, geen spam.'
                  : 'We respond within 48 hours. No obligations, no spam.'}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-background/40">
                <span>{isNL ? '✓ 50+ projecten voltooid' : '✓ 50+ projects completed'}</span>
                <span>•</span>
                <span>{isNL ? '✓ 5 jaar garantie' : '✓ 5 year warranty'}</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bespoke;
