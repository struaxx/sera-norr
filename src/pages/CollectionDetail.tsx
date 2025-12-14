import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SEOHead, Breadcrumbs, FAQSection, generateCollectionSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/components/seo";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";
import nordImage from "@/assets/nord-collection.jpg";

const collectionsData = {
  terra: {
    name: "TERRA",
    subtitle: "Travertin",
    subtitleEn: "Travertine",
    metaTitle: "TERRA Collectie — Travertin Eettafels & Salontafels",
    metaTitleEn: "TERRA Collection — Travertine Dining & Coffee Tables",
    metaDescription: "Ontdek de TERRA collectie: sculpturale meubels in Italiaans travertin. Eettafels, salontafels en consoles met natuurlijke warmte en tijdloze elegantie.",
    metaDescriptionEn: "Discover the TERRA collection: sculptural furniture in Italian travertine. Dining tables, coffee tables and consoles with natural warmth.",
    keywords: "travertin eettafel, travertin salontafel, stenen meubels, TERRA collectie, Italiaans travertin, natuursteen tafel",
    description: "Travertin met rustige tinten en natuurlijke gelaagdheid. Ontwerpen met zachte kracht, duidelijke lijnen en een kalme aanwezigheid.",
    descriptionEn: "Travertine with calm tones and natural layering. Designs with gentle strength, clear lines and a calm presence.",
    longDescription: `De TERRA collectie is geworteld in de oeroude warmte van Italiaans travertin—een steensoort die over millennia is gevormd uit minerale bronnen. Het materiaal draagt de herinnering aan water in zich, zichtbaar in de karakteristieke putjes en honingkleurige tinten.

Elk TERRA stuk onthult de natuurlijke expressiviteit van travertin. We werken met de inclusies en oneffenheden van het materiaal, waardoor deze eigenschappen onderdeel worden van het ontwerp in plaats van verborgen gebreken.

Travertin is bij uitstek geschikt voor meubels die warmte en rust moeten uitstralen. De poreuze structuur geeft een tactiele kwaliteit die bij geen ander materiaal voorkomt. De kleur varieert van roomwit tot zacht beige, met subtiele variaties die elk stuk uniek maken.

Alle TERRA meubels kunnen op maat worden gemaakt. Afmetingen, vormen en afwerkingen zijn aanpasbaar aan uw specifieke wensen en ruimte.`,
    longDescriptionEn: `The TERRA collection is rooted in the ancient warmth of Italian travertine—a stone formed over millennia from mineral springs. The material carries within it the memory of water, visible in its characteristic pitting and honeyed tones.

Each TERRA piece reveals the natural expressiveness of travertine. We work with the material's inclusions and imperfections, allowing these characteristics to become part of the design rather than hidden flaws.

Travertine is ideal for furniture that needs to radiate warmth and calm. The porous structure gives a tactile quality found in no other material. The colour varies from cream white to soft beige, with subtle variations that make each piece unique.

All TERRA furniture can be made to measure. Dimensions, shapes and finishes are adaptable to your specific wishes and space.`,
    image: terraImage,
    materials: ["Italiaans Travertin", "Natuurlijke Afwerking", "Geslepen Oppervlak"],
    materialsEn: ["Italian Travertine", "Natural Finish", "Honed Surface"],
    products: [
      { id: 1, name: "TERRA Salontafel — Organische Vorm", nameEn: "TERRA Coffee Table — Organic Form", price: "Vanaf €3.200", priceEn: "From €3,200", dimensions: "L120 × B80 × H40 cm" },
      { id: 2, name: "TERRA Console — Gebogen Rand", nameEn: "TERRA Console — Curved Edge", price: "Vanaf €4.500", priceEn: "From €4,500", dimensions: "L160 × B45 × H85 cm" },
      { id: 3, name: "TERRA Bijzettafel — Monoliet", nameEn: "TERRA Side Table — Monolith", price: "Vanaf €1.800", priceEn: "From €1,800", dimensions: "Ø45 × H55 cm" },
      { id: 4, name: "TERRA Eettafel — Cathedral", nameEn: "TERRA Dining Table — Cathedral", price: "Vanaf €8.500", priceEn: "From €8,500", dimensions: "L240 × B110 × H75 cm" },
    ],
    faqs: [
      { question: "Wat is travertin en waarom is het geschikt voor meubels?", answer: "Travertin is een natuursteen gevormd uit kalkafzettingen van minerale bronnen. Het heeft een warme, honingkleurige tint en een karakteristieke poreuze structuur. De steen is sterk genoeg voor dagelijks gebruik en ontwikkelt met de tijd een mooie patina." },
      { question: "Kan ik de afmetingen van TERRA meubels aanpassen?", answer: "Ja, alle TERRA stukken kunnen op maat worden gemaakt. U kunt de lengte, breedte, hoogte en vorm aanpassen aan uw ruimte. Neem contact op voor een vrijblijvend voorstel." },
      { question: "Hoe onderhoud ik travertin meubels?", answer: "Travertin vereist minimaal onderhoud. Regelmatig afstoffen en af en toe schoonmaken met een vochtige doek volstaat. Wij adviseren jaarlijks een steen-impregnatie om vlekken te voorkomen. Vermijd zure schoonmaakmiddelen." },
      { question: "Wat is de levertijd voor een TERRA stuk op maat?", answer: "De levertijd voor maatwerk bedraagt doorgaans 8 tot 12 weken, afhankelijk van de complexiteit en beschikbaarheid van het materiaal. Standaardmaten kunnen sneller worden geleverd." },
    ],
    faqsEn: [
      { question: "What is travertine and why is it suitable for furniture?", answer: "Travertine is a natural stone formed from limestone deposits of mineral springs. It has a warm, honey-coloured tone and characteristic porous structure. The stone is strong enough for daily use and develops a beautiful patina over time." },
      { question: "Can I customize the dimensions of TERRA furniture?", answer: "Yes, all TERRA pieces can be made to measure. You can adjust the length, width, height and shape to fit your space. Contact us for a no-obligation proposal." },
      { question: "How do I maintain travertine furniture?", answer: "Travertine requires minimal maintenance. Regular dusting and occasional cleaning with a damp cloth is sufficient. We recommend annual stone impregnation to prevent stains. Avoid acidic cleaning products." },
      { question: "What is the delivery time for a custom TERRA piece?", answer: "The delivery time for custom work is typically 8 to 12 weeks, depending on complexity and material availability. Standard sizes can be delivered faster." },
    ],
  },
  vanta: {
    name: "VANTA",
    subtitle: "Calacatta Viola",
    subtitleEn: "Calacatta Viola",
    metaTitle: "VANTA Collectie — Calacatta Viola Marmeren Tafels",
    metaTitleEn: "VANTA Collection — Calacatta Viola Marble Tables",
    metaDescription: "Ontdek de VANTA collectie: exclusieve meubels in Calacatta Viola marmer. Zeldzame violette aders, strakke vormen. Eettafels en salontafels op maat.",
    metaDescriptionEn: "Discover the VANTA collection: exclusive furniture in Calacatta Viola marble. Rare violet veining, clean forms. Bespoke dining and coffee tables.",
    keywords: "Calacatta Viola, marmeren eettafel, marmeren salontafel, luxe marmer, VANTA collectie, exclusieve meubels, Italiaans marmer",
    description: "Calacatta Viola met rijke aders en uitgesproken contrast. Strakke vormen die het materiaal laten spreken zonder overdaad.",
    descriptionEn: "Calacatta Viola with rich veins and pronounced contrast. Clean forms that let the material speak without excess.",
    longDescription: `VANTA viert Calacatta Viola—een van de zeldzaamste en meest dramatische marmersoorten die uit de Apuaanse Alpen wordt gewonnen. De gedurfde violette aders tegen lichtgevend wit creëren stukken die evenzeer sculptuur als meubilair zijn.

Calacatta Viola wordt in zeer beperkte hoeveelheden gewonnen. Elke plaat wordt zorgvuldig geselecteerd op basis van het unieke patroon, waardoor geen twee VANTA stukken ooit identiek zijn. Dit is marmer op zijn meest expressief, getransformeerd tot functionele kunst.

De violette en grijze aders variëren in intensiteit en richting. Wij selecteren materiaal dat past bij het ontwerp—soms kiezen we voor dramatische contrasten, soms voor subtielere patronen. De keuze is altijd in dialoog met de klant.

Alle VANTA meubels worden vervaardigd met de hoogste precisie. Het materiaal vraagt om perfecte afwerking, en dat is precies wat wij leveren.`,
    longDescriptionEn: `VANTA celebrates Calacatta Viola—among the rarest and most dramatic marbles quarried from the Apuan Alps. The bold violet veining against luminous white creates pieces that are as much sculpture as furniture.

Calacatta Viola is quarried in very limited quantities. Each slab is carefully selected for its unique pattern, ensuring that no two VANTA pieces are ever identical. This is marble at its most expressive, transformed into functional art.

The violet and grey veining varies in intensity and direction. We select material that suits the design—sometimes choosing dramatic contrasts, sometimes more subtle patterns. The choice is always in dialogue with the client.

All VANTA furniture is crafted with the highest precision. The material demands perfect finishing, and that is exactly what we deliver.`,
    image: vantaImage,
    materials: ["Calacatta Viola Marmer", "Gepolijste Afwerking", "Bookmatched Aders"],
    materialsEn: ["Calacatta Viola Marble", "Polished Finish", "Bookmatched Veining"],
    products: [
      { id: 1, name: "VANTA Eettafel — Cilindrische Voet", nameEn: "VANTA Dining Table — Cylindrical Pedestal", price: "Vanaf €12.500", priceEn: "From €12,500", dimensions: "Ø150 × H75 cm" },
      { id: 2, name: "VANTA Salontafel — Rechthoekig", nameEn: "VANTA Coffee Table — Rectangular", price: "Vanaf €5.800", priceEn: "From €5,800", dimensions: "L140 × B70 × H35 cm" },
      { id: 3, name: "VANTA Console — Sculpturale Basis", nameEn: "VANTA Console — Sculptural Base", price: "Vanaf €7.200", priceEn: "From €7,200", dimensions: "L180 × B40 × H90 cm" },
      { id: 4, name: "VANTA Bijzettafel — Drum", nameEn: "VANTA Side Table — Drum", price: "Vanaf €3.400", priceEn: "From €3,400", dimensions: "Ø50 × H50 cm" },
    ],
    faqs: [
      { question: "Wat maakt Calacatta Viola zo bijzonder?", answer: "Calacatta Viola is een van de zeldzaamste marmersoorten ter wereld, gewonnen uit een beperkt aantal groeves in de Apuaanse Alpen, Italië. De karakteristieke violette en grijze aders tegen een witte achtergrond maken elke plaat uniek. De beperkte beschikbaarheid maakt het een exclusief materiaal." },
      { question: "Hoe worden de aders in het marmer gematcht?", answer: "Bij grotere oppervlakken passen wij 'bookmatching' toe: twee platen worden als een opengeslagen boek naast elkaar gelegd, zodat de aders spiegelen. Dit creëert een symmetrisch, spectaculair patroon. De exacte matching wordt in overleg met u bepaald." },
      { question: "Is Calacatta Viola geschikt voor dagelijks gebruik?", answer: "Ja, mits goed onderhouden. Calacatta Viola is een dicht marmer dat goed bestand is tegen dagelijks gebruik. Wij brengen een professionele sealant aan die het oppervlak beschermt tegen vlekken. Regelmatig onderhoud verlengt de levensduur." },
      { question: "Kan ik een specifiek stuk marmer selecteren voor mijn meubel?", answer: "Absoluut. Voor VANTA projecten nodigen wij klanten uit om het materiaal persoonlijk te selecteren, of wij sturen gedetailleerde foto's van beschikbare platen. Zo heeft u volledige controle over het eindresultaat." },
    ],
    faqsEn: [
      { question: "What makes Calacatta Viola so special?", answer: "Calacatta Viola is one of the rarest marbles in the world, quarried from a limited number of quarries in the Apuan Alps, Italy. The characteristic violet and grey veining against a white background makes each slab unique. The limited availability makes it an exclusive material." },
      { question: "How are the veins in the marble matched?", answer: "For larger surfaces we apply 'bookmatching': two slabs are placed side by side like an opened book, so the veins mirror each other. This creates a symmetrical, spectacular pattern. The exact matching is determined in consultation with you." },
      { question: "Is Calacatta Viola suitable for daily use?", answer: "Yes, if properly maintained. Calacatta Viola is a dense marble that withstands daily use well. We apply a professional sealant that protects the surface from stains. Regular maintenance extends the lifespan." },
      { question: "Can I select a specific piece of marble for my furniture?", answer: "Absolutely. For VANTA projects we invite clients to select the material in person, or we send detailed photos of available slabs. This gives you full control over the end result." },
    ],
  },
  nord: {
    name: "NORD",
    subtitle: "Minerale Composieten",
    subtitleEn: "Mineral Composites",
    metaTitle: "NORD Collectie — Architecturaal Beton & Minerale Composieten",
    metaTitleEn: "NORD Collection — Architectural Concrete & Mineral Composites",
    metaDescription: "Ontdek de NORD collectie: brutalistische meubels in architecturaal beton en minerale composieten. Eettafels, banken en plinten met ruwe elegantie.",
    metaDescriptionEn: "Discover the NORD collection: brutalist furniture in architectural concrete and mineral composites. Dining tables, benches and plinths with raw elegance.",
    keywords: "betonnen meubels, architecturaal beton, brutalistische meubels, NORD collectie, minerale composieten, moderne eettafel",
    description: "Ruw beton ontmoet verfijnde minerale aggregaten. Brutalistische elegantie voor het moderne interieur.",
    descriptionEn: "Raw concrete meets refined mineral aggregates. Brutalist elegance for the modern interior.",
    longDescription: `NORD verkent het architecturale potentieel van minerale composieten—beton verrijkt met zorgvuldig geselecteerde aggregaten die zich door het oppervlak onthullen. De collectie put uit Scandinavisch brutalisme en Japans minimalisme.

Elk NORD stuk balanceert ruwe textuur met verfijnde verhoudingen. De collectie spreekt tot wie schoonheid vindt in terughoudendheid, gewicht en eerlijke materiaalexpressie.

Het beton dat wij gebruiken is niet het beton van bouwplaatsen. Het is een gecontroleerde formulering met premium aggregaten, uitgehard onder optimale omstandigheden voor maximale sterkte en een uniform oppervlak. De kleur varieert van antraciet tot licht grijs, afhankelijk van de gekozen mix.

NORD meubels zijn verrassend licht voor hun uiterlijk, dankzij holle constructies en geavanceerde giettechnieken. Maatwerk is standaard—afmetingen en afwerkingen worden aangepast aan uw project.`,
    longDescriptionEn: `NORD explores the architectural potential of mineral composites—concrete enhanced with carefully selected aggregates that reveal themselves through the surface. The collection draws from Nordic brutalism and Japanese minimalism.

Each NORD piece balances raw texture with refined proportions. The collection speaks to those who find beauty in restraint, weight, and honest material expression.

The concrete we use is not construction site concrete. It is a controlled formulation with premium aggregates, cured under optimal conditions for maximum strength and a uniform surface. The colour varies from anthracite to light grey, depending on the chosen mix.

NORD furniture is surprisingly light for its appearance, thanks to hollow constructions and advanced casting techniques. Custom work is standard—dimensions and finishes are adapted to your project.`,
    image: nordImage,
    materials: ["Minerale Composiet", "Natuurlijke Aggregaten", "Matte Afwerking"],
    materialsEn: ["Mineral Composite", "Natural Aggregates", "Matte Finish"],
    products: [
      { id: 1, name: "NORD Eettafel — Block", nameEn: "NORD Dining Table — Block", price: "Vanaf €4.200", priceEn: "From €4,200", dimensions: "L200 × B100 × H75 cm" },
      { id: 2, name: "NORD Bijzettafel — Sculpturaal", nameEn: "NORD Side Table — Sculptural", price: "Vanaf €1.600", priceEn: "From €1,600", dimensions: "Ø40 × H50 cm" },
      { id: 3, name: "NORD Bank — Monolithisch", nameEn: "NORD Bench — Monolithic", price: "Vanaf €2.800", priceEn: "From €2,800", dimensions: "L160 × B40 × H45 cm" },
      { id: 4, name: "NORD Plint — Display", nameEn: "NORD Plinth — Display", price: "Vanaf €1.200", priceEn: "From €1,200", dimensions: "B40 × D40 × H100 cm" },
    ],
    faqs: [
      { question: "Zijn betonnen meubels niet erg zwaar?", answer: "NORD meubels zijn verrassend lichter dan ze eruitzien. We gebruiken holle constructies en geavanceerde giettechnieken waardoor het gewicht beheersbaar blijft. Een NORD salontafel is vergelijkbaar in gewicht met een houten variant." },
      { question: "Kan beton kraken of scheuren?", answer: "Ons architecturaal beton is versterkt met glasvezel en uitgehard onder gecontroleerde omstandigheden, wat scheuren minimaliseert. Kleine haarscheurtjes kunnen na verloop van tijd ontstaan—dit is normaal en draagt bij aan het karakter van het materiaal." },
      { question: "Welke kleuren en afwerkingen zijn beschikbaar?", answer: "NORD beton is beschikbaar in antraciet, natuurlijk grijs en licht grijs. Afwerkingen variëren van ruw tot glad gepolijst. Op verzoek kunnen we aangepaste kleurmengsels ontwikkelen met pigmenten of speciale aggregaten." },
      { question: "Hoe onderhoud ik betonnen meubels?", answer: "Beton vereist minimaal onderhoud. Regelmatig afstoffen en af en toe reinigen met een vochtige doek volstaat. Wij brengen een sealant aan die het oppervlak beschermt. Vermijd langdurig contact met vloeistoffen." },
    ],
    faqsEn: [
      { question: "Aren't concrete furniture pieces very heavy?", answer: "NORD furniture is surprisingly lighter than it looks. We use hollow constructions and advanced casting techniques that keep the weight manageable. A NORD coffee table is comparable in weight to a wooden variant." },
      { question: "Can concrete crack or break?", answer: "Our architectural concrete is reinforced with glass fibre and cured under controlled conditions, which minimises cracking. Small hairline cracks may develop over time—this is normal and adds to the character of the material." },
      { question: "What colours and finishes are available?", answer: "NORD concrete is available in anthracite, natural grey and light grey. Finishes range from rough to smooth polished. On request we can develop custom colour mixes with pigments or special aggregates." },
      { question: "How do I maintain concrete furniture?", answer: "Concrete requires minimal maintenance. Regular dusting and occasional cleaning with a damp cloth is sufficient. We apply a sealant that protects the surface. Avoid prolonged contact with liquids." },
    ],
  },
};

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const collection = collectionsData[collectionId as keyof typeof collectionsData];

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

  const title = isEnglish ? collection.metaTitleEn : collection.metaTitle;
  const description = isEnglish ? collection.metaDescriptionEn : collection.metaDescription;
  const longDesc = isEnglish ? collection.longDescriptionEn : collection.longDescription;
  const materials = isEnglish ? collection.materialsEn : collection.materials;
  const subtitle = isEnglish ? collection.subtitleEn : collection.subtitle;
  const faqs = isEnglish ? collection.faqsEn : collection.faqs;

  const breadcrumbItems = [
    { label: isEnglish ? 'Collections' : 'Collecties', href: '/collections' },
    { label: collection.name, href: `/collections/${collectionId}` },
  ];

  const breadcrumbSchemaItems = [
    { name: isEnglish ? 'Home' : 'Home', url: '/' },
    { name: isEnglish ? 'Collections' : 'Collecties', url: '/collections' },
    { name: collection.name, url: `/collections/${collectionId}` },
  ];

  const collectionSchema = generateCollectionSchema({
    name: `${collection.name} - SERA NORR`,
    description: description,
    image: `https://sera-norr.com${collection.image}`,
    url: `https://sera-norr.com/collections/${collectionId}`,
    products: collection.products.map((p) => ({
      name: isEnglish ? p.nameEn : p.name,
      url: `https://sera-norr.com/product/${collectionId}-${p.id}`,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbSchemaItems);
  const faqSchema = generateFAQSchema(faqs);

  const combinedSchema = [collectionSchema, breadcrumbSchema, faqSchema];

  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        keywords={collection.keywords}
        structuredData={combinedSchema}
        type="website"
      />

      {/* Breadcrumbs */}
      <div className="pt-24 pb-4 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Back Link */}
      <div className="fixed top-24 left-6 lg:left-12 z-30">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link to="/collections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('collections.viewAllButton')}
          </Link>
        </Button>
      </div>

      {/* Hero */}
      <section className="pt-8 lg:pt-16 pb-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {subtitle}
              </p>
              <h1 className="font-serif text-display-lg text-foreground mb-6">
                {collection.name}
              </h1>
              <div className="text-muted-foreground text-body-lg leading-relaxed mb-8 space-y-4">
                {longDesc.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
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
            </div>
            <div className="order-1 lg:order-2 image-reveal">
              <div className="aspect-[4/5] bg-muted">
                <img
                  src={collection.image}
                  alt={`${collection.name} ${isEnglish ? 'Collection' : 'Collectie'} - SERA NORR ${subtitle}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="font-serif text-display-sm text-foreground">
              {t('collections.pieces')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {collection.products.map((product) => (
              <article key={product.id} className="group">
                <div className="aspect-[4/3] bg-muted mb-6 overflow-hidden image-reveal">
                  <img
                    src={collection.image}
                    alt={isEnglish ? product.nameEn : product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      {isEnglish ? product.nameEn : product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {product.dimensions}
                    </p>
                  </div>
                  <p className="font-sans text-sm text-foreground whitespace-nowrap">
                    {isEnglish ? product.priceEn : product.price}
                  </p>
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
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <FAQSection 
        faqs={faqs} 
        title={isEnglish ? 'Frequently Asked Questions' : 'Veelgestelde vragen'} 
      />

      {/* Bespoke CTA */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-display-sm mb-6">
            {t('collections.customTitle')}
          </h2>
          <p className="text-background/80 text-body-md max-w-xl mx-auto mb-8">
            {t('collections.customDescription').replace('{collection.name}', collection.name)}
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
