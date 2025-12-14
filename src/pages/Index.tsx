import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/shop";
import { SEOHead, organizationSchema } from "@/components/seo";
import { TrustBadges } from "@/components/trust";
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
    ? "SERA NORR — Luxe Stenen Meubels & Maatwerk Atelier" 
    : "SERA NORR — Luxury Stone Furniture & Bespoke Atelier";
  
  const seoDescription = isNL
    ? "Sculpturale stenen meubels vervaardigd in Europa. Travertin, Calacatta Viola en andere zeldzame steensoorten. Maatwerk marmeren tafels en design meubels."
    : "Sculptural stone furniture crafted in Europe. Travertine, Calacatta Viola and other rare stones. Bespoke marble tables and designer furniture.";

  const seoKeywords = isNL
    ? "stenen meubels, marmeren tafel, travertin tafel, luxe meubels, maatwerk meubels, Calacatta Viola, design tafel, natuursteen meubels"
    : "stone furniture, marble table, travertine table, luxury furniture, bespoke furniture, Calacatta Viola, designer table, natural stone furniture";

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
            alt={isNL ? "SERA NORR - Sculpturale stenen meubels van travertin en Calacatta Viola marmer" : "SERA NORR - Sculptural stone furniture from travertine and Calacatta Viola marble"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl stagger-children">
          <h1 className="font-serif text-display-lg lg:text-display-xl text-background mb-8 text-balance">
            {t('home.hero.title')}
          </h1>
          <p className="font-sans text-base lg:text-lg text-background/90 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>
          <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
            <Link to="/bespoke">
              {t('home.hero.cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-background/60">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em]">{t('home.scroll')}</span>
          <div className="w-px h-12 bg-background/30" />
        </div>
      </section>

      {/* Trust Section - New */}
      <section className="py-12 lg:py-16 bg-ivory/50 border-b border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <TrustBadges variant="horizontal" />
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground text-body-lg lg:text-xl leading-relaxed">
              {t('home.intro.text')}
            </p>
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

      {/* Shop Section */}
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

      {/* Materials Section */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-display-sm text-foreground mb-6">
              {t('home.materials.title')}
            </h2>
            <p className="text-muted-foreground text-body-lg leading-relaxed mb-8">
              {t('home.materials.description')}
            </p>
            <Button asChild variant="link" className="p-0 text-foreground hover:text-muted-foreground">
              <Link to="/collections">
                {t('home.materials.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Configurator Section */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-display-sm text-foreground mb-6">
              {t('home.configurator.title')}
            </h2>
            <p className="text-muted-foreground text-body-lg leading-relaxed mb-8">
              {t('home.configurator.description')}
            </p>
            <Button asChild variant="link" className="p-0 text-foreground hover:text-muted-foreground">
              <Link to="/bespoke">
                {t('home.configurator.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
