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
    ? "Maatwerk stenen meubels vanaf €2.000. Travertin, Calacatta Viola en andere steensoorten. Doorlooptijd 12-20 weken. Vraag een vrijblijvende offerte aan."
    : "Bespoke stone furniture from €2,000. Travertine, Calacatta Viola and other stones. Lead time 12-20 weeks. Request a no-obligation quote.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Maatwerk' : 'Bespoke', url: '/bespoke' },
  ]);

  const priceExamples = [
    {
      type: isNL ? 'Bijzettafel' : 'Side Table',
      from: '€1.400',
      example: isNL ? 'Ø45 × H55 cm, travertin' : 'Ø45 × H55 cm, travertine',
    },
    {
      type: isNL ? 'Salontafel' : 'Coffee Table',
      from: '€2.800',
      example: isNL ? 'L120 × B80 cm, travertin' : 'L120 × W80 cm, travertine',
    },
    {
      type: isNL ? 'Console' : 'Console',
      from: '€3.800',
      example: isNL ? 'L160 × B45 cm, marmer' : 'L160 × W45 cm, marble',
    },
    {
      type: isNL ? 'Eettafel' : 'Dining Table',
      from: '€6.500',
      example: isNL ? 'L200 × B100 cm, travertin' : 'L200 × W100 cm, travertine',
    },
  ];

  const ctaOptions = [
    {
      icon: MessageSquare,
      title: isNL ? 'Vrijblijvend gesprek' : 'Free consultation',
      description: isNL 
        ? 'Bespreek uw project telefonisch of per videocall. Binnen 2 werkdagen contact.' 
        : 'Discuss your project by phone or video call. Contact within 2 business days.',
      cta: isNL ? 'Plan een gesprek' : 'Schedule a call',
      primary: false,
    },
    {
      icon: FileText,
      title: isNL ? 'Offerte aanvragen' : 'Request quote',
      description: isNL 
        ? 'Ontvang binnen 48 uur een vrijblijvend voorstel met schetsen en prijsindicatie.' 
        : 'Receive a no-obligation proposal with sketches and price indication within 48 hours.',
      cta: isNL ? 'Vraag offerte aan' : 'Request quote',
      primary: true,
    },
    {
      icon: Calendar,
      title: isNL ? 'Showroom bezoek' : 'Showroom visit',
      description: isNL 
        ? 'Bekijk materialen en afgewerkte stukken in onze Amsterdam showroom.' 
        : 'View materials and finished pieces in our Amsterdam showroom.',
      cta: isNL ? 'Maak afspraak' : 'Book appointment',
      primary: false,
    },
  ];

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "maatwerk meubels, offerte stenen tafel, marmeren tafel op maat, travertin eettafel, Europees vakmanschap" 
          : "bespoke furniture, stone table quote, custom marble table, travertine dining table, European craftsmanship"}
        structuredData={breadcrumbSchema}
      />

      {/* Hero with Clear Value Proposition */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {t('bespoke.subtitle')}
              </p>
              <h1 className="font-serif text-display-lg text-foreground mb-6">
                {isNL ? 'Uw stuk, op maat gemaakt' : 'Your piece, made to measure'}
              </h1>
              <p className="text-muted-foreground text-body-lg leading-relaxed mb-6">
                {isNL 
                  ? 'Van eerste gesprek tot geïnstalleerd meubel in 12-20 weken. Wij vertalen uw wensen naar een stuk dat precies past bij uw ruimte.'
                  : 'From first conversation to installed furniture in 12-20 weeks. We translate your wishes into a piece that fits your space perfectly.'}
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 py-6 border-y border-border/50 mb-6">
                <div>
                  <p className="font-serif text-2xl text-foreground">{isNL ? 'Vanaf' : 'From'}</p>
                  <p className="font-serif text-2xl text-foreground">€2.000</p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-foreground">12-20</p>
                  <p className="text-sm text-muted-foreground">{isNL ? 'weken' : 'weeks'}</p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-foreground">5 {isNL ? 'jaar' : 'year'}</p>
                  <p className="text-sm text-muted-foreground">{isNL ? 'garantie' : 'warranty'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
            
            {/* Example Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img src={terraImage} alt={isNL ? "Maatwerk travertin meubel" : "Bespoke travertine furniture"} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] bg-muted overflow-hidden mt-8">
                <img src={vantaImage} alt={isNL ? "Maatwerk marmeren tafel" : "Bespoke marble table"} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 lg:py-12 bg-ivory/50 border-y border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <TrustBadges variant="horizontal" />
        </div>
      </section>

      {/* Pricing Examples */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="mb-12">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {isNL ? 'Prijsindicatie' : 'Price Indication'}
            </p>
            <h2 className="font-serif text-display-sm text-foreground">
              {isNL ? 'Vanafprijzen per categorie' : 'Starting prices by category'}
            </h2>
            <p className="text-muted-foreground text-body-md mt-4 max-w-2xl">
              {isNL 
                ? 'Onderstaande prijzen zijn richtprijzen voor standaard afmetingen in travertin. Exacte prijs afhankelijk van materiaal, afmetingen en afwerking.'
                : 'Below prices are guide prices for standard dimensions in travertine. Exact price depends on material, dimensions and finish.'}
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {priceExamples.map((item, index) => (
              <div key={index} className="p-6 bg-secondary/30 border border-border/50">
                <h3 className="font-serif text-lg text-foreground mb-2">{item.type}</h3>
                <p className="font-serif text-2xl text-foreground mb-2">{item.from}</p>
                <p className="text-xs text-muted-foreground">{item.example}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            {isNL 
              ? 'Calacatta Viola en andere zeldzame steensoorten op aanvraag. Prijzen exclusief BTW.'
              : 'Calacatta Viola and other rare stones on request. Prices exclude VAT.'}
          </p>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {t('bespoke.journeySubtitle')}
              </p>
              <h2 className="font-serif text-display-sm text-foreground mb-6">
                {isNL ? 'Van idee tot meubel in 5 stappen' : 'From idea to furniture in 5 steps'}
              </h2>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-8">
                {isNL 
                  ? 'Elk maatwerktraject volgt dezelfde zorgvuldige aanpak. U blijft betrokken bij elke stap, van eerste schets tot plaatsing.'
                  : 'Every bespoke project follows the same careful approach. You stay involved at every step, from first sketch to installation.'}
              </p>
              <BespokeTimeline />
            </div>
            
            <div className="lg:pt-16">
              <div className="bg-background p-8 border border-border/50">
                <h3 className="font-serif text-xl text-foreground mb-4">
                  {isNL ? 'Wat u krijgt' : 'What you receive'}
                </h3>
                <USPBullets className="mb-6" />
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-forest">✓</span>
                    {isNL ? 'Gedetailleerde schetsen en 3D-visualisaties' : 'Detailed sketches and 3D visualizations'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-forest">✓</span>
                    {isNL ? 'Materiaalmonsters ter goedkeuring' : 'Material samples for approval'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-forest">✓</span>
                    {isNL ? 'Foto-updates tijdens productie' : 'Photo updates during production'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-forest">✓</span>
                    {isNL ? 'Onderhoudsinstructies en certificaat' : 'Care instructions and certificate'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Options */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="text-center mb-12">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {isNL ? 'Hoe wilt u beginnen?' : 'How would you like to start?'}
            </h2>
            <p className="text-muted-foreground text-body-md max-w-xl mx-auto">
              {isNL 
                ? 'Kies de aanpak die bij u past. Alle opties zijn vrijblijvend.'
                : 'Choose the approach that suits you. All options are no-obligation.'}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ctaOptions.map((option, index) => (
              <div 
                key={index} 
                className={`p-8 border ${option.primary ? 'bg-foreground text-background border-foreground' : 'bg-background border-border/50'}`}
              >
                <option.icon className={`w-8 h-8 mb-4 ${option.primary ? 'text-background' : 'text-foreground'}`} />
                <h3 className={`font-serif text-xl mb-3 ${option.primary ? 'text-background' : 'text-foreground'}`}>
                  {option.title}
                </h3>
                <p className={`text-sm mb-6 ${option.primary ? 'text-background/80' : 'text-muted-foreground'}`}>
                  {option.description}
                </p>
                <Button 
                  asChild 
                  variant={option.primary ? 'outline' : 'atelier'} 
                  size="sm"
                  className={option.primary ? 'border-background/40 text-background hover:bg-background hover:text-foreground' : ''}
                >
                  <a href="#offerte">{option.cta}</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="offerte" className="section-padding bg-foreground text-background scroll-mt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <header className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/60 mb-4">
                {isNL ? 'Offerte aanvragen' : 'Request quote'}
              </p>
              <h2 className="font-serif text-display-sm">
                {isNL ? 'Vertel ons over uw project' : 'Tell us about your project'}
              </h2>
              <p className="text-background/70 text-body-md mt-4">
                {isNL 
                  ? 'Vul onderstaand formulier in en ontvang binnen 48 uur een vrijblijvend voorstel.'
                  : 'Fill in the form below and receive a no-obligation proposal within 48 hours.'}
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
                <p className="text-xs text-background/50 text-center mt-4">
                  {isNL 
                    ? 'Wij reageren binnen 48 uur. Geen verplichtingen, geen spam.'
                    : 'We respond within 48 hours. No obligations, no spam.'}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bespoke;
