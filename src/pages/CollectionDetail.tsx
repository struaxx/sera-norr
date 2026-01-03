import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SEOHead, Breadcrumbs, FAQSection, generateCollectionSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/components/seo";
import { fetchCollectionByHandle, fetchCollections, fetchProducts, ShopifyProduct } from "@/lib/shopify";
import vantaFallback from "@/assets/vanta-collection.jpg";
import terraFallback from "@/assets/terra-collection.jpg";

// Static collection metadata (FAQs, long descriptions, etc.)
const collectionsMetadata: Record<string, {
  subtitle: string;
  subtitleEn: string;
  metaTitle: string;
  metaTitleEn: string;
  metaDescription: string;
  metaDescriptionEn: string;
  keywords: string;
  longDescription: string;
  longDescriptionEn: string;
  materials: string[];
  materialsEn: string[];
  faqs: Array<{ question: string; answer: string }>;
  faqsEn: Array<{ question: string; answer: string }>;
}> = {
  terra: {
    subtitle: "Travertin",
    subtitleEn: "Travertine",
    metaTitle: "TERRA Collectie — Travertin Eettafels & Salontafels",
    metaTitleEn: "TERRA Collection — Travertine Dining & Coffee Tables",
    metaDescription: "Ontdek de TERRA collectie: sculpturale meubels in Italiaans travertin. Eettafels, salontafels en consoles met natuurlijke warmte en tijdloze elegantie.",
    metaDescriptionEn: "Discover the TERRA collection: sculptural furniture in Italian travertine. Dining tables, coffee tables and consoles with natural warmth.",
    keywords: "travertin eettafel, travertin salontafel, stenen meubels, TERRA collectie, Italiaans travertin, natuursteen tafel",
    longDescription: `De TERRA collectie is geworteld in de oeroude warmte van Italiaans travertin—een steensoort die over millennia is gevormd uit minerale bronnen. Het materiaal draagt de herinnering aan water in zich, zichtbaar in de karakteristieke putjes en honingkleurige tinten.

Elk TERRA stuk onthult de natuurlijke expressiviteit van travertin. We werken met de inclusies en oneffenheden van het materiaal, waardoor deze eigenschappen onderdeel worden van het ontwerp in plaats van verborgen gebreken.

Travertin is bij uitstek geschikt voor meubels die warmte en rust moeten uitstralen. De poreuze structuur geeft een tactiele kwaliteit die bij geen ander materiaal voorkomt.`,
    longDescriptionEn: `The TERRA collection is rooted in the ancient warmth of Italian travertine—a stone formed over millennia from mineral springs. The material carries within it the memory of water, visible in its characteristic pitting and honeyed tones.

Each TERRA piece reveals the natural expressiveness of travertine. We work with the material's inclusions and imperfections, allowing these characteristics to become part of the design rather than hidden flaws.

Travertine is ideal for furniture that needs to radiate warmth and calm. The porous structure gives a tactile quality found in no other material.`,
    materials: ["Italiaans Travertin", "Natuurlijke Afwerking", "Geslepen Oppervlak"],
    materialsEn: ["Italian Travertine", "Natural Finish", "Honed Surface"],
    faqs: [
      { question: "Wat is travertin en waarom is het geschikt voor meubels?", answer: "Travertin is een natuursteen gevormd uit kalkafzettingen van minerale bronnen. Het heeft een warme, honingkleurige tint en een karakteristieke poreuze structuur. De steen is sterk genoeg voor dagelijks gebruik en ontwikkelt met de tijd een mooie patina." },
      { question: "Kan ik de afmetingen van TERRA meubels aanpassen?", answer: "Ja, alle TERRA stukken kunnen op maat worden gemaakt. U kunt de lengte, breedte, hoogte en vorm aanpassen aan uw ruimte. Neem contact op voor een vrijblijvend voorstel." },
      { question: "Hoe onderhoud ik travertin meubels?", answer: "Travertin vereist minimaal onderhoud. Regelmatig afstoffen en af en toe schoonmaken met een vochtige doek volstaat. Wij adviseren jaarlijks een steen-impregnatie om vlekken te voorkomen." },
      { question: "Wat is de levertijd voor een TERRA stuk op maat?", answer: "De levertijd voor maatwerk bedraagt gemiddeld 12 tot 16 weken, afhankelijk van de complexiteit, steenkeuze en locatie." },
    ],
    faqsEn: [
      { question: "What is travertine and why is it suitable for furniture?", answer: "Travertine is a natural stone formed from limestone deposits of mineral springs. It has a warm, honey-coloured tone and characteristic porous structure. The stone is strong enough for daily use and develops a beautiful patina over time." },
      { question: "Can I customize the dimensions of TERRA furniture?", answer: "Yes, all TERRA pieces can be made to measure. You can adjust the length, width, height and shape to fit your space. Contact us for a no-obligation proposal." },
      { question: "How do I maintain travertine furniture?", answer: "Travertine requires minimal maintenance. Regular dusting and occasional cleaning with a damp cloth is sufficient. We recommend annual stone impregnation to prevent stains." },
      { question: "What is the delivery time for a custom TERRA piece?", answer: "The delivery time for custom work is typically 12 to 16 weeks, depending on complexity, stone selection and location." },
    ],
  },
  vanta: {
    subtitle: "Calacatta Viola",
    subtitleEn: "Calacatta Viola",
    metaTitle: "VANTA Collectie — Calacatta Viola Marmeren Tafels",
    metaTitleEn: "VANTA Collection — Calacatta Viola Marble Tables",
    metaDescription: "Ontdek de VANTA collectie: exclusieve meubels in Calacatta Viola marmer. Zeldzame violette aders, strakke vormen. Eettafels en salontafels op maat.",
    metaDescriptionEn: "Discover the VANTA collection: exclusive furniture in Calacatta Viola marble. Rare violet veining, clean forms. Bespoke dining and coffee tables.",
    keywords: "Calacatta Viola, marmeren eettafel, marmeren salontafel, luxe marmer, VANTA collectie, exclusieve meubels, Italiaans marmer",
    longDescription: `VANTA viert Calacatta Viola—een van de zeldzaamste en meest dramatische marmersoorten die uit de Apuaanse Alpen wordt gewonnen. De gedurfde violette aders tegen lichtgevend wit creëren stukken die evenzeer sculptuur als meubilair zijn.

Calacatta Viola wordt in zeer beperkte hoeveelheden gewonnen. Elke plaat wordt zorgvuldig geselecteerd op basis van het unieke patroon, waardoor geen twee VANTA stukken ooit identiek zijn.

Alle VANTA meubels worden vervaardigd met de hoogste precisie. Het materiaal vraagt om perfecte afwerking, en dat is precies wat wij leveren.`,
    longDescriptionEn: `VANTA celebrates Calacatta Viola—among the rarest and most dramatic marbles quarried from the Apuan Alps. The bold violet veining against luminous white creates pieces that are as much sculpture as furniture.

Calacatta Viola is quarried in very limited quantities. Each slab is carefully selected for its unique pattern, ensuring that no two VANTA pieces are ever identical.

All VANTA furniture is crafted with the highest precision. The material demands perfect finishing, and that is exactly what we deliver.`,
    materials: ["Calacatta Viola Marmer", "Gepolijste Afwerking", "Bookmatched Aders"],
    materialsEn: ["Calacatta Viola Marble", "Polished Finish", "Bookmatched Veining"],
    faqs: [
      { question: "Wat maakt Calacatta Viola zo bijzonder?", answer: "Calacatta Viola is een van de zeldzaamste marmersoorten ter wereld, gewonnen uit een beperkt aantal groeves in de Apuaanse Alpen, Italië. De karakteristieke violette en grijze aders tegen een witte achtergrond maken elke plaat uniek." },
      { question: "Hoe worden de aders in het marmer gematcht?", answer: "Bij grotere oppervlakken passen wij 'bookmatching' toe: twee platen worden als een opengeslagen boek naast elkaar gelegd, zodat de aders spiegelen. Dit creëert een symmetrisch, spectaculair patroon." },
      { question: "Is Calacatta Viola geschikt voor dagelijks gebruik?", answer: "Ja, mits goed onderhouden. Calacatta Viola is een dicht marmer dat goed bestand is tegen dagelijks gebruik. Wij brengen een professionele sealant aan die het oppervlak beschermt tegen vlekken." },
      { question: "Kan ik een specifiek stuk marmer selecteren voor mijn meubel?", answer: "Absoluut. Voor VANTA projecten nodigen wij klanten uit om het materiaal persoonlijk te selecteren, of wij sturen gedetailleerde foto's van beschikbare platen." },
    ],
    faqsEn: [
      { question: "What makes Calacatta Viola so special?", answer: "Calacatta Viola is one of the rarest marbles in the world, quarried from a limited number of quarries in the Apuan Alps, Italy. The characteristic violet and grey veining against a white background makes each slab unique." },
      { question: "How are the veins in the marble matched?", answer: "For larger surfaces we apply 'bookmatching': two slabs are placed side by side like an opened book, so the veins mirror each other. This creates a symmetrical, spectacular pattern." },
      { question: "Is Calacatta Viola suitable for daily use?", answer: "Yes, if properly maintained. Calacatta Viola is a dense marble that withstands daily use well. We apply a professional sealant that protects the surface from stains." },
      { question: "Can I select a specific piece of marble for my furniture?", answer: "Absolutely. For VANTA projects we invite clients to select the material in person, or we send detailed photos of available slabs." },
    ],
  },
};

interface CollectionData {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    edges: ShopifyProduct[];
  };
}

// Map URL slugs to Shopify collection handles - try multiple options
const urlToShopifyHandles: Record<string, string[]> = {
  'vanta': ['vanta', 'frontpage', 'vanta-collection'],
  'terra': ['terra', 'terra-collection'],
};

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);

  const metadata = collectionsMetadata[collectionId?.toLowerCase() || ''];

  useEffect(() => {
    const loadCollection = async () => {
      if (!collectionId) return;
      setLoading(true);

      const normalizedId = collectionId.toLowerCase();
      const handlesToTry = urlToShopifyHandles[normalizedId] || [normalizedId];

      const tryHandle = async (handle: string) => {
        const data = await fetchCollectionByHandle(handle, 20);
        if (data) {
          setCollection(data);
          return true;
        }
        return false;
      };

      // 1) Try known handles
      for (const handle of handlesToTry) {
        try {
          if (await tryHandle(handle)) {
            setLoading(false);
            return;
          }
        } catch {
          // continue
        }
      }

      // 2) Try to discover collection by listing and matching title
      try {
        const all = await fetchCollections(50);
        const match = all.find((c) => c.node.title.toLowerCase().includes(normalizedId));
        if (match) {
          try {
            if (await tryHandle(match.node.handle)) {
              setLoading(false);
              return;
            }
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }

      // 3) Fallback for VANTA: show real products even if collection doesn't exist in Shopify
      if (normalizedId === "vanta") {
        try {
          const vantaProducts = await fetchProducts(20, "title:VANTA");
          if (vantaProducts.length > 0) {
            setCollection({
              id: "fallback-vanta",
              title: "VANTA",
              handle: "vanta",
              description: "",
              image: {
                url: vantaFallback,
                altText: "VANTA collectie",
              },
              products: { edges: vantaProducts },
            });
            setLoading(false);
            return;
          }
        } catch {
          // ignore
        }
      }

      // No collection found
      setCollection(null);
      setLoading(false);
    };

    loadCollection();
  }, [collectionId]);

  if (loading) {
    return (
      <Layout>
        <section className="pt-40 pb-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-16 w-64" />
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="aspect-[4/5] w-full" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!collection) {
    return (
      <Layout>
        <section className="pt-40 pb-24">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="font-serif text-display-md text-foreground mb-4">{t('collections.notFound')}</h1>
            <Button asChild variant="atelier">
              <Link to="/collections">{t('collections.viewAllButton')}</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const title = metadata ? (isEnglish ? metadata.metaTitleEn : metadata.metaTitle) : collection.title;
  const metaDescription = metadata ? (isEnglish ? metadata.metaDescriptionEn : metadata.metaDescription) : collection.description;
  const longDesc = metadata ? (isEnglish ? metadata.longDescriptionEn : metadata.longDescription) : collection.description;
  const materials = metadata ? (isEnglish ? metadata.materialsEn : metadata.materials) : [];
  const subtitle = metadata ? (isEnglish ? metadata.subtitleEn : metadata.subtitle) : '';
  const faqs = metadata ? (isEnglish ? metadata.faqsEn : metadata.faqs) : [];

  const products = collection.products?.edges || [];

  const breadcrumbItems = [
    { label: isEnglish ? 'Collections' : 'Collecties', href: '/collections' },
    { label: collection.title, href: `/collections/${collectionId}` },
  ];

  const breadcrumbSchemaItems = [
    { name: isEnglish ? 'Home' : 'Home', url: '/' },
    { name: isEnglish ? 'Collections' : 'Collecties', url: '/collections' },
    { name: collection.title, url: `/collections/${collectionId}` },
  ];

  const collectionSchema = generateCollectionSchema({
    name: `${collection.title} - SERA NORR`,
    description: metaDescription,
    image: collection.image?.url || '',
    url: `https://sera-norr.com/collections/${collectionId}`,
    products: products.map((p) => ({
      name: p.node.title,
      url: `https://sera-norr.com/product/${p.node.handle}`,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbSchemaItems);
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  const combinedSchema = faqSchema ? [collectionSchema, breadcrumbSchema, faqSchema] : [collectionSchema, breadcrumbSchema];

  // Format price as "Price on request" for bespoke items
  const formatPriceOnRequest = () => {
    return isEnglish ? 'Price on request' : 'Prijs op aanvraag';
  };

  return (
    <Layout>
      <SEOHead
        title={title}
        description={metaDescription}
        keywords={metadata?.keywords || ''}
        structuredData={combinedSchema}
        type="website"
      />

      {/* Breadcrumbs & Back Link */}
      <div className="pt-24 pb-4 bg-background">
        <div className="container mx-auto px-6 lg:px-12 space-y-4">
          <Breadcrumbs items={breadcrumbItems} />
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-4">
            <Link to="/collections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('collections.viewAllButton')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-8 lg:pt-16 pb-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              {subtitle && (
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                  {subtitle}
                </p>
              )}
              <h1 className="font-serif text-display-lg text-foreground mb-6">
                {collection.title}
              </h1>
              <div className="text-muted-foreground text-body-lg leading-relaxed mb-8 space-y-4">
                {longDesc.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              {materials.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {materials.map((material) => (
                    <span
                      key={material}
                      className="px-4 py-2 bg-secondary text-foreground text-xs uppercase tracking-wider"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="order-1 lg:order-2 image-reveal">
              <div className="aspect-[4/5] bg-muted">
                {collection.image?.url ? (
                  <img
                    src={collection.image.url}
                    alt={collection.image.altText || `${collection.title} ${isEnglish ? 'Collection' : 'Collectie'} - SERA NORR`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-muted-foreground">{collection.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products from Shopify */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="font-serif text-display-sm text-foreground">
              {t('collections.pieces')}
            </h2>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-body-md">
                {isEnglish ? 'No products found in this collection yet.' : 'Nog geen producten gevonden in deze collectie.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {products.map((product) => {
                const productImage = product.node.images?.edges?.[0]?.node;
                const price = product.node.priceRange?.minVariantPrice;
                
                return (
                  <article key={product.node.id} className="group">
                    <Link to={`/product/${product.node.handle}`} className="block">
                      <div className="aspect-[4/3] bg-muted mb-6 overflow-hidden image-reveal">
                        {productImage?.url ? (
                          <img
                            src={productImage.url}
                            alt={productImage.altText || product.node.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">{product.node.title}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif text-xl text-foreground mb-2">
                          <Link to={`/product/${product.node.handle}`} className="hover:text-muted-foreground transition-colors">
                            {product.node.title}
                          </Link>
                        </h3>
                        {product.node.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {product.node.description}
                          </p>
                        )}
                      </div>
                      {price && (
                        <p className="font-sans text-sm text-muted-foreground whitespace-nowrap">
                          {formatPriceOnRequest()}
                        </p>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="atelier-subtle" size="sm">
                        <Link to="/contact">
                          {t('collections.requestQuote')}
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section with Schema */}
      {faqs.length > 0 && (
        <FAQSection 
          faqs={faqs} 
          title={isEnglish ? 'Frequently Asked Questions' : 'Veelgestelde vragen'} 
        />
      )}

      {/* Bespoke CTA */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-display-sm mb-6">
            {t('collections.customTitle')}
          </h2>
          <p className="text-background/80 text-body-md max-w-xl mx-auto mb-8">
            {t('collections.customDescription').replace('{collection.name}', collection.title)}
          </p>
          <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
            <Link to="/bespoke">{t('collections.startBespoke')}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CollectionDetail;
