import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check, Search, X, Plus, Upload, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  STONE_LIBRARY, 
  getStonesByFamily, 
  searchStones, 
  type StoneFamily, 
  type CharacterTag,
  type StoneLibraryEntry 
} from '@/lib/configurator/stone-library';
import { getSwatchTexture } from '@/lib/configurator/texture-resolver';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface StoneSelectorV2Props {
  value: string;
  onChange: (stoneId: string) => void;
  onCustomStoneRequest?: (request: CustomStoneRequest) => void;
  isNL?: boolean;
  className?: string;
}

export interface CustomStoneRequest {
  stoneName: string;
  notes?: string;
  imageFile?: File;
}

type FilterTag = 'warm' | 'cool' | 'calm' | 'statement';

const FILTER_TAGS: { id: FilterTag; labelNL: string; labelEN: string }[] = [
  { id: 'warm', labelNL: 'Warm', labelEN: 'Warm' },
  { id: 'cool', labelNL: 'Koel', labelEN: 'Cool' },
  { id: 'calm', labelNL: 'Rustig', labelEN: 'Calm' },
  { id: 'statement', labelNL: 'Statement', labelEN: 'Statement' },
];

export function StoneSelectorV2({ 
  value, 
  onChange, 
  onCustomStoneRequest,
  isNL = true, 
  className 
}: StoneSelectorV2Props) {
  const [activeTab, setActiveTab] = useState<StoneFamily>('travertine');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterTag[]>([]);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customStoneName, setCustomStoneName] = useState('');
  const [customStoneNotes, setCustomStoneNotes] = useState('');
  const [customStoneImage, setCustomStoneImage] = useState<File | null>(null);

  // Get stones for active tab
  const familyStones = useMemo(() => {
    return getStonesByFamily(activeTab);
  }, [activeTab]);

  // Apply search and filters
  const filteredStones = useMemo(() => {
    let stones = familyStones;

    // Apply search
    if (searchQuery.trim()) {
      const searchResults = searchStones(searchQuery);
      stones = stones.filter(s => searchResults.some(sr => sr.id === s.id));
    }

    // Apply filters
    if (activeFilters.length > 0) {
      stones = stones.filter(s => 
        activeFilters.some(filter => s.characterTags.includes(filter as CharacterTag))
      );
    }

    return stones;
  }, [familyStones, searchQuery, activeFilters]);

  const toggleFilter = (filter: FilterTag) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
  };

  const handleCustomStoneSubmit = () => {
    if (customStoneName.trim() && onCustomStoneRequest) {
      onCustomStoneRequest({
        stoneName: customStoneName,
        notes: customStoneNotes || undefined,
        imageFile: customStoneImage || undefined,
      });
      setIsCustomDialogOpen(false);
      setCustomStoneName('');
      setCustomStoneNotes('');
      setCustomStoneImage(null);
      // Select custom as the stone type
      onChange('custom');
    }
  };

  const selectedStone = STONE_LIBRARY.find(s => s.id === value);
  const hasActiveFilters = activeFilters.length > 0 || searchQuery.trim() !== '';

  return (
    <div className={cn("space-y-4", className)}>
      {/* Trust microline */}
      <p className="text-[11px] text-muted-foreground italic border-l-2 border-border pl-3">
        {isNL 
          ? 'Elke steen is uniek. Definitieve selectie gebeurt op slab-niveau.'
          : 'Every stone is unique. Final selection happens at slab level.'
        }
      </p>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('travertine')}
          className={cn(
            "flex-1 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-200 border-b-2 -mb-px",
            activeTab === 'travertine'
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {isNL ? 'Travertijn' : 'Travertine'}
          <span className="ml-2 text-[10px] opacity-60">({getStonesByFamily('travertine').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('marble')}
          className={cn(
            "flex-1 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-200 border-b-2 -mb-px",
            activeTab === 'marble'
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {isNL ? 'Marmer' : 'Marble'}
          <span className="ml-2 text-[10px] opacity-60">({getStonesByFamily('marble').length})</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isNL ? 'Zoek steensoort…' : 'Search stone type…'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-10 text-sm bg-secondary/50 border-0 focus:ring-1 focus:ring-foreground/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleFilter(tag.id)}
              className={cn(
                "px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-full transition-all duration-200",
                activeFilters.includes(tag.id)
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {isNL ? tag.labelNL : tag.labelEN}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              {isNL ? 'Reset' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* Stone Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {filteredStones.map((stone) => (
            <StoneCard
              key={stone.id}
              stone={stone}
              isSelected={value === stone.id}
              onClick={() => onChange(stone.id)}
              isNL={isNL}
            />
          ))}
        </AnimatePresence>

        {filteredStones.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <p className="text-sm">
              {isNL ? 'Geen stenen gevonden' : 'No stones found'}
            </p>
            <button
              onClick={clearFilters}
              className="text-xs underline mt-2"
            >
              {isNL ? 'Filters wissen' : 'Clear filters'}
            </button>
          </div>
        )}
      </div>

      {/* Custom Stone Request Card */}
      <button
        onClick={() => setIsCustomDialogOpen(true)}
        className="w-full p-4 border border-dashed border-border rounded-sm hover:border-foreground/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium block">
              {isNL ? 'Andere steen (op aanvraag)' : 'Custom stone (on request)'}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isNL ? 'Beschrijf uw gewenste steensoort' : 'Describe your desired stone type'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </button>

      {/* Custom Stone Dialog */}
      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">
              {isNL ? 'Aangepaste steenaanvraag' : 'Custom Stone Request'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {isNL 
                ? 'Beschrijf de steen die u zoekt en we nemen contact met u op.'
                : 'Describe the stone you\'re looking for and we\'ll contact you.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {isNL ? 'Gewenste steensoort' : 'Desired stone type'} *
              </label>
              <Input
                value={customStoneName}
                onChange={(e) => setCustomStoneName(e.target.value)}
                placeholder={isNL ? 'Bijv. Statuario Extra, Azul Bahia...' : 'E.g. Statuario Extra, Azul Bahia...'}
                className="h-10"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {isNL ? 'Aanvullende opmerkingen' : 'Additional notes'}
              </label>
              <Textarea
                value={customStoneNotes}
                onChange={(e) => setCustomStoneNotes(e.target.value)}
                placeholder={isNL ? 'Specifieke kenmerken, kleur, herkomst...' : 'Specific characteristics, color, origin...'}
                className="min-h-[80px] resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {isNL ? 'Referentie foto (optioneel)' : 'Reference photo (optional)'}
              </label>
              <label className="flex items-center gap-3 p-3 border border-dashed border-border rounded-sm cursor-pointer hover:border-foreground/50 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {customStoneImage 
                    ? customStoneImage.name 
                    : (isNL ? 'Klik om te uploaden' : 'Click to upload')
                  }
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCustomStoneImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCustomDialogOpen(false)}
                className="flex-1"
              >
                {isNL ? 'Annuleren' : 'Cancel'}
              </Button>
              <Button
                onClick={handleCustomStoneSubmit}
                disabled={!customStoneName.trim()}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90"
              >
                {isNL ? 'Toevoegen aan dossier' : 'Add to dossier'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky Summary Bar */}
      {selectedStone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-3 -mx-4 px-4 mt-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div 
                className="w-8 h-8 rounded-full border border-border flex-shrink-0"
                style={{ backgroundColor: selectedStone.swatchColor }}
              />
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground block">
                  {isNL ? 'Geselecteerd' : 'Selected'}
                </span>
                <span className="text-sm font-medium truncate block">
                  {selectedStone.name}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Individual Stone Card Component
interface StoneCardProps {
  stone: StoneLibraryEntry;
  isSelected: boolean;
  onClick: () => void;
  isNL: boolean;
}

function StoneCard({ stone, isSelected, onClick, isNL }: StoneCardProps) {
  // Get the UNIFIED texture - same as what 3D uses
  const textureUrl = getSwatchTexture(stone.id);
  
  const collectionLabel = {
    terra: 'TERRA',
    vanta: 'VANTA',
    core: stone.family === 'travertine' ? 'TRAVERTINE' : 'MARBLE',
  };

  const tierLabel = {
    signature: isNL ? 'Signature' : 'Signature',
    atelier: isNL ? 'Atelier' : 'Atelier',
    icon: isNL ? 'Icon' : 'Icon',
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative rounded-sm border transition-all duration-200 text-left group overflow-hidden",
        isSelected 
          ? "border-foreground ring-1 ring-foreground" 
          : "border-border hover:border-foreground/50"
      )}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-md">
          <Check className="w-3.5 h-3.5 text-background" />
        </div>
      )}

      {/* Large Swatch - SAME texture as 3D render */}
      <div 
        className="aspect-square w-full relative"
        style={{ backgroundColor: stone.swatchColor }}
      >
        <img 
          src={textureUrl} 
          alt={stone.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image on error, show color background
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Veining overlay fallback only if no image loads */}
        {stone.characterTags.includes('veined') && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-0"
            style={{
              background: stone.swatchColor.startsWith('#F') || stone.swatchColor.startsWith('#E')
                ? 'linear-gradient(135deg, transparent 30%, rgba(100, 100, 100, 0.2) 45%, transparent 60%)'
                : 'linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.2) 45%, transparent 60%)',
            }}
          />
        )}
        
        {/* Tier badge overlay */}
        <div className="absolute bottom-2 left-2">
          <span className={cn(
            "text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm",
            stone.tier === 'icon' 
              ? "bg-foreground/80 text-background" 
              : stone.tier === 'atelier'
                ? "bg-background/80 text-foreground"
                : "bg-background/60 text-foreground/80"
          )}>
            {tierLabel[stone.tier]}
          </span>
        </div>
      </div>

      {/* Info section */}
      <div className="p-3">
        {/* Stone name */}
        <h4 className="text-sm font-medium mb-0.5 line-clamp-1">
          {stone.name}
        </h4>

        {/* Collection label */}
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
          {collectionLabel[stone.collection]}
        </p>
      </div>
    </motion.button>
  );
}

// Named export for the finish selector to keep alongside stone selector
export { FinishSelector } from './StoneSelector';
