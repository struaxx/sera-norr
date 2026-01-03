import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionBand, SectionHeader } from "@/components/ui/section-band";
import { TrustBand } from "@/components/ui/trust-band";
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

  const trustItems = isNL ? [
    { text: 'Op maat gemaakt' },
    { text: 'White-glove levering' },
    { text: 'Geselecteerde materialen' },
  ] : [
    { text: 'Made to measure' },
    { text: 'White-glove delivery' },
    { text: 'Selected materials' },
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
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-6 opacity-60 text-[10px]" />
          
          <div className="max-w-3xl">
            <p className="text-eyebrow uppercase text-muted-foreground mb-4">
              {isNL ? 'Collecties' : 'Collections'}
            </p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {isNL ? "Travertin & marmer" : "Travertine & marble"}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              {isNL 
                ? "Twee signatuurcollecties, elk met een eigen karakter. Op maat gemaakt naar uw specificaties."
                : "Two signature collections, each with its own character. Made to measure to your specifications."}
            </p>
            <Button asChild variant="atelier-filled" size="lg">
              <Link to="/bespoke">
                {isNL ? "Start uw project" : "Start your project"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* VANTA Collection - Editorial Split */}
      <SectionBand variant="default" size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image */}
          <div className="image-reveal">
            <Link to="/collections/vanta">
              <div className="aspect-[4/5] bg-muted overflow-hidden">
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
            <p className="text-eyebrow uppercase text-muted-foreground mb-4">
              Calacatta Viola
            </p>
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
              VANTA
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {isNL 
                ? "Rijke paarse adering in zeldzaam Italiaans marmer. Elk stuk is uniek in kleur en karakter."
                : "Rich purple veining in rare Italian marble. Every piece is unique in color and character."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="atelier-filled" size="lg">
                <Link to="/collections/vanta">
                  {isNL ? "Ontdek VANTA" : "Discover VANTA"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/bespoke">
                  {isNL ? "Vraag voorstel aan" : "Request proposal"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionBand>

      {/* TERRA Collection - Editorial Split (Reversed) */}
      <SectionBand variant="sand" size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <p className="text-eyebrow uppercase text-muted-foreground mb-4">
              Travertin
            </p>
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
              TERRA
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {isNL 
                ? "Warme beigetinten en tijdloze texturen. Natuurlijk travertin gevormd door eeuwen."
                : "Warm beige tones and timeless textures. Natural travertine formed over centuries."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="atelier-filled" size="lg">
                <Link to="/collections/terra">
                  {isNL ? "Ontdek TERRA" : "Discover TERRA"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/bespoke">
                  {isNL ? "Vraag voorstel aan" : "Request proposal"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 image-reveal">
            <Link to="/collections/terra">
              <div className="aspect-[4/5] bg-muted overflow-hidden">
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
      </SectionBand>

      {/* Other Stones - Editorial Split */}
      <SectionBand variant="default" size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image */}
          <div className="image-reveal">
            <div className="aspect-[4/5] bg-muted overflow-hidden">
              <img
                src={otherStonesImage}
                alt={isNL ? "Materiaalmonsters voor maatwerk" : "Material samples for bespoke"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-eyebrow uppercase text-muted-foreground mb-4">
              {isNL ? 'Op aanvraag' : 'On request'}
            </p>
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
              {isNL ? "Andere steensoorten" : "Other stone types"}
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {isNL 
                ? "Naast onze collecties werken we met diverse geselecteerde steensoorten. Steenkeuze stemmen we af tijdens de intake."
                : "In addition to our collections, we work with various selected stone types. Stone choice is aligned during the intake."}
            </p>
            <Button asChild variant="atelier" size="lg">
              <Link to="/materials">
                {isNL ? "Bekijk materialen" : "View materials"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </SectionBand>

      {/* Trust Band */}
      <TrustBand items={trustItems} />

      {/* CTA Band */}
      <SectionBand variant="dark" size="md">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-display-sm text-background mb-4">
            {isNL ? "Maatwerk in uw afmeting?" : "Bespoke in your dimensions?"}
          </h2>
          <p className="text-background/70 text-body-md mb-8">
            {isNL ? "Ontvang voorstel binnen 48 uur." : "Receive proposal within 48 hours."}
          </p>
          <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
            <Link to="/voorstel">
              {isNL ? "Ontvang voorstel" : "Receive proposal"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionBand>
    </Layout>
  );
};

export default Collections;
