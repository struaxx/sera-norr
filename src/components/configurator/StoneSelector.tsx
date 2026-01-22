import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { StoneType, FinishType } from '@/lib/configurator';
import { STONE_MATERIALS, FINISHES } from '@/lib/configurator';

interface StoneSelectorProps {
  value: StoneType;
  onChange: (stone: StoneType) => void;
  isNL?: boolean;
  className?: string;
}

export function StoneSelector({ value, onChange, isNL = true, className }: StoneSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Steen' : 'Stone'}
      </label>
      
      <div className="space-y-2">
        {STONE_MATERIALS.filter(s => s.available).map((stone) => {
          const isSelected = value === stone.id;
          
          return (
            <button
              key={stone.id}
              onClick={() => onChange(stone.id)}
              className={cn(
                "relative w-full flex items-center gap-4 p-3 rounded-sm border transition-all duration-200 text-left",
                isSelected 
                  ? "border-foreground bg-foreground/5" 
                  : "border-border hover:border-foreground/50"
              )}
            >
              {/* Color swatch */}
              <div 
                className="w-10 h-10 rounded-full border border-border flex-shrink-0 relative overflow-hidden"
                style={{ backgroundColor: stone.color }}
              >
                {/* Veining effect for marbles */}
                {stone.id === 'calacattaViola' && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, transparent 40%, rgba(139, 107, 139, 0.5) 45%, transparent 50%)',
                    }}
                  />
                )}
                {stone.id === 'neroMarquina' && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(45deg, transparent 45%, rgba(74, 74, 74, 0.6) 48%, transparent 51%)',
                    }}
                  />
                )}
                {stone.id === 'verdeAlpi' && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(120deg, transparent 35%, rgba(255, 255, 255, 0.15) 40%, transparent 45%)',
                    }}
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <span className="text-sm block">
                  {stone.name[isNL ? 'nl' : 'en']}
                </span>
                {stone.collection && stone.collection !== 'other' && (
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {stone.collection === 'terra' ? 'TERRA' : 'VANTA'} {isNL ? 'collectie' : 'collection'}
                  </span>
                )}
                {stone.id === 'custom' && (
                  <span className="text-[10px] text-muted-foreground">
                    {isNL ? 'Neem contact op voor andere steensoorten' : 'Contact us for other stone types'}
                  </span>
                )}
              </div>

              {/* Price indicator */}
              {stone.priceMultiplier > 1 && (
                <span className="text-[10px] text-muted-foreground">
                  {'€'.repeat(Math.min(3, Math.ceil(stone.priceMultiplier)))}
                </span>
              )}

              {isSelected && (
                <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-background" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FinishSelectorProps {
  value: FinishType;
  onChange: (finish: FinishType) => void;
  isNL?: boolean;
  className?: string;
}

export function FinishSelector({ value, onChange, isNL = true, className }: FinishSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Afwerking' : 'Finish'}
      </label>
      
      <div className="flex gap-2">
        {FINISHES.map((finish) => {
          const isSelected = value === finish.id;
          
          return (
            <button
              key={finish.id}
              onClick={() => onChange(finish.id)}
              className={cn(
                "flex-1 px-4 py-3 rounded-sm text-xs uppercase tracking-wider transition-all duration-200",
                isSelected 
                  ? "bg-foreground text-background" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              {finish.name[isNL ? 'nl' : 'en']}
            </button>
          );
        })}
      </div>
    </div>
  );
}
