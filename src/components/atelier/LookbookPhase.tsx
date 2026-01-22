// ============================================
// Lookbook Phase - Inspiratie & Collectiekeuze
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConfiguratorStore, type CollectionInspiration } from '@/stores/configurator-store';

// Inspiration items data
const INSPIRATION_ITEMS: CollectionInspiration[] = [
  { id: 'terra-dining-1', name: 'Eettafel Siena', image: '/placeholder.svg', collection: 'terra' },
  { id: 'terra-coffee-1', name: 'Salontafel Lucca', image: '/placeholder.svg', collection: 'terra' },
  { id: 'terra-console-1', name: 'Console Firenze', image: '/placeholder.svg', collection: 'terra' },
  { id: 'vanta-dining-1', name: 'Eettafel Viola', image: '/placeholder.svg', collection: 'vanta' },
  { id: 'vanta-coffee-1', name: 'Salontafel Nero', image: '/placeholder.svg', collection: 'vanta' },
  { id: 'vanta-side-1', name: 'Bijzettafel Marmo', image: '/placeholder.svg', collection: 'vanta' },
  { id: 'other-dining-1', name: 'Eettafel Verde', image: '/placeholder.svg', collection: 'other' },
  { id: 'other-coffee-1', name: 'Salontafel Alpi', image: '/placeholder.svg', collection: 'other' },
];

const COLLECTIONS = [
  { 
    id: 'terra' as const, 
    name: 'TERRA', 
    subtitle: 'Italiaans Travertin',
    description: 'Warme, aardse tinten met natuurlijke textuur',
    image: '/placeholder.svg',
  },
  { 
    id: 'vanta' as const, 
    name: 'VANTA', 
    subtitle: 'Calacatta Viola',
    description: 'Dramatische aders op ivoren ondergrond',
    image: '/placeholder.svg',
  },
  { 
    id: 'other' as const, 
    name: 'ANDERE STEEN', 
    subtitle: 'Op aanvraag',
    description: 'Verde Alpi, Nero Marquina, of uw eigen selectie',
    image: '/placeholder.svg',
  },
];

interface LookbookPhaseProps {
  onContinue: () => void;
  isNL?: boolean;
}

export function LookbookPhase({ onContinue, isNL = true }: LookbookPhaseProps) {
  const { 
    selectedCollection, 
    setSelectedCollection, 
    inspirationItems, 
    addInspiration, 
    removeInspiration 
  } = useConfiguratorStore();
  
  const [showGallery, setShowGallery] = useState(false);

  const filteredItems = selectedCollection 
    ? INSPIRATION_ITEMS.filter(i => i.collection === selectedCollection)
    : INSPIRATION_ITEMS;

  const isSelected = (id: string) => inspirationItems.some(i => i.id === id);

  const handleToggleInspiration = (item: CollectionInspiration) => {
    if (isSelected(item.id)) {
      removeInspiration(item.id);
    } else {
      addInspiration(item);
    }
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
          {isNL ? 'Stap 1 van 3' : 'Step 1 of 3'}
        </span>
        <h1 className="text-3xl md:text-4xl font-serif mb-4">
          {isNL ? 'Ontdek uw stijl' : 'Discover your style'}
        </h1>
        <p className="text-muted-foreground">
          {isNL 
            ? 'Selecteer een collectie en laat u inspireren door onze signature stukken.'
            : 'Select a collection and be inspired by our signature pieces.'}
        </p>
      </motion.div>

      {/* Collection Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {COLLECTIONS.map((collection, index) => (
          <motion.button
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              setSelectedCollection(collection.id);
              setShowGallery(true);
            }}
            className={cn(
              "group relative aspect-[4/5] overflow-hidden rounded-sm border transition-all duration-300",
              selectedCollection === collection.id 
                ? "border-foreground ring-1 ring-foreground" 
                : "border-border hover:border-foreground/50"
            )}
          >
            {/* Image */}
            <div className="absolute inset-0 bg-secondary/30">
              <img 
                src={collection.image} 
                alt={collection.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {collection.subtitle}
              </span>
              <h3 className="text-2xl font-serif mb-2">{collection.name}</h3>
              <p className="text-sm text-muted-foreground">
                {collection.description}
              </p>
              
              {selectedCollection === collection.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Inspiration Gallery */}
      <AnimatePresence>
        {showGallery && selectedCollection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Gallery Header */}
            <div className="flex items-center justify-between border-t border-border pt-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {isNL ? 'Inspiratie galerie' : 'Inspiration gallery'}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  {isNL 
                    ? 'Selecteer stukken die u aanspreken (optioneel)'
                    : 'Select pieces that inspire you (optional)'}
                </p>
              </div>
              {inspirationItems.length > 0 && (
                <span className="text-sm">
                  {inspirationItems.length} {isNL ? 'geselecteerd' : 'selected'}
                </span>
              )}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleToggleInspiration(item)}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-sm border transition-all",
                    isSelected(item.id) 
                      ? "border-foreground ring-1 ring-foreground" 
                      : "border-border hover:border-foreground/50"
                  )}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.name}
                    </span>
                  </div>
                  
                  {isSelected(item.id) && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-4 pt-8 border-t border-border"
      >
        <Button 
          onClick={onContinue}
          variant="atelier"
          size="lg"
          disabled={!selectedCollection}
          className="min-w-[280px]"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isNL ? 'Start uw ontwerp' : 'Start your design'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        
        {!selectedCollection && (
          <p className="text-sm text-muted-foreground">
            {isNL ? 'Selecteer eerst een collectie' : 'Select a collection first'}
          </p>
        )}
      </motion.div>
    </div>
  );
}
