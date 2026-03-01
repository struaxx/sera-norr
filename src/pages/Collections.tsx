import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Lookbook item type
interface LookbookItem {
  id: string;
  name: string;
  collection: "VANTA" | "TERRA";
  stone: string;
  type: string;
  shape: string;
  feel: string;
  description: string;
  aspectRatio: "portrait" | "landscape" | "square";
  size: "normal" | "large" | "tall";
  image?: string;
}

const Collections = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const seoTitle = isNL 
    ? "Collecties | SERA NORR — Lookbook & Inspiratie"
    : "Collections | SERA NORR — Lookbook & Inspiration";

  const seoDescription = isNL
    ? "Ontdek de SERA NORR lookbook: sculptural stone furniture in travertin en marmer. Inspiratie voor uw maatwerk project."
    : "Discover the SERA NORR lookbook: sculptural stone furniture in travertine and marble. Inspiration for your bespoke project.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Collecties' : 'Collections', url: '/collections' },
  ]);

  // Lookbook items with varied sizes for Pinterest masonry effect
  const items: LookbookItem[] = isNL ? [
    { id: "1", name: "Arco Dining", collection: "VANTA", stone: "Calacatta Viola", type: "Eettafel", shape: "Ovaal", feel: "Sculpturaal", description: "Monumentale eettafel met krachtige, ronde basis en ellipsvormig blad.", aspectRatio: "portrait", size: "large", image: "/lookbook/marble-oval-dining.png" },
    { id: "2", name: "Solido Console", collection: "VANTA", stone: "Calacatta Viola", type: "Console", shape: "Rechthoek", feel: "Statement", description: "Console met massieve blokbasis, gedefinieerd door paarse adering.", aspectRatio: "landscape", size: "normal", image: "/lookbook/marble-oval-fluted.png" },
    { id: "3", name: "Rondo Coffee", collection: "TERRA", stone: "Travertin", type: "Salontafel", shape: "Rond", feel: "Rustig", description: "Gestapelde ringen vormen een organische salontafel in warm travertin.", aspectRatio: "square", size: "normal", image: "/lookbook/travertine-round-fluted.png" },
    { id: "4", name: "Linea Dining", collection: "TERRA", stone: "Travertin", type: "Eettafel", shape: "Rechthoek", feel: "Rustig", description: "Langwerpige eettafel met strakke lijnen en natuurlijke textuur.", aspectRatio: "landscape", size: "large", image: "/lookbook/travertine-oval-fluted.png" },
    { id: "5", name: "Onda Side", collection: "VANTA", stone: "Calacatta Viola", type: "Overig", shape: "Organisch", feel: "Sculpturaal", description: "Golvende bijzettafel geïnspireerd op natuurlijke erosie.", aspectRatio: "portrait", size: "tall", image: "/lookbook/calacatta-viola-round.png" },
    { id: "6", name: "Terra Console", collection: "TERRA", stone: "Travertin", type: "Console", shape: "Rechthoek", feel: "Rustig", description: "Minimale console met zwevend blad op massieve steunpunten.", aspectRatio: "landscape", size: "normal", image: "/lookbook/travertine-coffee-set.png" },
    { id: "7", name: "Viola Oval", collection: "VANTA", stone: "Calacatta Viola", type: "Salontafel", shape: "Ovaal", feel: "Statement", description: "Lage salontafel met dramatische viola-marmer adering.", aspectRatio: "square", size: "large", image: "/lookbook/marble-round-fluted.png" },
    { id: "8", name: "Cube Media", collection: "TERRA", stone: "Travertin", type: "TV-meubel", shape: "Rechthoek", feel: "Rustig", description: "Media console met gestapelde volumes en open niches.", aspectRatio: "landscape", size: "normal", image: "/lookbook/travertine-coffee-fluted.png" },
    { id: "9", name: "Monolith Dining", collection: "VANTA", stone: "Calacatta Viola", type: "Eettafel", shape: "Rechthoek", feel: "Statement", description: "Massieve rechthoekige tafel met sculpturale aanwezigheid.", aspectRatio: "portrait", size: "normal", image: "/lookbook/marble-coffee-fluted.png" },
    { id: "10", name: "Pebble Coffee", collection: "TERRA", stone: "Travertin", type: "Salontafel", shape: "Organisch", feel: "Rustig", description: "Asymmetrische salontafel geïnspireerd door rivierkeien.", aspectRatio: "square", size: "normal", image: "/lookbook/travertine-round-cone.png" },
    { id: "11", name: "Arch Console", collection: "TERRA", stone: "Travertin", type: "Console", shape: "Rechthoek", feel: "Rustig", description: "Console met boogvormige uitsparing en klassieke proporties.", aspectRatio: "landscape", size: "normal", image: "/lookbook/travertine-oval-slab.png" },
    { id: "12", name: "Viola Block", collection: "VANTA", stone: "Calacatta Viola", type: "Overig", shape: "Rechthoek", feel: "Sculpturaal", description: "Multifunctioneel blokobject voor zitplaats of sculptuur.", aspectRatio: "portrait", size: "tall", image: "/lookbook/marble-round-livingroom.png" },
  ] : [
    { id: "1", name: "Arco Dining", collection: "VANTA", stone: "Calacatta Viola", type: "Dining table", shape: "Oval", feel: "Sculptural", description: "Monumental dining table with powerful round base and elliptical top.", aspectRatio: "portrait", size: "large", image: "/lookbook/marble-oval-dining.png" },
    { id: "2", name: "Solido Console", collection: "VANTA", stone: "Calacatta Viola", type: "Console", shape: "Rectangle", feel: "Statement", description: "Console with massive block base, defined by purple veining.", aspectRatio: "landscape", size: "normal", image: "/lookbook/marble-oval-fluted.png" },
    { id: "3", name: "Rondo Coffee", collection: "TERRA", stone: "Travertine", type: "Coffee table", shape: "Round", feel: "Calm", description: "Stacked rings form an organic coffee table in warm travertine.", aspectRatio: "square", size: "normal", image: "/lookbook/travertine-round-fluted.png" },
    { id: "4", name: "Linea Dining", collection: "TERRA", stone: "Travertine", type: "Dining table", shape: "Rectangle", feel: "Calm", description: "Elongated dining table with clean lines and natural texture.", aspectRatio: "landscape", size: "large", image: "/lookbook/travertine-oval-fluted.png" },
    { id: "5", name: "Onda Side", collection: "VANTA", stone: "Calacatta Viola", type: "Other", shape: "Organic", feel: "Sculptural", description: "Undulating side table inspired by natural erosion.", aspectRatio: "portrait", size: "tall", image: "/lookbook/calacatta-viola-round.png" },
    { id: "6", name: "Terra Console", collection: "TERRA", stone: "Travertine", type: "Console", shape: "Rectangle", feel: "Calm", description: "Minimal console with floating top on massive supports.", aspectRatio: "landscape", size: "normal", image: "/lookbook/travertine-coffee-set.png" },
    { id: "7", name: "Viola Oval", collection: "VANTA", stone: "Calacatta Viola", type: "Coffee table", shape: "Oval", feel: "Statement", description: "Low coffee table with dramatic viola marble veining.", aspectRatio: "square", size: "large", image: "/lookbook/marble-round-fluted.png" },
    { id: "8", name: "Cube Media", collection: "TERRA", stone: "Travertine", type: "TV unit", shape: "Rectangle", feel: "Calm", description: "Media console with stacked volumes and open niches.", aspectRatio: "landscape", size: "normal", image: "/lookbook/travertine-coffee-fluted.png" },
    { id: "9", name: "Monolith Dining", collection: "VANTA", stone: "Calacatta Viola", type: "Dining table", shape: "Rectangle", feel: "Statement", description: "Massive rectangular table with sculptural presence.", aspectRatio: "portrait", size: "normal", image: "/lookbook/marble-coffee-fluted.png" },
    { id: "10", name: "Pebble Coffee", collection: "TERRA", stone: "Travertine", type: "Coffee table", shape: "Organic", feel: "Calm", description: "Asymmetric coffee table inspired by river pebbles.", aspectRatio: "square", size: "normal", image: "/lookbook/travertine-round-cone.png" },
    { id: "11", name: "Arch Console", collection: "TERRA", stone: "Travertine", type: "Console", shape: "Rectangle", feel: "Calm", description: "Console with arched cutout and classical proportions.", aspectRatio: "landscape", size: "normal", image: "/lookbook/travertine-oval-slab.png" },
    { id: "12", name: "Viola Block", collection: "VANTA", stone: "Calacatta Viola", type: "Other", shape: "Rectangle", feel: "Sculptural", description: "Multifunctional block object for seating or sculpture.", aspectRatio: "portrait", size: "tall", image: "/lookbook/marble-round-livingroom.png" },
  ];

  // Filter options
  const filterOptions = [
    { id: "all", label: isNL ? "Alles" : "All" },
    { id: "VANTA", label: "VANTA" },
    { id: "TERRA", label: "TERRA" },
    { id: "dining", label: isNL ? "Eettafels" : "Dining" },
    { id: "coffee", label: isNL ? "Salontafels" : "Coffee" },
    { id: "console", label: isNL ? "Consoles" : "Consoles" },
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    if (!activeFilter || activeFilter === "all") return true;
    if (activeFilter === "VANTA" || activeFilter === "TERRA") {
      return item.collection === activeFilter;
    }
    if (activeFilter === "dining") {
      return item.type.toLowerCase().includes("dining") || item.type.toLowerCase().includes("eettafel");
    }
    if (activeFilter === "coffee") {
      return item.type.toLowerCase().includes("coffee") || item.type.toLowerCase().includes("salontafel");
    }
    if (activeFilter === "console") {
      return item.type.toLowerCase().includes("console");
    }
    return true;
  });

  // Get aspect ratio class
  const getAspectClass = (item: LookbookItem) => {
    if (item.size === "large") {
      return item.aspectRatio === "portrait" ? "row-span-2" : "col-span-2";
    }
    if (item.size === "tall") {
      return "row-span-2";
    }
    return "";
  };

  const getHeightClass = (item: LookbookItem) => {
    if (item.size === "tall" || (item.size === "large" && item.aspectRatio === "portrait")) {
      return "aspect-[3/5]";
    }
    if (item.size === "large" && item.aspectRatio === "landscape") {
      return "aspect-[16/9]";
    }
    if (item.aspectRatio === "square") {
      return "aspect-square";
    }
    if (item.aspectRatio === "landscape") {
      return "aspect-[4/3]";
    }
    return "aspect-[3/4]";
  };

  const Tag = ({ label, variant = "default" }: { label: string; variant?: "default" | "collection" }) => (
    <span className={cn(
      "px-2.5 py-1 text-[9px] uppercase tracking-[0.15em]",
      variant === "collection" 
        ? "bg-foreground/5 text-foreground/80" 
        : "border border-foreground/10 text-muted-foreground"
    )}>
      {label}
    </span>
  );

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
          LOOKBOOK HEADER (minimal)
          ======================================== */}
      <section className="pt-28 lg:pt-36 pb-8 lg:pb-12 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-6 opacity-60 text-[10px]" />
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="micro-label mb-3">
                {isNL ? 'Lookbook' : 'Lookbook'}
              </p>
              <h1 className="font-serif text-display-xs lg:text-display-sm text-foreground">
                {isNL ? "Collecties" : "Collections"}
              </h1>
            </div>
            
            {/* CTA */}
            <Button asChild variant="sera-primary" size="default">
              <Link to="/atelier">
                {isNL ? "Ontwerp uw tafel" : "Design your table"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================
          FILTER BAR (sticky)
          ======================================== */}
      <section className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur-sm border-y border-foreground/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 py-4 overflow-x-auto scrollbar-hide">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id === "all" ? null : filter.id)}
                className={cn(
                  "px-4 py-2 text-[11px] uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-300 border",
                  (activeFilter === filter.id || (filter.id === "all" && !activeFilter))
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground/60 border-foreground/10 hover:border-foreground/25 hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          PINTEREST MASONRY GRID
          ======================================== */}
      <section className="py-8 lg:py-12 bg-background min-h-screen">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[minmax(200px,auto)]">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.03,
                    layout: { duration: 0.4 }
                  }}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    "group text-left focus:outline-none relative overflow-hidden",
                    getAspectClass(item)
                  )}
                >
                  {/* Image placeholder with collection-based color */}
                  <div className={cn(
                    "w-full h-full min-h-[240px] overflow-hidden relative",
                    getHeightClass(item),
                    !item.image && (item.collection === "VANTA" 
                      ? "bg-gradient-to-br from-secondary/60 via-secondary/40 to-secondary/20" 
                      : "bg-gradient-to-br from-[#E8DFD0]/60 via-[#E8DFD0]/40 to-[#E8DFD0]/20")
                  )}>
                    {/* Product image */}
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Hover overlay with info */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/80 transition-all duration-500 flex flex-col justify-end p-4 lg:p-5">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-background/60 mb-1.5">
                          {item.collection}
                        </p>
                        <h3 className="font-serif text-base lg:text-lg text-background mb-2">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 text-[8px] uppercase tracking-[0.1em] bg-background/10 text-background/80">
                            {item.type}
                          </span>
                          <span className="px-2 py-0.5 text-[8px] uppercase tracking-[0.1em] bg-background/10 text-background/80">
                            {item.stone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm">
                {isNL ? "Geen ontwerpen gevonden." : "No designs found."}
              </p>
              <button
                onClick={() => setActiveFilter(null)}
                className="mt-4 text-xs uppercase tracking-[0.1em] text-foreground underline underline-offset-4"
              >
                {isNL ? "Bekijk alles" : "View all"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          BOTTOM CTA BAR
          ======================================== */}
      <section className="py-16 lg:py-20 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-serif text-display-xs text-background mb-2">
                {isNL ? "Vertaal dit naar uw ruimte" : "Translate this to your space"}
              </h2>
              <p className="text-background/60 text-sm max-w-md">
                {isNL 
                  ? "Elk stuk wordt op maat gemaakt. Start uw ontwerp in de atelier."
                  : "Every piece is made to measure. Start your design in the atelier."}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
                <Link to="/atelier">
                  {isNL ? "Ontwerp uw tafel" : "Design your table"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link 
                to="/contact" 
                className="inline-flex items-center text-sm uppercase tracking-[0.1em] text-background/50 hover:text-background transition-colors"
              >
                {isNL ? "Neem contact op" : "Contact us"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          DETAIL OVERLAY (modal)
          ======================================== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
            onClick={() => setSelectedItem(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/98 backdrop-blur-sm" />
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-background border border-foreground/10 p-8 lg:p-10"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Collection label */}
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 block">
                {selectedItem.collection} {isNL ? "Collectie" : "Collection"}
              </span>

              {/* Title */}
              <h2 className="font-serif text-display-xs lg:text-display-sm text-foreground mb-4">
                {selectedItem.name}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Tag label={selectedItem.stone} />
                <Tag label={selectedItem.type} />
                <Tag label={selectedItem.shape} />
                <Tag label={selectedItem.feel} />
              </div>

              {/* Description */}
              <p className="text-body-md text-muted-foreground leading-relaxed mb-8">
                {selectedItem.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="sera-primary" size="lg">
                  <Link to={`/atelier?style=${selectedItem.collection.toLowerCase()}`}>
                    {isNL ? "Ontwerp in deze stijl" : "Design in this style"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Collections;