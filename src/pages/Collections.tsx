import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { fetchCollections, fetchProducts, ShopifyCollection, ShopifyProduct } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import vantaFallback from "@/assets/vanta-collection.jpg";
import terraFallback from "@/assets/terra-collection.jpg";
import otherStonesImage from "@/assets/other-stones-materials.png";

const Collections = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [collectionsData, productsData] = await Promise.all([
          fetchCollections(10),
          fetchProducts(20)
        ]);
        setCollections(collectionsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get collection image from Shopify collection or product images
  const getCollectionImage = (handle: string) => {
    // First try to get collection image from Shopify
    const collection = collections.find(c => 
      c.node.handle.toLowerCase() === handle.toLowerCase() ||
      c.node.title.toLowerCase().includes(handle.toLowerCase())
    );
    
    if (collection?.node.image?.url) {
      return collection.node.image.url;
    }
    
    // If no collection image, try to get from products
    const matchingProduct = products.find(p => 
      p.node.title.toLowerCase().includes(handle.toLowerCase()) ||
      p.node.handle.toLowerCase().includes(handle.toLowerCase())
    );
    
    if (matchingProduct?.node.images?.edges?.[0]?.node?.url) {
      return matchingProduct.node.images.edges[0].node.url;
    }
    
    // Fallback to local images
    if (handle === 'vanta') return vantaFallback;
    if (handle === 'terra') return terraFallback;
    return null;
  };

  const seoTitle = isNL 
    ? "Collecties | Travertin & Calacatta Viola Meubels | SERA NORR"
    : "Collections | Travertine & Calacatta Viola Furniture | SERA NORR";

  const seoDescription = isNL
    ? "SERA NORR toont collecties in travertin, Calacatta Viola en geselecteerde steensoorten. Elk stuk op maat, in vorm, maat en detail."
    : "SERA NORR presents collections in travertine, Calacatta Viola and selected stone types. Every piece made to measure, in form, size and detail.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Collecties' : 'Collections', url: '/collections' },
  ]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "collecties, travertin meubels, Calacatta Viola, stenen tafels, marmeren meubels, maatwerk" 
          : "collections, travertine furniture, Calacatta Viola, stone tables, marble furniture, bespoke"}
        structuredData={breadcrumbSchema}
      />

      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-12 lg:pb-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-6" />
          
          <header className="max-w-3xl mb-8">
            <h1 className="font-serif text-display-md text-foreground mb-6">
              {t("collections.hero.title")}
            </h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed">
              {t("collections.hero.intro")}
            </p>
          </header>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <Button asChild variant="atelier-filled">
              <Link to="/bespoke">
                {t("collections.hero.ctaPrimary")}
              </Link>
            </Button>
            <Button asChild variant="atelier">
              <Link to="/collections/vanta">
                {t("collections.hero.ctaSecondary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Anchor Links */}
          <nav className="flex flex-wrap gap-4 border-t border-border/50 pt-5">
            <button 
              onClick={() => scrollToSection('vanta')}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              VANTA
            </button>
            <span className="text-muted-foreground/30">·</span>
            <button 
              onClick={() => scrollToSection('terra')}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              TERRA
            </button>
            <span className="text-muted-foreground/30">·</span>
            <button 
              onClick={() => scrollToSection('andere-steensoorten')}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              {isNL ? 'ANDERE STEENSOORTEN' : 'OTHER STONES'}
            </button>
          </nav>
        </div>
      </section>

      {/* VANTA Collection */}
      <section id="vanta" className="py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Image */}
            <div className="image-reveal">
              <Link to="/collections/vanta">
                <div className="aspect-[4/5] bg-muted overflow-hidden">
                  {loading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <img
                      src={getCollectionImage('vanta') || vantaFallback}
                      alt={isNL ? "VANTA collectie - Calacatta Viola marmer meubels" : "VANTA collection - Calacatta Viola marble furniture"}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}
                </div>
              </Link>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-display-sm text-foreground mb-1">
                {t("collections.vanta.name")}
              </h2>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
                {t("collections.vanta.subtitle")}
              </p>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-6 max-w-lg">
                {t("collections.vanta.editorialCopy")}
              </p>

              {/* Pricing Block */}
              <div className="bg-ivory/50 p-5 mb-6 border border-border/30">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground mb-1">
                  {t("collections.pricing.title")}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("collections.pricing.subtitle")}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-foreground">
                  <span>{t("collections.pricing.diningTables")}</span>
                  <span>{t("collections.pricing.coffeeTables")}</span>
                  <span>{t("collections.pricing.consoles")}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="atelier">
                  <Link to="/collections/vanta">
                    {isNL ? "Ontdek VANTA" : "Discover VANTA"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/bespoke">
                    {t("collections.cta.requestProposal")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERRA Collection */}
      <section id="terra" className="py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center lg:grid-flow-dense">
            {/* Image */}
            <div className="image-reveal lg:col-start-2">
              <Link to="/collections/terra">
                <div className="aspect-[4/5] bg-muted overflow-hidden">
                  {loading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <img
                      src={getCollectionImage('terra') || terraFallback}
                      alt={isNL ? "TERRA collectie - Travertin meubels" : "TERRA collection - Travertine furniture"}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}
                </div>
              </Link>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center lg:col-start-1">
              <h2 className="font-serif text-display-sm text-foreground mb-1">
                {t("collections.terra.name")}
              </h2>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
                {t("collections.terra.subtitle")}
              </p>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-6 max-w-lg">
                {t("collections.terra.editorialCopy")}
              </p>

              {/* Pricing Block */}
              <div className="bg-ivory/50 p-5 mb-6 border border-border/30">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground mb-1">
                  {t("collections.pricing.title")}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("collections.pricing.subtitle")}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-foreground">
                  <span>{t("collections.pricing.diningTables")}</span>
                  <span>{t("collections.pricing.coffeeTables")}</span>
                  <span>{t("collections.pricing.consoles")}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="atelier">
                  <Link to="/collections/terra">
                    {isNL ? "Ontdek TERRA" : "Discover TERRA"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/bespoke">
                    {t("collections.cta.requestProposal")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Stones - Service Block */}
      <section id="andere-steensoorten" className="py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Image with overlay caption */}
            <div className="image-reveal relative">
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                <img
                  src={otherStonesImage}
                  alt={isNL ? "Materiaalmonsters en ontwerptekening voor maatwerk steenmeubels" : "Material samples and design drawing for bespoke stone furniture"}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Overlay caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/60 to-transparent">
                <p className="text-xs uppercase tracking-[0.2em] text-background/90">
                  Verde Alpi · Nero Marquina · {isNL ? "Selectie op aanvraag" : "Selection on request"}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-display-sm text-foreground mb-1">
                {t("collections.other.name")}
              </h2>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
                {t("collections.other.subtitle")}
              </p>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-6 max-w-lg">
                {t("collections.other.description")}
              </p>

              {/* Info bullets */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <span className="w-1 h-1 bg-foreground rounded-full" />
                  <span>{t("collections.other.bullet1")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <span className="w-1 h-1 bg-foreground rounded-full" />
                  <span>{t("collections.other.bullet2")}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Button asChild variant="atelier">
                  <Link to="/materials">
                    {t("collections.other.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Link 
                  to="/bespoke" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("collections.cta.requestProposal")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Van collectie naar voorstel */}
      <section className="py-12 lg:py-16 bg-ivory/50">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="text-center mb-10">
            <h2 className="font-serif text-display-sm text-foreground mb-3">
              {t("collections.process.title")}
            </h2>
          </header>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mb-10">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-3 font-serif text-base">
                1
              </div>
              <h3 className="font-serif text-base text-foreground mb-1">
                {t("collections.process.step1.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("collections.process.step1.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-3 font-serif text-base">
                2
              </div>
              <h3 className="font-serif text-base text-foreground mb-1">
                {t("collections.process.step2.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("collections.process.step2.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-3 font-serif text-base">
                3
              </div>
              <h3 className="font-serif text-base text-foreground mb-1">
                {t("collections.process.step3.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("collections.process.step3.description")}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild variant="atelier-filled" size="lg">
              <Link to="/bespoke">
                {t("collections.process.cta")}
              </Link>
            </Button>
            <p className="text-muted-foreground text-xs mt-3">
              {t("collections.process.microcopy")}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
