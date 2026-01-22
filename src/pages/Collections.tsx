import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hairline } from "@/components/ui/hairline";
import { AtelierSteps } from "@/components/homepage";
import { LookbookFilters, LookbookGrid, type FilterState } from "@/components/collections";
import vantaFallback from "@/assets/vanta-collection.jpg";
import terraFallback from "@/assets/terra-collection.jpg";
import heroImage from "@/assets/hero-vanta.jpg";

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
    ? "Collecties | SERA NORR — Signature Collecties voor Natuursteen Maatwerk"
    : "Collections | SERA NORR — Signature Collections for Natural Stone Bespoke";

  const seoDescription = isNL
    ? "Ontdek de SERA NORR signature collecties: vormen, verhoudingen en materialen als richting voor uw maatwerk project."
    : "Discover the SERA NORR signature collections: shapes, proportions and materials as direction for your bespoke project.";

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
          SECTION 1 — HERO (split, visueel)
          ======================================== */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8 opacity-60 text-[10px]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="order-2 lg:order-1">
              <p className="micro-label mb-6">
                {isNL ? 'Collecties' : 'Collections'}
              </p>
              <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
                {isNL ? "Signature Collecties" : "Signature Collections"}
              </h1>
              <p className="text-body-md text-muted-foreground leading-relaxed max-w-md mb-3">
                {isNL 
                  ? "Een selectie richtingen waar we als atelier achter staan. Ontworpen om te vertalen naar uw ruimte."
                  : "A selection of directions we stand behind as an atelier. Designed to translate to your space."}
              </p>
              <p className="text-body-sm text-muted-foreground/60 mb-8">
                {isNL 
                  ? "Elk stuk wordt op maat gemaakt, op aanvraag."
                  : "Every piece is made to measure, on request."}
              </p>
              <Button asChild variant="sera-primary" size="lg">
                <Link to="/atelier">
                  {isNL ? "Start uw project" : "Start your project"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right: Editorial Image */}
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/5] lg:aspect-[3/4] bg-muted overflow-hidden">
                <img
                  src={heroImage}
                  alt={isNL ? "SERA NORR natuursteen interieur" : "SERA NORR natural stone interior"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 2 — COLLECTIE SPOTLIGHT (side by side)
          ======================================== */}
      <section className="py-20 lg:py-28 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* VANTA Card */}
            <div className="group">
              <Link to="/collections/vanta" className="block">
                <div className="aspect-[4/5] bg-muted overflow-hidden mb-6 relative">
                  <img
                    src={vantaFallback}
                    alt={isNL ? "VANTA collectie - Calacatta Viola marmer" : "VANTA collection - Calacatta Viola marble"}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </Link>
              <p className="editorial-caption-label mb-2">
                Calacatta Viola
              </p>
              <h2 className="font-serif text-display-xs lg:text-display-sm text-foreground mb-3">
                VANTA
              </h2>
              <p className="text-body-sm text-muted-foreground leading-relaxed mb-4 max-w-sm">
                {isNL 
                  ? "Rijke adering in Italiaans marmer — sculpturaal en uitgesproken."
                  : "Rich veining in Italian marble — sculptural and expressive."}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  Calacatta Viola
                </span>
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Marmer" : "Marble"}
                </span>
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Uitgesproken" : "Statement"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="sera-primary" size="default">
                  <Link to="/atelier?style=vanta">
                    {isNL ? "Ontwerp in VANTA stijl" : "Design in VANTA style"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="sera-secondary" size="default">
                  <Link to="/collections/vanta">
                    {isNL ? "Ontdek VANTA" : "Discover VANTA"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* TERRA Card */}
            <div className="group">
              <Link to="/collections/terra" className="block">
                <div className="aspect-[4/5] bg-muted overflow-hidden mb-6 relative">
                  <img
                    src={terraFallback}
                    alt={isNL ? "TERRA collectie - Travertin meubels" : "TERRA collection - Travertine furniture"}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </Link>
              <p className="editorial-caption-label mb-2">
                Travertin
              </p>
              <h2 className="font-serif text-display-xs lg:text-display-sm text-foreground mb-3">
                TERRA
              </h2>
              <p className="text-body-sm text-muted-foreground leading-relaxed mb-4 max-w-sm">
                {isNL 
                  ? "Warme beigetinten en tijdloze textuur — rustig en natuurlijk."
                  : "Warm beige tones and timeless texture — calm and natural."}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  Travertin
                </span>
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Warm" : "Warm"}
                </span>
                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
                  {isNL ? "Tijdloos" : "Timeless"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="sera-primary" size="default">
                  <Link to="/atelier?style=terra">
                    {isNL ? "Ontwerp in TERRA stijl" : "Design in TERRA style"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="sera-secondary" size="default">
                  <Link to="/collections/terra">
                    {isNL ? "Ontdek TERRA" : "Discover TERRA"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 3 & 4 — LOOKBOOK GRID + FILTERS
          ======================================== */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <h2 className="font-serif text-display-xs lg:text-display-sm text-foreground mb-3">
              {isNL ? "Atelier selectie" : "Atelier selection"}
            </h2>
            <p className="text-body-sm text-muted-foreground max-w-lg">
              {isNL 
                ? "Vormen, details en combinaties — als vertrekpunt voor maatwerk."
                : "Shapes, details and combinations — as starting point for bespoke."}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-10">
            <LookbookFilters isNL={isNL} onFilterChange={setFilters} />
          </div>

          {/* Grid */}
          <LookbookGrid isNL={isNL} filters={filters} />
        </div>
      </section>

      {/* ========================================
          SECTION 5 — BRIDGE NAAR MAATWERK
          ======================================== */}
      <section className="py-20 lg:py-28 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-display-xs lg:text-display-sm text-foreground mb-3">
                {isNL ? "Vertaal dit naar uw ruimte" : "Translate this to your space"}
              </h2>
              <p className="text-body-sm text-muted-foreground max-w-md mx-auto">
                {isNL 
                  ? "Kies een richting — wij werken het uit in uw afmeting en afwerking."
                  : "Choose a direction — we work it out in your dimensions and finish."}
              </p>
            </div>

            {/* Atelier Steps as CTA */}
            <AtelierSteps isNL={isNL} />
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 6 — EINDSECTIE CTA
          ======================================== */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-display-xs lg:text-display-sm text-background mb-8">
              {isNL ? "Klaar om te beginnen?" : "Ready to start?"}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
                <Link to="/atelier">
                  {isNL ? "Start uw project" : "Start your project"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link 
                to="/contact" 
                className="text-sm uppercase tracking-[0.1em] text-background/50 hover:text-background transition-colors"
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
