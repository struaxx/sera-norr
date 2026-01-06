import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hairline } from "@/components/ui/hairline";
import { ConfiguratorTeaser } from "@/components/homepage";
import { LookbookFilters, LookbookGrid, type FilterState } from "@/components/collections";
import vantaFallback from "@/assets/vanta-collection.jpg";
import terraFallback from "@/assets/terra-collection.jpg";

const Collections = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const [filters, setFilters] = useState<FilterState>({
    stone: null,
    type: null,
    shape: null,
    search: "",
  });

  const seoTitle = isNL 
    ? "Collecties | SERA NORR — Curated Lookbook voor Natuursteen Maatwerk"
    : "Collections | SERA NORR — Curated Lookbook for Natural Stone Bespoke";

  const seoDescription = isNL
    ? "Ontdek de SERA NORR signature archive: vormen, verhoudingen en materialen als inspiratie voor uw maatwerk project."
    : "Discover the SERA NORR signature archive: shapes, proportions and materials as inspiration for your bespoke project.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Collecties' : 'Collections', url: '/collections' },
  ]);

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "SERA NORR, collecties, lookbook, travertin meubels, Calacatta Viola marmer, maatwerk" 
          : "SERA NORR, collections, lookbook, travertine furniture, Calacatta Viola marble, bespoke"}
        structuredData={breadcrumbSchema}
      />

      {/* ========================================
          HERO + POSITIONERING
          ======================================== */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8 opacity-60 text-[10px]" />
          
          <div className="max-w-3xl">
            <p className="micro-label mb-6">
              {isNL ? 'Collecties' : 'Collections'}
            </p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {isNL ? "Signature Archive" : "Signature Archive"}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl mb-4">
              {isNL 
                ? "Dit is geen webshop. Dit zijn voorbeelden van vormen, verhoudingen en materialen waar wij achter staan — bedoeld als inspiratie voor uw maatwerk project."
                : "This is not a webshop. These are examples of shapes, proportions and materials we stand behind — meant as inspiration for your bespoke project."}
            </p>
            <p className="text-body-md text-muted-foreground/70 mb-10">
              {isNL 
                ? "Alles wordt op maat gemaakt. Geen voorraad."
                : "Everything is made to measure. No stock."}
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

      {/* ========================================
          VANTA COLLECTIE SPOTLIGHT
          ======================================== */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
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
                  <img
                    src={vantaFallback}
                    alt={isNL ? "VANTA collectie - Calacatta Viola marmer" : "VANTA collection - Calacatta Viola marble"}
                    className="w-full h-full object-cover"
                  />
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
              <p className="text-body-md text-muted-foreground leading-relaxed mb-6 max-w-md">
                {isNL 
                  ? "Rijke paarse adering in zeldzaam Italiaans marmer. Elk stuk is uniek."
                  : "Rich purple veining in rare Italian marble. Every piece is unique."}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-10">
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Materiaal: Calacatta Viola" : "Material: Calacatta Viola"}
                </span>
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Gevoel: Sculpturaal" : "Feel: Sculptural"}
                </span>
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Statement" : "Statement"}
                </span>
              </div>

              <Button asChild variant="sera-secondary" size="lg">
                <Link to="/collections/vanta">
                  {isNL ? "Ontdek VANTA" : "Discover VANTA"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          TERRA COLLECTIE SPOTLIGHT
          ======================================== */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
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
              <p className="text-body-md text-muted-foreground leading-relaxed mb-6 max-w-md">
                {isNL 
                  ? "Warme beigetinten en tijdloze texturen. Natuurlijk travertin gevormd door eeuwen."
                  : "Warm beige tones and timeless textures. Natural travertine formed over centuries."}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-10">
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Materiaal: Travertin" : "Material: Travertine"}
                </span>
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Gevoel: Rustig" : "Feel: Calm"}
                </span>
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Tijdloos" : "Timeless"}
                </span>
              </div>

              <Button asChild variant="sera-secondary" size="lg">
                <Link to="/collections/terra">
                  {isNL ? "Ontdek TERRA" : "Discover TERRA"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 image-reveal">
              <Link to="/collections/terra">
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src={terraFallback}
                    alt={isNL ? "TERRA collectie - Travertin meubels" : "TERRA collection - Travertine furniture"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          LOOKBOOK GRID + FILTERS
          ======================================== */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-12">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? "Selectie ontwerpen" : "Selected designs"}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              {isNL ? "Ontdek onze vormtaal" : "Explore our design language"}
            </h2>
            <p className="text-body-md text-muted-foreground max-w-xl">
              {isNL 
                ? "Blader door onze signature ontwerpen. Elk stuk kan naar uw specificaties worden gemaakt."
                : "Browse through our signature designs. Every piece can be made to your specifications."}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12">
            <LookbookFilters isNL={isNL} onFilterChange={setFilters} />
          </div>

          {/* Grid */}
          <LookbookGrid isNL={isNL} filters={filters} />
        </div>
      </section>

      {/* ========================================
          BRIDGE: VERTAAL DIT NAAR UW RUIMTE
          ======================================== */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="micro-label mb-4">
                {isNL ? 'Maatwerk' : 'Bespoke'}
              </p>
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-4">
                {isNL ? "Vertaal dit naar uw ruimte" : "Translate this to your space"}
              </h2>
              <p className="text-body-md text-muted-foreground max-w-lg mx-auto">
                {isNL 
                  ? "Gebruik onze ontwerpen als startpunt. Wij finetunen samen tot perfectie."
                  : "Use our designs as a starting point. We fine-tune together to perfection."}
              </p>
            </div>

            {/* 3-step preview */}
            <ConfiguratorTeaser isNL={isNL} />

            <p className="text-center text-xs text-muted-foreground/60 mt-6">
              {isNL ? "Indicatief. We finetunen samen." : "Indicative. We fine-tune together."}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          EINDSECTIE CTA
          ======================================== */}
      <section className="py-24 lg:py-32 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-sm lg:text-display-md text-background mb-4">
              {isNL ? "Klaar om te beginnen?" : "Ready to start?"}
            </h2>
            <p className="text-background/70 text-body-md mb-10 max-w-md mx-auto">
              {isNL 
                ? "Laat ons weten wat u zoekt. Wij vertalen uw wensen naar een concreet voorstel."
                : "Let us know what you're looking for. We'll translate your wishes into a concrete proposal."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
                <Link to="/bespoke">
                  {isNL ? "Start uw project" : "Start your project"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link 
                to="/contact" 
                className="text-sm uppercase tracking-[0.1em] text-background/60 hover:text-background transition-colors"
              >
                {isNL ? "Neem contact op" : "Contact us"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
