import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, baseSchema } from "@/components/seo";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { BespokeTimeline, BespokeTimelineStep } from "@/components/ui/bespoke-timeline";
import { ProofGrid } from "@/components/ui/proof-grid";
import { ActionPanel } from "@/components/ui/action-panel";
import { Hairline } from "@/components/ui/hairline";
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

  // Process steps - Bespoke Timeline
  const processSteps: BespokeTimelineStep[] = isNL ? [
    { 
      number: '01', 
      title: 'Consultatie', 
      description: 'Vrijblijvend gesprek over uw wensen, ruimte en steenvoorkeur.', 
      tag: 'Binnen 24 uur reactie' 
    },
    { 
      number: '02', 
      title: 'Voorstel & visualisatie', 
      description: 'Schets, materiaalopties en offerte op maat.', 
      tag: 'Voorstel in 48 uur' 
    },
    { 
      number: '03', 
      title: 'Productie & levering', 
      description: 'Vakkundige productie en white-glove plaatsing.', 
      tag: '12–16 weken' 
    },
  ] : [
    { 
      number: '01', 
      title: 'Consultation', 
      description: 'No-obligation conversation about your wishes, space and stone preference.', 
      tag: 'Response within 24 hours' 
    },
    { 
      number: '02', 
      title: 'Proposal & visualization', 
      description: 'Sketch, material options and tailored quote.', 
      tag: 'Proposal in 48 hours' 
    },
    { 
      number: '03', 
      title: 'Production & delivery', 
      description: 'Expert production and white-glove installation.', 
      tag: '12–16 weeks' 
    },
  ];

  // Proof items - Waarom SERA NORR
  const proofItems = isNL ? [
    { title: '5 jaar garantie', description: 'Op constructie en materiaal.' },
    { title: 'White-glove levering', description: 'Plaatsing op locatie in NL/BE.' },
    { title: 'Ontworpen in Nederland', description: 'Elk stuk uniek en op maat.' },
    { title: 'Geselecteerde materialen', description: 'Travertin, marmer, natuursteen.' },
  ] : [
    { title: '5 year warranty', description: 'On construction and materials.' },
    { title: 'White-glove delivery', description: 'Installation on location in NL/BE.' },
    { title: 'Designed in Netherlands', description: 'Each piece unique and bespoke.' },
    { title: 'Selected materials', description: 'Travertine, marble, natural stone.' },
  ];

  // Get Dutch description for collections
  const getCollectionDescription = (handle: string, originalDescription: string) => {
    if (!isNL) return originalDescription;
    
    const handleLower = handle.toLowerCase();
    
    if (handleLower.includes('vanta')) {
      return 'Calacatta Viola marmer — rijke paarse adering.';
    }
    if (handleLower.includes('terra')) {
      return 'Natuurlijk travertin — warme beigetinten.';
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

      {/* HERO - Cinematic with editorial text area */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={isNL ? "SERA NORR - Luxe stenen meubels op maat" : "SERA NORR - Luxury bespoke stone furniture"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/35" />
        </div>
        
        {/* Editorial hero content with micro-label */}
        <div className="relative z-10 text-center px-6 max-w-3xl stagger-children">
          {/* Micro-label / caption rail */}
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-background/60 mb-6">
            {isNL ? 'Online atelier voor natuursteen' : 'Online atelier for natural stone'}
          </p>
          
          <h1 className="font-serif font-normal text-display-lg lg:text-display-xl text-background mb-6 leading-[0.95]">
            {isNL ? "Sculpturale vormen in natuursteen." : "Sculptural forms in natural stone."}
          </h1>
          
          <p className="font-sans text-body-md lg:text-body-lg text-background/80 max-w-xl mx-auto mb-10">
            {isNL 
              ? "Travertin, marmer en geselecteerde steensoorten. Op maat gemaakt." 
              : "Travertine, marble and selected stone types. Made to measure."}
          </p>
          
          {/* Signature buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
              <Link to="/collections">
                {isNL ? "Ontdek collecties" : "Discover collections"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="sera-secondary" size="lg" className="border-background/40 text-background hover:border-background/60 hover:bg-background/5">
              <Link to="/bespoke" onClick={trackProposal}>
                {isNL ? "Vraag voorstel aan" : "Request proposal"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator with hairline */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-background/50">
          <span className="micro-label text-background/50">{t('home.scroll')}</span>
          <div className="w-px h-10 bg-background/30" />
        </div>
      </section>

      {/* COLLECTIES - Editorial asymmetric layout with captions */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header with hairlines */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Collecties' : 'Collections'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
              {isNL ? "Travertin & marmer" : "Travertine & marble"}
            </h2>
            <p className="text-body-md text-muted-foreground">
              {isNL 
                ? "Twee signatuurcollecties, elk met eigen karakter."
                : "Two signature collections, each with its own character."}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="aspect-[3/4] w-full mb-6" />
                  <Skeleton className="h-4 w-1/4 mb-3" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {collections.slice(0, 2).map((collection, index) => (
                <Link
                  key={collection.node.id}
                  to={`/collections/${collection.node.handle}`}
                  className={`group block ${index === 0 ? 'lg:mt-12' : ''}`}
                >
                  {/* Image with subtle hover */}
                  <div className="image-reveal mb-6">
                    <div className="aspect-[3/4] bg-muted overflow-hidden">
                      {collection.node.image ? (
                        <img
                          src={collection.node.image.url}
                          alt={collection.node.image.altText || collection.node.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                          <span className="text-muted-foreground font-serif text-2xl">{collection.node.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Editorial caption */}
                  <div className="space-y-3">
                    <p className="editorial-caption-label">
                      {isNL ? 'Collectie' : 'Collection'}
                    </p>
                    <h3 className="font-serif text-xl lg:text-2xl text-foreground">
                      {collection.node.title}
                    </h3>
                    {collection.node.description && (
                      <p className="text-body-sm text-muted-foreground max-w-xs">
                        {getCollectionDescription(collection.node.handle, collection.node.description)}
                      </p>
                    )}
                    <div className="pt-3 flex items-center gap-3">
                      <span className="text-sm font-medium uppercase tracking-[0.1em] text-foreground">
                        {isNL ? "Ontdek" : "Discover"}
                      </span>
                      <span className="flex items-center justify-center w-8 h-8 border border-foreground/15 group-hover:border-foreground/30 group-hover:translate-x-1 transition-all duration-400">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              {isNL ? 'Geen collecties gevonden.' : 'No collections found.'}
            </p>
          )}

          <div className="text-center mt-16">
            <Button asChild variant="sera-secondary" size="lg">
              <Link to="/collections">
                {isNL ? "Bekijk alle collecties" : "View all collections"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* HOE KUNNEN WIJ HELPEN - Editorial split with action panels */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: Short intro + primary CTA */}
            <div className="lg:sticky lg:top-32">
              <p className="micro-label mb-6">
                {isNL ? 'Hoe kunnen wij helpen?' : 'How can we help?'}
              </p>
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-6">
                {isNL ? "Uw visie, onze expertise" : "Your vision, our expertise"}
              </h2>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-10 max-w-md">
                {isNL 
                  ? "Wij helpen u bij elke stap — van eerste idee tot plaatsing in uw interieur."
                  : "We guide you every step — from initial idea to installation in your interior."}
              </p>
              <Button asChild variant="sera-primary" size="lg">
                <Link to="/bespoke" onClick={trackProposal}>
                  {isNL ? "Start uw project" : "Start your project"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Right: Two bespoke action panels */}
            <div className="space-y-px">
              <ActionPanel
                label={isNL ? 'Collectie' : 'Collection'}
                title={isNL ? "Kies uit onze collectie" : "Choose from our collection"}
                description={isNL ? "Ontdek bestaande ontwerpen in travertin en marmer." : "Discover existing designs in travertine and marble."}
                ctaText={isNL ? "Bekijk collecties" : "View collections"}
                ctaLink="/collections"
                className="bg-background"
              />
              <ActionPanel
                label={isNL ? 'Maatwerk' : 'Bespoke'}
                title={isNL ? "Laat iets unieks maken" : "Have something unique made"}
                description={isNL ? "Op maat naar uw wensen, afmetingen en steenkeuze." : "Tailored to your wishes, dimensions and stone choice."}
                ctaText={isNL ? "Vraag voorstel" : "Request proposal"}
                ctaLink="/voorstel"
                className="bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WERKWIJZE - Bespoke Timeline with ghost numbers */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Werkwijze' : 'Process'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground">
              {isNL ? "Van gesprek tot plaatsing" : "From conversation to installation"}
            </h2>
          </div>
          
          {/* Bespoke Timeline with hairline separators */}
          <div className="border-t border-b" style={{ borderColor: 'hsl(var(--foreground) / 0.08)' }}>
            <BespokeTimeline steps={processSteps} className="max-w-6xl mx-auto" />
          </div>
          
          <div className="text-center mt-16">
            <Button asChild variant="sera-primary" size="lg">
              <Link to="/bespoke" onClick={trackProposal}>
                {isNL ? "Start uw project" : "Start your project"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Editorial Statement */}
      <section className="py-20 lg:py-28 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-display-sm lg:text-display-md text-foreground leading-[1.2]">
              {isNL 
                ? "Elk meubel is uniek. De steen bepaalt het karakter — wij vertalen het naar uw ruimte."
                : "Every piece is unique. The stone defines the character — we translate it to your space."}
            </p>
          </div>
        </div>
      </section>

      {/* WAAROM SERA NORR - Typographic proof grid with hairlines */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Waarom SERA NORR' : 'Why SERA NORR'}</span>
            <Hairline className="flex-1" />
          </div>

          {/* Proof Grid */}
          <ProofGrid items={proofItems} className="max-w-6xl mx-auto" />
        </div>
      </section>

      {/* Final CTA Band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-sm text-background mb-4">
              {isNL ? "Klaar om te beginnen?" : "Ready to begin?"}
            </h2>
            <p className="text-background/70 text-body-md mb-10">
              {isNL 
                ? "Plan een vrijblijvend gesprek of bekijk onze voorbeelden."
                : "Schedule a no-obligation conversation or view our examples."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
                <Link to="/contact">
                  {isNL ? "Neem contact op" : "Get in touch"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="sera-secondary" size="lg" className="border-background/30 text-background hover:border-background/50">
                <Link to="/lookbook">
                  {isNL ? "Bekijk lookbook" : "View lookbook"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
