import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Award, Settings } from "lucide-react";
import { SEOHead, organizationSchema } from "@/components/seo";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/hero-homepage.png";

const Index = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

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
    ? "SERA NORR — Luxe Stenen Meubels op Maat | Atelier" 
    : "SERA NORR — Luxury Bespoke Stone Furniture | Atelier";
  
  const seoDescription = isNL
    ? "Luxe stenen meubels op maat gemaakt in ons Europees atelier. Travertin, marmer en andere steensoorten. 5 jaar garantie, white-glove levering."
    : "Luxury stone furniture custom made in our European atelier. Travertine, marble and other stone types. 5-year warranty, white-glove delivery.";

  const seoKeywords = isNL
    ? "luxe stenen meubels, marmeren tafel op maat, travertin tafel, maatwerk meubels, stenen eettafel, Calacatta Viola, design meubels"
    : "luxury stone furniture, bespoke marble table, travertine table, custom furniture, stone dining table, Calacatta Viola, designer furniture";

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

  const whyReasons = [
    { key: 'craftsmanship', icon: Award },
    { key: 'warranty', icon: Shield },
    { key: 'delivery', icon: Truck },
    { key: 'materials', icon: Settings }
  ];

  // Get starting price from collection name (mapped values)
  const getStartingPrice = (handle: string) => {
    const prices: Record<string, string> = {
      'terra': '€4.200',
      'vanta': '€6.800',
    };
    return prices[handle.toLowerCase()] || '€4.000';
  };

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        structuredData={organizationSchema}
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
          <h1 className="font-serif text-display-lg lg:text-display-xl text-background mb-6 leading-[1.1]">
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
              <Link to="/bespoke">
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
                        {collection.node.description}
                      </p>
                    )}
                    <p className="font-sans text-sm text-foreground">
                      {t('home.collections.startingFrom')} {getStartingPrice(collection.node.handle)}
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

      {/* Process Section - 3 Steps */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="font-serif text-display-sm mb-3">
              {t('home.process.title')}
            </h2>
            <p className="text-muted-foreground text-body-md leading-relaxed">
              {t('home.process.description')}
            </p>
          </div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-base">1</span>
              </div>
              <h3 className="font-serif text-base mb-2">{t('home.process.step1.title')}</h3>
              <p className="text-muted-foreground text-sm">{t('home.process.step1.description')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-base">2</span>
              </div>
              <h3 className="font-serif text-base mb-2">{t('home.process.step2.title')}</h3>
              <p className="text-muted-foreground text-sm">{t('home.process.step2.description')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-base">3</span>
              </div>
              <h3 className="font-serif text-base mb-2">{t('home.process.step3.title')}</h3>
              <p className="text-muted-foreground text-sm">{t('home.process.step3.description')}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-4">{t('home.process.promise')}</p>
          </div>
        </div>
      </section>

      {/* Why SERA NORR Section - Compact */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="font-serif text-display-sm text-foreground mb-3">
              {t('home.why.title')}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {whyReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <div key={reason.key} className="text-center">
                  <Icon className="h-6 w-6 text-foreground mx-auto mb-3" />
                  <h3 className="font-serif text-base text-foreground mb-1">
                    {t(`home.why.${reason.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t(`home.why.${reason.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statement Section - Compact */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="font-serif text-xl lg:text-2xl text-foreground text-center max-w-2xl mx-auto">
            {t('home.statement')}
          </p>
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
              <Link to="/bespoke">
                {t('home.closing.cta')}
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