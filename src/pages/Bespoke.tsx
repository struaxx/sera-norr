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
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TrustBadges, BespokeTimeline, USPBullets } from "@/components/trust";
import { ArrowRight, Calendar, FileText, MessageSquare, Upload } from "lucide-react";
import bespokeHeroImage from "@/assets/bespoke-hero.png";
import { trackLeadSubmit } from "@/lib/analytics";

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
    ? "Maatwerk Stenen Meubels | Offerte Aanvragen | SERA NORR"
    : "Bespoke Stone Furniture | Request Quote | SERA NORR";

  const seoDescription = isNL
    ? "Maatwerk stenen meubels op aanvraag. Travertin, Calacatta Viola en andere steensoorten. Doorlooptijd ±13-15 weken. Vraag een vrijblijvende offerte aan."
    : "Bespoke stone furniture on request. Travertine, Calacatta Viola and other stones. Lead time ±13-15 weeks. Request a no-obligation quote.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Maatwerk' : 'Bespoke', url: '/bespoke' },
  ]);

  // Example products (dimensions only, no prices)
  const exampleProducts = [
    {
      type: isNL ? 'Bijzettafel' : 'Side Table',
      spec: 'Ø45 × H55',
      material: 'Travertin',
    },
    {
      type: isNL ? 'Salontafel' : 'Coffee Table',
      spec: 'L120 × B80',
      material: 'Travertin',
    },
    {
      type: isNL ? 'Console' : 'Console',
      spec: 'L160 × B45',
      material: isNL ? 'Marmer' : 'Marble',
    },
    {
      type: isNL ? 'Eettafel' : 'Dining Table',
      spec: 'L200 × B100',
      material: 'Travertin',
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
        ? 'Binnen 48 uur een voorstel met schetsen en offerte.' 
        : 'Proposal with sketches and quote within 48 hours.',
      cta: isNL ? 'Vraag offerte aan' : 'Request quote',
      primary: true,
      label: isNL ? 'Meest gekozen' : 'Most popular',
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
      <section className="pt-32 lg:pt-40 pb-8 lg:pb-10 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {t('bespoke.subtitle')}
              </p>
              <h1 className="font-serif text-display-lg text-foreground mb-5 leading-[1.1]">
                {isNL ? 'Maatwerk in natuursteen — ontworpen voor uw ruimte' : 'Bespoke natural stone — designed for your space'}
              </h1>
              <p className="text-muted-foreground text-body-lg leading-relaxed mb-6">
                {isNL 
                  ? 'Van eerste schets tot plaatsing. Een zorgvuldig traject met materiaalkeuze, visualisaties en white-glove levering.'
                  : 'From first sketch to installation. A careful process with material selection, visualizations and white-glove delivery.'}
              </p>
              
              {/* Key Stats as Refined Chips */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 bg-secondary/30 border border-border/40 text-sm text-foreground rounded-sm">
                  {isNL ? 'Prijs op aanvraag' : 'Price on request'}
                </span>
                <span className="inline-flex items-center px-4 py-1.5 bg-secondary/30 border border-border/40 text-sm text-foreground rounded-sm">
                  {isNL ? 'Doorlooptijd 12–16 weken' : 'Lead time 12–16 weeks'}
                </span>
                <span className="inline-flex items-center px-4 py-1.5 bg-secondary/30 border border-border/40 text-sm text-foreground rounded-sm">
                  {isNL ? '5 jaar garantie' : '5 year warranty'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Button asChild variant="atelier-filled" size="lg" className="h-12">
                  <a href="#offerte">
                    {isNL ? 'Vraag offerte aan' : 'Request quote'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="atelier" size="lg" className="h-12 border-foreground/30 hover:border-foreground/60">
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
            
            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-[4/3] lg:aspect-[16/10] bg-muted overflow-hidden">
                <img 
                  src={bespokeHeroImage} 
                  alt={isNL ? "SERA NORR maatwerk ontwerp met materiaalstalen" : "SERA NORR bespoke design with material samples"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {/* Caption */}
              <p className="absolute -bottom-4 right-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {isNL ? 'Ontwerpproces — materiaalstalen' : 'Design process — material samples'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Tighter spacing with top divider */}
      <section className="py-6 lg:py-8 bg-ivory/50 border-t border-border/40">
        <div className="container mx-auto px-6 lg:px-12">
          <TrustBadges variant="horizontal" />
        </div>
      </section>

      {/* Maatwerk op aanvraag Section */}
      <section id="voorbeelden" className="py-12 lg:py-16 bg-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="mb-8 max-w-3xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {isNL ? 'Maatwerk' : 'Bespoke'}
            </p>
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {isNL ? 'Maatwerk op aanvraag' : 'Bespoke on request'}
            </h2>
            <p className="text-muted-foreground text-body-md leading-relaxed">
              {isNL 
                ? 'Elke SERA NORR piece wordt op maat gemaakt. De prijs is afhankelijk van steenkeuze, afmetingen, dikte, randafwerking, onderstel en levering/plaatsing. Na een korte intake ontvang je een heldere offerte.'
                : 'Every SERA NORR piece is made to measure. The price depends on stone choice, dimensions, thickness, edge finish, base and delivery/installation. After a brief intake you receive a clear quote.'}
            </p>
          </header>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
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

          {/* Example Products Grid - No prices */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6">
            {exampleProducts.map((item, index) => (
              <div key={index} className="p-5 bg-secondary/30 border border-border/50">
                <h3 className="font-serif text-base text-foreground mb-1">{item.type}</h3>
                <p className="text-sm text-muted-foreground mb-1.5">{isNL ? 'Prijs op aanvraag' : 'Price on request'}</p>
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                  {isNL ? 'Voorbeeldformaat' : 'Example dimensions'}: {item.spec}
                </p>
                <p className="text-[11px] text-muted-foreground/70">{item.material}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-1.5 text-center">
            <p className="text-xs text-muted-foreground">
              {isNL 
                ? 'Calacatta Viola & zeldzame steensoorten op aanvraag. Prijzen excl. btw. Levering & plaatsing afhankelijk van locatie.'
                : 'Calacatta Viola & rare stones on request. Prices excl. VAT. Delivery & installation depend on location.'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch max-w-2xl mx-auto">
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

      {/* FAQ Section */}
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
              <AccordionItem value="item-1" className="border border-border/50 px-5">
                <AccordionTrigger className="text-left font-serif text-base hover:no-underline py-4">
                  {isNL ? 'Is er een minimale afname?' : 'Is there a minimum order?'}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  {isNL 
                    ? 'Nee, er is geen minimale afname. Elk project is uniek en we maken graag één stuk op maat voor u.'
                    : 'No, there is no minimum order. Each project is unique and we happily create a single bespoke piece for you.'}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-border/50 px-5">
                <AccordionTrigger className="text-left font-serif text-base hover:no-underline py-4">
                  {isNL ? 'Kan ik mijn eigen steenplaat kiezen?' : 'Can I choose my own stone slab?'}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  {isNL 
                    ? 'Absoluut. Na goedkeuring van het ontwerp selecteert u uw specifieke plaat. U ontvangt foto\'s van beschikbare platen om uw keuze te maken.'
                    : 'Absolutely. After design approval, you select your specific slab. You\'ll receive photos of available slabs to make your choice.'}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border border-border/50 px-5">
                <AccordionTrigger className="text-left font-serif text-base hover:no-underline py-4">
                  {isNL ? 'Hoe werkt onderhoud en bescherming?' : 'How does maintenance and protection work?'}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  {isNL 
                    ? 'Elk stuk wordt geleverd met gedetailleerde onderhoudsinstructies. Natuursteen vereist minimaal onderhoud: regelmatig afstoffen en periodiek behandelen met een geschikte steenbehandeling. We adviseren u graag over de beste aanpak voor uw materiaal.'
                    : 'Each piece comes with detailed care instructions. Natural stone requires minimal maintenance: regular dusting and periodic treatment with a suitable stone sealant. We\'re happy to advise on the best approach for your material.'}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border border-border/50 px-5">
                <AccordionTrigger className="text-left font-serif text-base hover:no-underline py-4">
                  {isNL ? 'Wat valt onder white-glove levering?' : 'What\'s included in white-glove delivery?'}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  {isNL 
                    ? 'White-glove levering omvat: transport met klimaatcontrole, levering op de gewenste locatie in uw woning, uitpakken, plaatsing, inspectie met u en afvoer van alle verpakkingsmaterialen.'
                    : 'White-glove delivery includes: climate-controlled transport, delivery to your desired location within your home, unpacking, placement, inspection with you, and removal of all packaging materials.'}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border border-border/50 px-5">
                <AccordionTrigger className="text-left font-serif text-base hover:no-underline py-4">
                  {isNL ? 'Leveren jullie door heel Nederland?' : 'Do you deliver throughout the Netherlands?'}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  {isNL 
                    ? 'Ja, wij leveren door heel Nederland en België. Voor leveringen buiten deze regio\'s neem contact met ons op voor een maatwerkofferte.'
                    : 'Yes, we deliver throughout the Netherlands and Belgium. For deliveries outside these regions, please contact us for a custom quote.'}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="border border-border/50 px-5">
                <AccordionTrigger className="text-left font-serif text-base hover:no-underline py-4">
                  {isNL ? 'Wat bepaalt de prijs het meest?' : 'What most determines the price?'}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  {isNL 
                    ? 'De prijs wordt bepaald door: steensoort (travertin vs. Calacatta Viola), afmetingen, plaatdikte (2 of 3 cm), randafwerking, complexiteit van het ontwerp en het type onderstel. Wij geven altijd een transparante prijsopbouw.'
                    : 'Price is determined by: stone type (travertine vs. Calacatta Viola), dimensions, slab thickness (2 or 3 cm), edge finish, design complexity, and base type. We always provide a transparent price breakdown.'}
                </AccordionContent>
              </AccordionItem>
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
