import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hairline } from "@/components/ui/hairline";
import { ProofGrid } from "@/components/ui/proof-grid";
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

  const getCollectionImage = (handle: string) => {
    const collection = collections.find(c => 
      c.node.handle.toLowerCase() === handle.toLowerCase() ||
      c.node.title.toLowerCase().includes(handle.toLowerCase())
    );
    
    if (collection?.node.image?.url) return collection.node.image.url;
    
    const matchingProduct = products.find(p => 
      p.node.title.toLowerCase().includes(handle.toLowerCase()) ||
      p.node.handle.toLowerCase().includes(handle.toLowerCase())
    );
    
    if (matchingProduct?.node.images?.edges?.[0]?.node?.url) {
      return matchingProduct.node.images.edges[0].node.url;
    }
    
    if (handle === 'vanta') return vantaFallback;
    if (handle === 'terra') return terraFallback;
    return null;
  };

  const seoTitle = isNL 
    ? "Collecties | SERA NORR — Online Atelier voor Natuursteen Meubels"
    : "Collections | SERA NORR — Online Atelier for Natural Stone Furniture";

  const seoDescription = isNL
    ? "Ontdek de SERA NORR collecties: travertin, Calacatta Viola en geselecteerde natuurstenen."
    : "Discover SERA NORR collections: travertine, Calacatta Viola and selected natural stones.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Collecties' : 'Collections', url: '/collections' },
  ]);

  const proofItems = isNL ? [
    { title: 'Op maat gemaakt', description: 'Elk stuk naar uw specificaties.' },
    { title: 'White-glove levering', description: 'Plaatsing in NL en België.' },
    { title: 'Geselecteerde materialen', description: 'Travertin, marmer, natuursteen.' },
  ] : [
    { title: 'Made to measure', description: 'Each piece to your specifications.' },
    { title: 'White-glove delivery', description: 'Installation in NL and Belgium.' },
    { title: 'Selected materials', description: 'Travertine, marble, natural stone.' },
  ];

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "SERA NORR, collecties, travertin meubels, Calacatta Viola marmer" 
          : "SERA NORR, collections, travertine furniture, Calacatta Viola marble"}
        structuredData={breadcrumbSchema}
      />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8 opacity-60 text-[10px]" />
          
          <div className="max-w-3xl">
            <p className="micro-label mb-6">
              {isNL ? 'Collecties' : 'Collections'}
            </p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {isNL ? "Travertin & marmer" : "Travertine & marble"}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl mb-10">
              {isNL 
                ? "Twee signatuurcollecties, elk met een eigen karakter."
                : "Two signature collections, each with its own character."}
            </p>
            <Button asChild variant="sera-primary" size="lg">
              <Link to="/bespoke">
                {isNL ? "Start uw project" : "Start your project"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* VANTA Collection - Editorial Split */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section hairline */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">01</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="image-reveal">
              <Link to="/collections/vanta">
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  {loading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <img
                      src={getCollectionImage('vanta') || vantaFallback}
                      alt={isNL ? "VANTA collectie - Calacatta Viola marmer" : "VANTA collection - Calacatta Viola marble"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Link>
            </div>

            {/* Content */}
            <div>
              <p className="editorial-caption-label mb-4">
                Calacatta Viola
              </p>
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
                VANTA
              </h2>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-10 max-w-md">
                {isNL 
                  ? "Rijke paarse adering in zeldzaam Italiaans marmer. Elk stuk is uniek."
                  : "Rich purple veining in rare Italian marble. Every piece is unique."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="sera-primary" size="lg">
                  <Link to="/collections/vanta">
                    {isNL ? "Ontdek VANTA" : "Discover VANTA"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="sera-secondary" size="lg">
                  <Link to="/bespoke">
                    {isNL ? "Vraag voorstel aan" : "Request proposal"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERRA Collection - Editorial Split (Reversed) */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section hairline */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">02</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <p className="editorial-caption-label mb-4">
                Travertin
              </p>
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
                TERRA
              </h2>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-10 max-w-md">
                {isNL 
                  ? "Warme beigetinten en tijdloze texturen. Natuurlijk travertin gevormd door eeuwen."
                  : "Warm beige tones and timeless textures. Natural travertine formed over centuries."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="sera-primary" size="lg">
                  <Link to="/collections/terra">
                    {isNL ? "Ontdek TERRA" : "Discover TERRA"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="sera-secondary" size="lg">
                  <Link to="/bespoke">
                    {isNL ? "Vraag voorstel aan" : "Request proposal"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 image-reveal">
              <Link to="/collections/terra">
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  {loading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <img
                      src={getCollectionImage('terra') || terraFallback}
                      alt={isNL ? "TERRA collectie - Travertin meubels" : "TERRA collection - Travertine furniture"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other Stones - Editorial Split */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section hairline */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Maatwerk' : 'Bespoke'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="image-reveal">
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img
                  src={otherStonesImage}
                  alt={isNL ? "Materiaalmonsters voor maatwerk" : "Material samples for bespoke"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="editorial-caption-label mb-4">
                {isNL ? 'Op aanvraag' : 'On request'}
              </p>
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
                {isNL ? "Andere steensoorten" : "Other stone types"}
              </h2>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-10 max-w-md">
                {isNL 
                  ? "Naast onze collecties werken we met diverse geselecteerde steensoorten."
                  : "In addition to our collections, we work with various selected stone types."}
              </p>
              <Button asChild variant="sera-secondary" size="lg">
                <Link to="/materials">
                  {isNL ? "Bekijk materialen" : "View materials"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Grid */}
      <section className="py-20 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <ProofGrid items={proofItems} />
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-sm text-background mb-4">
              {isNL ? "Maatwerk in uw afmeting?" : "Bespoke in your dimensions?"}
            </h2>
            <p className="text-background/70 text-body-md mb-10">
              {isNL ? "Ontvang voorstel binnen 48 uur." : "Receive proposal within 48 hours."}
            </p>
            <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
              <Link to="/voorstel">
                {isNL ? "Ontvang voorstel" : "Receive proposal"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
