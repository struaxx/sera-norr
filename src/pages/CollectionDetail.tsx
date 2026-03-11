import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SEOHead, Breadcrumbs, FAQSection, generateCollectionSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/components/seo";
import vantaFallback from "@/assets/vanta-collection.jpg";
import terraFallback from "@/assets/terra-collection.jpg";

// Static collection metadata
const collectionsMetadata: Record<string, {
  title: string;
  subtitle: string;
  subtitleEn: string;
  image: string;
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
    title: "TERRA",
    subtitle: "Travertin",
    subtitleEn: "Travertine",
    image: terraFallback,
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
    title: "VANTA",
    subtitle: "Calacatta Viola",
    subtitleEn: "Calacatta Viola",
    image: vantaFallback,
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

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  const metadata = collectionsMetadata[collectionId?.toLowerCase() || ''];

  if (!metadata) {
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

  const title = isEnglish ? metadata.metaTitleEn : metadata.metaTitle;
  const metaDescription = isEnglish ? metadata.metaDescriptionEn : metadata.metaDescription;
  const longDesc = isEnglish ? metadata.longDescriptionEn : metadata.longDescription;
  const materials = isEnglish ? metadata.materialsEn : metadata.materials;
  const subtitle = isEnglish ? metadata.subtitleEn : metadata.subtitle;
  const faqs = isEnglish ? metadata.faqsEn : metadata.faqs;

  const breadcrumbItems = [
    { label: isEnglish ? 'Collections' : 'Collecties', href: '/collections' },
    { label: metadata.title, href: `/collections/${collectionId}` },
  ];

  const breadcrumbSchemaItems = [
    { name: isEnglish ? 'Home' : 'Home', url: '/' },
    { name: isEnglish ? 'Collections' : 'Collecties', url: '/collections' },
    { name: metadata.title, url: `/collections/${collectionId}` },
  ];

  const collectionSchema = generateCollectionSchema({
    name: `${metadata.title} - SERA NORR`,
    description: metaDescription,
    image: metadata.image,
    url: `https://sera-norr.com/collections/${collectionId}`,
    products: [],
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbSchemaItems);
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;
  const combinedSchema = faqSchema ? [collectionSchema, breadcrumbSchema, faqSchema] : [collectionSchema, breadcrumbSchema];

  return (
    <Layout>
      <SEOHead
        title={title}
        description={metaDescription}
        keywords={metadata.keywords}
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
                {metadata.title}
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
              
              {/* Primary Atelier CTA */}
              <div className="mt-8 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {isEnglish 
                    ? "Choose this style as starting point for your design."
                    : "Kies deze stijl als startpunt voor uw ontwerp."}
                </p>
                <Button asChild variant="sera-primary" size="lg">
                  <Link to={`/atelier?style=${collectionId?.toLowerCase()}`}>
                    {isEnglish ? `Design in ${metadata.title} style` : `Ontwerp in ${metadata.title} stijl`}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-[11px] text-muted-foreground/50">
                  {isEnglish ? "Price indication • 12-16 weeks • Bespoke guidance" : "Prijsindicatie • 12-16 weken • Maatwerk begeleiding"}
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 image-reveal">
              <div className="aspect-[4/5] bg-muted">
                <img
                  src={metadata.image}
                  alt={`${metadata.title} ${isEnglish ? 'Collection' : 'Collectie'} - SERA NORR`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
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
            {t('collections.customDescription').replace('{collection.name}', metadata.title)}
          </p>
          <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
            <Link to={`/atelier?style=${collectionId?.toLowerCase()}`}>
              {isEnglish ? `Design in ${metadata.title} style` : `Ontwerp in ${metadata.title} stijl`}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CollectionDetail;
