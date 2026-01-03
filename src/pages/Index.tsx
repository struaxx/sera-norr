import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Award, Settings, Palette, MessageSquare } from "lucide-react";
import { SEOHead, baseSchema } from "@/components/seo";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { PremiumTimeline, TimelineStep } from "@/components/ui/premium-timeline";
import { PremiumFeatureCards, FeatureCard } from "@/components/ui/premium-feature-cards";
import { SectionBand, SectionHeader } from "@/components/ui/section-band";
import { usePageTracking, useCTATracking } from "@/hooks/use-tracking";
import heroImage from "@/assets/hero-homepage.png";

const Index = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackProposal } = useCTATracking();
  
  // Track page view
  usePageTracking();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(10);
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  const seoTitle = isNL 
    ? "SERA NORR — Luxe natuursteen meubels op maat | Online atelier" 
    : "SERA NORR — Luxury Natural Stone Furniture | Online Atelier";
  
  const seoDescription = isNL
    ? "Online atelier voor maatwerk tafels en consoles in travertin en marmer. Van ontwerp en visualisatie tot white-glove levering in Nederland."
    : "Online atelier for bespoke tables and consoles in travertine and marble. From design and visualization to white-glove delivery in the Netherlands.";

  const seoKeywords = isNL
    ? "SERA NORR, online atelier, maatwerk natuursteenmeubels, travertin tafel, marmeren tafel op maat, Calacatta Viola, stenen eettafel"
    : "SERA NORR, online atelier, bespoke natural stone furniture, travertine table, custom marble table, Calacatta Viola, stone dining table";

  const routes = [
    {
      icon: Settings,
      titleKey: 'home.routes.bespoke.title',
      descriptionKey: 'home.routes.bespoke.description',
      ctaKey: 'home.routes.bespoke.cta',
      link: '/bespoke'
    },
    {
      icon: Award,
      titleKey: 'home.routes.configurator.title',
      descriptionKey: 'home.routes.configurator.description',
      ctaKey: 'home.routes.configurator.cta',
      link: '/bespoke'
    }
  ];

  // Process steps for premium timeline
  const processSteps: TimelineStep[] = isNL ? [
    { 
      number: '01', 
      title: 'Intake & advies', 
      description: 'Vrijblijvend gesprek over uw wensen, ruimte en steenvoorkeur.', 
      detail: 'Binnen 24 uur reactie' 
    },
    { 
      number: '02', 
      title: 'Voorstel & visualisatie', 
      description: 'Schets, materiaalopties en offerte op maat.', 
      detail: 'Voorstel in 48 uur' 
    },
    { 
      number: '03', 
      title: 'Productie & levering', 
      description: 'Vakkundige productie en white-glove plaatsing.', 
      detail: '12–16 weken doorlooptijd' 
    },
  ] : [
    { 
      number: '01', 
      title: 'Consultation', 
      description: 'No-obligation conversation about your wishes, space and stone preference.', 
      detail: 'Response within 24 hours' 
    },
    { 
      number: '02', 
      title: 'Proposal & visualization', 
      description: 'Sketch, material options and tailored quote.', 
      detail: 'Proposal in 48 hours' 
    },
    { 
      number: '03', 
      title: 'Production & delivery', 
      description: 'Expert production and white-glove installation.', 
      detail: '12–16 weeks lead time' 
    },
  ];

  // Feature cards for "Why SERA NORR"
  const featureCards: FeatureCard[] = [
    { 
      icon: Award, 
      title: t('home.why.craftsmanship.title'), 
      description: t('home.why.craftsmanship.description') 
    },
    { 
      icon: Shield, 
      title: t('home.why.warranty.title'), 
      description: t('home.why.warranty.description') 
    },
    { 
      icon: Truck, 
      title: t('home.why.delivery.title'), 
      description: t('home.why.delivery.description') 
    },
    { 
      icon: Palette, 
      title: t('home.why.materials.title'), 
      description: t('home.why.materials.description') 
    },
  ];

  const whyReasons = [
    { key: 'craftsmanship', icon: Award },
    { key: 'warranty', icon: Shield },
    { key: 'delivery', icon: Truck },
    { key: 'materials', icon: Settings }
  ];

  // Get price display for collections (now "on request" instead of prices)
  const getPriceDisplay = () => {
    return isNL ? 'Prijs op aanvraag' : 'Price on request';
  };

  // Get Dutch description for collections
  const getCollectionDescription = (handle: string, originalDescription: string) => {
    if (!isNL) return originalDescription;
    
    const handleLower = handle.toLowerCase();
    
    if (handleLower.includes('vanta')) {
      return 'De VANTA Collectie is vervaardigd uit Calacatta Viola marmer, een zeldzame steen bekend om zijn rijke paarse adering en luxueuze uitstraling. Elk stuk is uniek in kleur en karakter.';
    }
    if (handleLower.includes('terra')) {
      return 'De TERRA Collectie is vervaardigd uit natuurlijk travertin, een steen gewaardeerd om zijn warme beigetinten en tijdloze karakter. Elke tafel toont unieke lagen en texturen gevormd door eeuwen.';
    }
    
    return originalDescription;
  };

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        structuredData={baseSchema}
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={isNL ? "SERA NORR - Luxe stenen meubels op maat gemaakt" : "SERA NORR - Luxury bespoke stone furniture"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl stagger-children">
          <h1 className="font-serif font-medium text-display-lg lg:text-display-xl text-background mb-6 leading-[1.1] tracking-wide">
            {isNL ? "Sculpturale vormen in natuursteen." : "Sculptural forms in natural stone."}
          </h1>
          <p className="font-sans text-base lg:text-lg text-background/85 max-w-xl mx-auto mb-10 leading-relaxed">
            {isNL 
              ? "Travertin, marmer en geselecteerde steensoorten. Op maat gemaakt voor uw ruimte." 
              : "Travertine, marble and selected stone types. Custom made for your space."}
          </p>
          
          {/* Primary + Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/collections/vanta">
                {isNL ? "Ontdek VANTA" : "Discover VANTA"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/60 text-background hover:bg-background/10">
              <Link to="/bespoke" onClick={trackProposal}>
                {isNL ? "Vraag voorstel aan" : "Request proposal"}
              </Link>
            </Button>
          </div>

          {/* Subtle text link to all collections */}
          <Link 
            to="/collections" 
            className="inline-flex items-center text-background/70 hover:text-background text-sm transition-colors mb-12"
          >
            {isNL ? "Bekijk alle collecties" : "View all collections"}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>

          {/* Trust Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-background/80 text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>{t('home.hero.trust.craftsmanship')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-background/30" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>{t('home.hero.trust.warranty')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-background/30" />
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>{t('home.hero.trust.delivery')}</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-background/60">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em]">{t('home.scroll')}</span>
          <div className="w-px h-12 bg-background/30" />
        </div>
      </section>

      {/* Collections Showroom Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-10 lg:mb-12">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {t('home.collections.title')}
            </h2>
            <p className="text-muted-foreground text-body-md leading-relaxed">
              {t('home.collections.description')}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6">
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/3] w-full mb-4" />
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6">
              {collections.map((collection) => (
                <Link
                  key={collection.node.id}
                  to={`/collections/${collection.node.handle}`}
                  className="group block"
                >
                  <article className="aspect-[4/3] bg-muted mb-4 overflow-hidden">
                    {collection.node.image ? (
                      <img
                        src={collection.node.image.url}
                        alt={collection.node.image.altText || `${collection.node.title} ${isNL ? 'collectie' : 'collection'}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                        <span className="text-muted-foreground font-serif text-2xl">{collection.node.title}</span>
                      </div>
                    )}
                  </article>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl text-foreground">
                      {collection.node.title}
                    </h3>
                    {collection.node.description && (
                      <p className="font-sans text-sm text-muted-foreground line-clamp-2">
                        {getCollectionDescription(collection.node.handle, collection.node.description)}
                      </p>
                    )}
                    <p className="font-sans text-sm text-muted-foreground">
                      {getPriceDisplay()}
                    </p>
                    <span className="inline-flex items-center text-foreground text-sm font-medium group-hover:translate-x-1 transition-transform pt-2">
                      {t('home.collections.viewCollection')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {isNL ? 'Geen collecties gevonden.' : 'No collections found.'}
            </p>
          )}

          <p className="text-muted-foreground text-sm">
            {t('home.collections.other')}
          </p>
        </div>
      </section>

      {/* Choose Your Route Section - Compact */}
      <section className="py-16 lg:py-20 bg-secondary/20 border-y border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="font-serif text-display-sm text-foreground mb-3">
              {t('home.routes.title')}
            </h2>
            <p className="text-muted-foreground text-body-md max-w-xl mx-auto">
              {t('home.routes.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {routes.map((route, index) => {
              const Icon = route.icon;
              return (
                <Link
                  key={index}
                  to={route.link}
                  className="group p-6 bg-background hover:bg-secondary/30 transition-all duration-300 border border-border/30"
                >
                  <Icon className="h-6 w-6 text-foreground mb-4" />
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    {t(route.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {t(route.descriptionKey)}
                  </p>
                  <span className="inline-flex items-center text-foreground text-sm font-medium group-hover:translate-x-1 transition-transform">
                    {t(route.ctaKey)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section - Premium Horizontal Timeline */}
      <SectionBand variant="default" size="lg">
        <SectionHeader
          eyebrow={isNL ? 'Werkwijze' : 'Process'}
          title={t('home.process.title')}
          description={t('home.process.description')}
          centered
        />
        
        <PremiumTimeline steps={processSteps} className="max-w-4xl mx-auto" />
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">{t('home.process.promise')}</p>
        </div>
      </SectionBand>

      {/* Why SERA NORR Section - Premium Feature Cards */}
      <SectionBand variant="sand" size="lg">
        <SectionHeader
          title={t('home.why.title')}
          centered
        />
        
        <PremiumFeatureCards 
          cards={featureCards} 
          columns={2} 
          className="max-w-3xl mx-auto"
        />
      </SectionBand>

      {/* Statement Section - Editorial */}
      <SectionBand variant="default" size="md">
        <p className="font-serif text-xl lg:text-2xl text-foreground text-center max-w-2xl mx-auto leading-relaxed">
          {t('home.statement')}
        </p>
      </SectionBand>

      {/* Lookbook Module */}
      <SectionBand variant="cream" size="md" withDivider>
        <div className="max-w-xl mx-auto text-center">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            {isNL ? 'Inspiratie' : 'Inspiration'}
          </p>
          <h2 className="font-serif text-display-sm text-foreground mb-4">
            {isNL ? 'Voorbeelden uit het atelier' : 'Examples from the atelier'}
          </h2>
          <p className="text-muted-foreground text-body-md mb-8">
            {isNL ? 'Ontvang toegang tot het lookbook.' : 'Get access to the lookbook.'}
          </p>
          <Button asChild variant="atelier" size="lg">
            <Link to="/lookbook">
              {isNL ? 'Bekijk online voorbeelden' : 'View online examples'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionBand>

      {/* Care & Protection Module */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-display-sm text-foreground mb-3 text-center">
              {isNL ? 'Onderhoud & bescherming' : 'Care & protection'}
            </h2>
            <p className="text-muted-foreground text-body-md text-center mb-6">
              {isNL 
                ? 'Natuursteen blijft het mooist met de juiste bescherming en eenvoudig onderhoud. Wij adviseren wat past bij uw gebruik en kunnen bescherming meenemen in het voorstel.'
                : 'Natural stone looks best with proper protection and simple care. We advise what suits your use and can include protection in the proposal.'}
            </p>
            <ul className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full" />
                {isNL ? 'Vlekbescherming & impregnatie' : 'Stain protection & sealing'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full" />
                {isNL ? 'Eenvoudige dagelijkse care' : 'Simple daily care'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full" />
                {isNL ? 'Langdurige schoonheid' : 'Lasting beauty'}
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="atelier" size="lg">
                <Link to="/care">
                  {isNL ? 'Lees over care' : 'Read about care'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/voorstel">
                  {isNL ? 'Ontvang voorstel' : 'Receive proposal'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-16 lg:py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-display-sm mb-4">
              {t('home.closing.title')}
            </h2>
            <p className="text-background/80 text-body-md leading-relaxed mb-6">
              {t('home.closing.description')}
            </p>
            <p className="text-background/60 text-sm mb-8">
              {t('home.closing.deliverables')}
            </p>
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/voorstel">
                {isNL ? 'Ontvang voorstel binnen 48 uur' : 'Receive proposal within 48 hours'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;