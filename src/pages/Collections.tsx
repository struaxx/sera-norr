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

// Tab button component for section navigation
const TabButton = ({ onClick, label }: { onClick: () => void; label: string }) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className={`
        text-[11px] uppercase tracking-[0.15em] font-medium
        transition-all duration-200 pb-2 border-b
        ${isActive 
          ? 'text-foreground border-foreground' 
          : 'text-muted-foreground/60 border-transparent hover:text-foreground hover:border-foreground/50'
        }
      `}
    >
      {label}
    </button>
  );
};

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
      <section className="pt-28 lg:pt-36 pb-8 lg:pb-10 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-4 opacity-60 text-[10px]" />
          
          <header className="max-w-3xl mb-5">
            <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-4">
              {t("collections.hero.title")}
            </h1>
            <p className="text-muted-foreground text-body-md leading-relaxed max-w-2xl">
              {t("collections.hero.intro")}
            </p>
          </header>

          {/* CTA Button */}
          <div className="mb-6">
            <Button asChild variant="atelier-filled" size="sm" className="text-xs px-5 py-2.5">
              <Link to="/bespoke">
                {t("collections.hero.ctaPrimary")}
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Section Navigation Tabs */}
          <nav className="flex gap-6 lg:gap-8 border-t border-border/30 pt-4">
            <TabButton 
              onClick={() => scrollToSection('vanta')}
              label="VANTA"
            />
            <TabButton 
              onClick={() => scrollToSection('terra')}
              label="TERRA"
            />
            <TabButton 
              onClick={() => scrollToSection('andere-steensoorten')}
              label={isNL ? 'ANDERE STEENSOORTEN' : 'OTHER STONES'}
            />
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
      <section id="andere-steensoorten" className="py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Image */}
            <div className="image-reveal">
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                <img
                  src={otherStonesImage}
                  alt={isNL ? "Materiaalmonsters en ontwerptekening voor maatwerk steenmeubels" : "Material samples and design drawing for bespoke stone furniture"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-display-sm text-foreground mb-1">
                {t("collections.other.name")}
              </h2>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80 mb-4">
                {t("collections.other.subtitle")}
              </p>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-5 max-w-lg">
                {t("collections.other.description")}
              </p>

              {/* Info bullets - refined */}
              <div className="mb-5 space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{t("collections.other.bullet1")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{t("collections.other.bullet2")}</span>
                </div>
              </div>

              {/* CTA */}
              <div>
                <Button asChild variant="atelier">
                  <Link to="/materials">
                    {t("collections.other.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
