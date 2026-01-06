import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterState } from "./LookbookFilters";

interface LookbookItem {
  id: string;
  name: string;
  collection: "VANTA" | "TERRA";
  stone: string;
  type: string;
  shape: string;
  feel: string;
  description: string;
  image?: string;
}

interface LookbookGridProps {
  isNL: boolean;
  filters: FilterState;
}

export function LookbookGrid({ isNL, filters }: LookbookGridProps) {
  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);

  // Placeholder lookbook items
  const items: LookbookItem[] = isNL ? [
    { id: "1", name: "Arco Dining", collection: "VANTA", stone: "Calacatta Viola", type: "Eettafel", shape: "Ovaal", feel: "Sculpturaal", description: "Monumentale eettafel met krachtige, ronde basis en ellipsvormig blad." },
    { id: "2", name: "Solido Console", collection: "VANTA", stone: "Calacatta Viola", type: "Console", shape: "Rechthoek", feel: "Statement", description: "Console met massieve blokbasis, gedefinieerd door paarse adering." },
    { id: "3", name: "Rondo Coffee", collection: "TERRA", stone: "Travertin", type: "Salontafel", shape: "Rond", feel: "Rustig", description: "Gestapelde ringen vormen een organische salontafel in warm travertin." },
    { id: "4", name: "Linea Dining", collection: "TERRA", stone: "Travertin", type: "Eettafel", shape: "Rechthoek", feel: "Rustig", description: "Langwerpige eettafel met strakke lijnen en natuurlijke textuur." },
    { id: "5", name: "Onda Side", collection: "VANTA", stone: "Calacatta Viola", type: "Overig", shape: "Organisch", feel: "Sculpturaal", description: "Golvende bijzettafel geïnspireerd op natuurlijke erosie." },
    { id: "6", name: "Terra Console", collection: "TERRA", stone: "Travertin", type: "Console", shape: "Rechthoek", feel: "Rustig", description: "Minimale console met zwevend blad op massieve steunpunten." },
    { id: "7", name: "Viola Oval", collection: "VANTA", stone: "Calacatta Viola", type: "Salontafel", shape: "Ovaal", feel: "Statement", description: "Lage salontafel met dramatische viola-marmer adering." },
    { id: "8", name: "Cube Media", collection: "TERRA", stone: "Travertin", type: "TV-meubel", shape: "Rechthoek", feel: "Rustig", description: "Media console met gestapelde volumes en open niches." },
  ] : [
    { id: "1", name: "Arco Dining", collection: "VANTA", stone: "Calacatta Viola", type: "Dining table", shape: "Oval", feel: "Sculptural", description: "Monumental dining table with powerful round base and elliptical top." },
    { id: "2", name: "Solido Console", collection: "VANTA", stone: "Calacatta Viola", type: "Console", shape: "Rectangle", feel: "Statement", description: "Console with massive block base, defined by purple veining." },
    { id: "3", name: "Rondo Coffee", collection: "TERRA", stone: "Travertine", type: "Coffee table", shape: "Round", feel: "Calm", description: "Stacked rings form an organic coffee table in warm travertine." },
    { id: "4", name: "Linea Dining", collection: "TERRA", stone: "Travertine", type: "Dining table", shape: "Rectangle", feel: "Calm", description: "Elongated dining table with clean lines and natural texture." },
    { id: "5", name: "Onda Side", collection: "VANTA", stone: "Calacatta Viola", type: "Other", shape: "Organic", feel: "Sculptural", description: "Undulating side table inspired by natural erosion." },
    { id: "6", name: "Terra Console", collection: "TERRA", stone: "Travertine", type: "Console", shape: "Rectangle", feel: "Calm", description: "Minimal console with floating top on massive supports." },
    { id: "7", name: "Viola Oval", collection: "VANTA", stone: "Calacatta Viola", type: "Coffee table", shape: "Oval", feel: "Statement", description: "Low coffee table with dramatic viola marble veining." },
    { id: "8", name: "Cube Media", collection: "TERRA", stone: "Travertine", type: "TV unit", shape: "Rectangle", feel: "Calm", description: "Media console with stacked volumes and open niches." },
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filters.stone && item.stone !== filters.stone) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.shape && item.shape !== filters.shape) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchMatch =
        item.name.toLowerCase().includes(searchLower) ||
        item.stone.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower) ||
        item.shape.toLowerCase().includes(searchLower) ||
        item.feel.toLowerCase().includes(searchLower);
      if (!searchMatch) return false;
    }
    return true;
  });

  const Tag = ({ label }: { label: string }) => (
    <span className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] border border-foreground/10 text-muted-foreground">
      {label}
    </span>
  );

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {filteredItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            onClick={() => setSelectedItem(item)}
            className="group text-left focus:outline-none"
          >
            {/* Image placeholder */}
            <div className="aspect-[3/4] bg-secondary/40 mb-4 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
                  {item.collection}
                </span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
            </div>
            
            {/* Title */}
            <h3 className="font-serif text-lg text-foreground mb-2 group-hover:opacity-70 transition-opacity">
              {item.name}
            </h3>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Tag label={item.stone} />
              <Tag label={item.feel} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {isNL ? "Geen ontwerpen gevonden met deze filters." : "No designs found with these filters."}
          </p>
        </div>
      )}

      {/* Detail overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedItem(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-background border border-foreground/10 p-8 lg:p-12"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Collection label */}
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 block">
                {selectedItem.collection} {isNL ? "Collectie" : "Collection"}
              </span>

              {/* Title */}
              <h2 className="font-serif text-display-sm text-foreground mb-4">
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
                  <Link to="/bespoke">
                    {isNL ? "Start uw project" : "Start your project"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
