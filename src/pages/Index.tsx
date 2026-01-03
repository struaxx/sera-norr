import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import { SEOHead, baseSchema } from "@/components/seo";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { PremiumTimeline, TimelineStep } from "@/components/ui/premium-timeline";
import { SectionBand, SectionHeader } from "@/components/ui/section-band";
import { TrustBand } from "@/components/ui/trust-band";
import { usePageTracking, useCTATracking } from "@/hooks/use-tracking";
import heroImage from "@/assets/hero-homepage.png";

const Index = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackProposal } = useCTATracking();
  
  usePageTracking();

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
    ? "SERA NORR — Luxe natuursteen meubels op maat | Online atelier" 
    : "SERA NORR — Luxury Natural Stone Furniture | Online Atelier";
  
  const seoDescription = isNL
    ? "Online atelier voor maatwerk tafels en consoles in travertin en marmer. Van ontwerp en visualisatie tot white-glove levering in Nederland."
    : "Online atelier for bespoke tables and consoles in travertine and marble. From design and visualization to white-glove delivery in the Netherlands.";

  const seoKeywords = isNL
    ? "SERA NORR, online atelier, maatwerk natuursteenmeubels, travertin tafel, marmeren tafel op maat, Calacatta Viola, stenen eettafel"
    : "SERA NORR, online atelier, bespoke natural stone furniture, travertine table, custom marble table, Calacatta Viola, stone dining table";

  // Process steps
  const processSteps: TimelineStep[] = isNL ? [
    { 
      number: '01', 
      title: 'Consultatie', 
      description: 'Vrijblijvend gesprek over uw wensen, ruimte en steenvoorkeur.', 
      detail: 'Binnen 24 uur reactie' 
    },
    { 
      number: '02', 
      title: 'Voorstel & visualisatie', 
      description: 'Schets, materiaalopties en offerte op maat.', 
      detail: 'Voorstel in 48 uur' 
    },
    { 
      number: '03', 
      title: 'Productie & levering', 
      description: 'Vakkundige productie en white-glove plaatsing.', 
      detail: '12–16 weken' 
    },
  ] : [
    { 
      number: '01', 
      title: 'Consultation', 
      description: 'No-obligation conversation about your wishes, space and stone preference.', 
      detail: 'Response within 24 hours' 
    },
    { 
      number: '02', 
      title: 'Proposal & visualization', 
      description: 'Sketch, material options and tailored quote.', 
      detail: 'Proposal in 48 hours' 
    },
    { 
      number: '03', 
      title: 'Production & delivery', 
      description: 'Expert production and white-glove installation.', 
      detail: '12–16 weeks' 
    },
  ];

  // Trust band items
  const trustItems = isNL ? [
    { text: '5 jaar garantie' },
    { text: 'White-glove levering' },
    { text: 'Ontworpen in Nederland' },
    { text: 'Geselecteerde materialen' },
  ] : [
    { text: '5 year warranty' },
    { text: 'White-glove delivery' },
    { text: 'Designed in Netherlands' },
    { text: 'Selected materials' },
  ];

  // Get Dutch description for collections
  const getCollectionDescription = (handle: string, originalDescription: string) => {
    if (!isNL) return originalDescription;
    
    const handleLower = handle.toLowerCase();
    
    if (handleLower.includes('vanta')) {
      return 'Calacatta Viola marmer — rijke paarse adering, uniek in kleur en karakter.';
    }
    if (handleLower.includes('terra')) {
      return 'Natuurlijk travertin — warme beigetinten, tijdloze texturen.';
    }
    
    return originalDescription;
  };

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        structuredData={baseSchema}
      />

      {/* Hero Section - Full height, editorial */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={isNL ? "SERA NORR - Luxe stenen meubels op maat" : "SERA NORR - Luxury bespoke stone furniture"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/35" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl stagger-children">
          <h1 className="font-serif font-normal text-display-lg lg:text-display-xl text-background mb-6 leading-[0.95]">
            {isNL ? "Sculpturale vormen in natuursteen." : "Sculptural forms in natural stone."}
          </h1>
          <p className="font-sans text-body-md lg:text-body-lg text-background/85 max-w-xl mx-auto mb-10">
            {isNL 
              ? "Travertin, marmer en geselecteerde steensoorten. Op maat gemaakt voor uw ruimte." 
              : "Travertine, marble and selected stone types. Custom made for your space."}
          </p>
          
          {/* CTAs - Primary + Secondary */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/collections">
                {isNL ? "Ontdek collecties" : "Discover collections"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/50 text-background hover:bg-background/10">
              <Link to="/bespoke" onClick={trackProposal}>
                {isNL ? "Vraag voorstel aan" : "Request proposal"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-background/50">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em]">{t('home.scroll')}</span>
          <div className="w-px h-10 bg-background/30" />
        </div>
      </section>

      {/* Trust Band - Slim proof strip */}
      <TrustBand items={trustItems} />

      {/* Collections - Editorial Split Layout */}
      <SectionBand variant="default" size="lg">
        <SectionHeader
          eyebrow={isNL ? 'Collecties' : 'Collections'}
          title={isNL ? "Travertin & marmer" : "Travertine & marble"}
          description={isNL 
            ? "Twee signatuurcollecties, elk met een eigen karakter. Op maat gemaakt naar uw specificaties."
            : "Two signature collections, each with its own character. Made to measure to your specifications."}
        />

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {[1, 2].map((i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] w-full mb-6" />
                <Skeleton className="h-8 w-1/3 mb-3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {collections.slice(0, 2).map((collection) => (
              <Link
                key={collection.node.id}
                to={`/collections/${collection.node.handle}`}
                className="group block"
              >
                <article className="image-reveal">
                  <div className="aspect-[4/5] bg-muted mb-6 overflow-hidden">
                    {collection.node.image ? (
                      <img
                        src={collection.node.image.url}
                        alt={collection.node.image.altText || `${collection.node.title} ${isNL ? 'collectie' : 'collection'}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                        <span className="text-muted-foreground font-serif text-2xl">{collection.node.title}</span>
                      </div>
                    )}
                  </div>
                </article>
                <div className="space-y-2">
                  <h3 className="font-serif text-display-sm text-foreground">
                    {collection.node.title}
                  </h3>
                  {collection.node.description && (
                    <p className="font-sans text-body-sm text-muted-foreground">
                      {getCollectionDescription(collection.node.handle, collection.node.description)}
                    </p>
                  )}
                  <span className="inline-flex items-center text-foreground text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 pt-3">
                    {isNL ? "Ontdek collectie" : "Discover collection"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            {isNL ? 'Geen collecties gevonden.' : 'No collections found.'}
          </p>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="ghost" size="lg">
            <Link to="/collections">
              {isNL ? "Bekijk alle collecties" : "View all collections"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionBand>

      {/* Process - Premium Timeline */}
      <SectionBand variant="sand" size="lg">
        <SectionHeader
          eyebrow={isNL ? 'Werkwijze' : 'Process'}
          title={isNL ? "Van gesprek tot plaatsing" : "From conversation to installation"}
          centered
        />
        
        <PremiumTimeline steps={processSteps} className="max-w-5xl mx-auto" />
        
        <div className="text-center mt-16">
          <Button asChild variant="atelier-filled" size="lg">
            <Link to="/bespoke" onClick={trackProposal}>
              {isNL ? "Start uw project" : "Start your project"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionBand>

      {/* Editorial Statement */}
      <SectionBand variant="default" size="lg">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-display-sm lg:text-display-md text-foreground leading-[1.2]">
            {isNL 
              ? "Elk meubel is uniek. De steen bepaalt het karakter — wij vertalen het naar uw ruimte."
              : "Every piece is unique. The stone defines the character — we translate it to your space."}
          </p>
        </div>
      </SectionBand>

      {/* Bespoke CTA - Editorial Split */}
      <SectionBand variant="cream" size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-eyebrow uppercase text-muted-foreground mb-4">
              {isNL ? 'Maatwerk' : 'Bespoke'}
            </p>
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
              {isNL ? "Uw visie, onze expertise" : "Your vision, our expertise"}
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-8">
              {isNL 
                ? "Deel uw wensen en afmetingen. Binnen 48 uur ontvangt u een persoonlijk voorstel met visualisaties en materiaalopties."
                : "Share your wishes and dimensions. Within 48 hours you receive a personal proposal with visualizations and material options."}
            </p>
            <Button asChild variant="atelier-filled" size="lg">
              <Link to="/voorstel">
                {isNL ? "Ontvang voorstel" : "Receive proposal"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] bg-secondary/30 border border-border/30 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="font-serif text-2xl text-foreground mb-2">
                  {isNL ? "Voorstel in 48 uur" : "Proposal in 48 hours"}
                </p>
                <p className="text-body-sm text-muted-foreground">
                  {isNL ? "Inclusief schetsen en materiaalopties" : "Including sketches and material options"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionBand>

      {/* Final CTA Band */}
      <SectionBand variant="dark" size="md">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-display-sm text-background mb-4">
            {isNL ? "Klaar om te beginnen?" : "Ready to begin?"}
          </h2>
          <p className="text-background/70 text-body-md mb-8">
            {isNL 
              ? "Plan een vrijblijvend gesprek of bekijk onze voorbeelden."
              : "Schedule a no-obligation conversation or view our examples."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/contact">
                {isNL ? "Neem contact op" : "Get in touch"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10">
              <Link to="/lookbook">
                {isNL ? "Bekijk lookbook" : "View lookbook"}
              </Link>
            </Button>
          </div>
        </div>
      </SectionBand>
    </Layout>
  );
};

export default Index;
