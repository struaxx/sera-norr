import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Award, Clock, Settings, ShoppingBag } from "lucide-react";
import { ProductGrid } from "@/components/shop";
import { SEOHead, organizationSchema } from "@/components/seo";
import heroImage from "@/assets/hero-vanta.jpg";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";

const Index = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const collections = [
    {
      id: "terra",
      name: "TERRA",
      material: t('home.collections.terra_material'),
      image: terraImage,
    },
    {
      id: "vanta",
      name: "VANTA",
      material: t('home.collections.vanta_material'),
      image: vantaImage,
    },
  ];

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
      icon: ShoppingBag,
      titleKey: 'home.routes.available.title',
      descriptionKey: 'home.routes.available.description',
      ctaKey: 'home.routes.available.cta',
      link: '/collections'
    },
    {
      icon: Settings,
      titleKey: 'home.routes.bespoke.title',
      descriptionKey: 'home.routes.bespoke.description',
      ctaKey: 'home.routes.bespoke.cta',
      link: '/bespoke'
    },
    {
      icon: Clock,
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
        
        <div className="relative z-10 text-center px-6 max-w-4xl stagger-children">
          <h1 className="font-serif text-display-lg lg:text-display-xl text-background mb-6 text-balance leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="font-sans text-base lg:text-lg text-background/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>
          
          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/collections">
                {t('home.hero.ctaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/60 text-background hover:bg-background/10">
              <Link to="/bespoke">
                {t('home.hero.ctaSecondary')}
              </Link>
            </Button>
          </div>

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

      {/* Choose Your Route Section */}
      <section className="section-padding bg-background border-b border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {t('home.routes.title')}
            </h2>
            <p className="text-muted-foreground text-body-md max-w-2xl mx-auto">
              {t('home.routes.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {routes.map((route, index) => {
              const Icon = route.icon;
              return (
                <Link
                  key={index}
                  to={route.link}
                  className="group p-8 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 border border-border/30"
                >
                  <Icon className="h-8 w-8 text-foreground mb-6" />
                  <h3 className="font-serif text-xl text-foreground mb-3">
                    {t(route.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
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

      {/* Collections Section */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12 lg:mb-16">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {t('home.collections.title')}
            </h2>
            <p className="text-muted-foreground text-body-md leading-relaxed">
              {t('home.collections.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.id}`}
                className="group block"
              >
                <article className="aspect-[4/3] bg-muted mb-6 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={isNL ? `${collection.name} Collectie - ${collection.material} stenen meubels` : `${collection.name} Collection - ${collection.material} stone furniture`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </article>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl text-foreground">
                    {collection.name}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    {collection.material}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-muted-foreground text-sm mb-8">
            {t('home.collections.other')}
          </p>

          <Button asChild variant="link" className="p-0 text-foreground hover:text-muted-foreground">
            <Link to="/collections">
              {t('home.collections.cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Shop Section - Available Pieces */}
      <section className="section-padding bg-background border-t border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12 lg:mb-16">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {t('home.shop.title')}
            </h2>
            <p className="text-muted-foreground text-body-md leading-relaxed">
              {t('home.shop.description')}
            </p>
          </div>

          <ProductGrid limit={6} />
        </div>
      </section>

      {/* Configurator Section - 3 Steps */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="font-serif text-display-sm mb-4">
              {t('home.configurator.title')}
            </h2>
            <p className="text-background/80 text-body-lg leading-relaxed">
              {t('home.configurator.description')}
            </p>
          </div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-lg">1</span>
              </div>
              <h3 className="font-serif text-lg mb-2">{t('home.configurator.step1.title')}</h3>
              <p className="text-background/70 text-sm">{t('home.configurator.step1.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-lg">2</span>
              </div>
              <h3 className="font-serif text-lg mb-2">{t('home.configurator.step2.title')}</h3>
              <p className="text-background/70 text-sm">{t('home.configurator.step2.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-lg">3</span>
              </div>
              <h3 className="font-serif text-lg mb-2">{t('home.configurator.step3.title')}</h3>
              <p className="text-background/70 text-sm">{t('home.configurator.step3.description')}</p>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 mb-4">
              <Link to="/bespoke">
                {t('home.configurator.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-background/60 text-sm">{t('home.configurator.promise')}</p>
          </div>
        </div>
      </section>

      {/* Why SERA NORR Section */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {t('home.why.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <div key={reason.key} className="text-center">
                  <Icon className="h-8 w-8 text-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-lg text-foreground mb-2">
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

      {/* Statement Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="font-serif text-2xl lg:text-3xl text-foreground text-center max-w-3xl mx-auto">
            {t('home.statement')}
          </p>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-sm mb-6">
              {t('home.closing.title')}
            </h2>
            <p className="text-background/80 text-body-lg leading-relaxed mb-10">
              {t('home.closing.description')}
            </p>
            <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
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