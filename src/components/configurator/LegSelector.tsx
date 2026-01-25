// ============================================
// Leg Selector - Meraki-Style Premium UI
// ============================================

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { TableShape } from '@/lib/configurator/types';
import { 
  LEG_LIBRARY, 
  LEG_CATEGORY_LABELS,
  isLegCompatible,
  type LegCategory,
  type LegStyle,
} from '@/lib/configurator/leg-library';

// ============================================
// SVG Icons for each leg style
// ============================================

function LegIcon({ legId, className }: { legId: string; className?: string }) {
  const iconClass = cn("w-full h-full", className);
  
  switch (legId) {
    case 'pillar-leg':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="16" y="8" width="8" height="24" rx="4" />
        </svg>
      );
    case 'cone-leg':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 32 L20 8 L26 32 Z" />
        </svg>
      );
    case 'block-frame':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="8" y="12" width="24" height="20" rx="1" />
          <line x1="8" y1="20" x2="32" y2="20" />
        </svg>
      );
    case 'edge-frame':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 32 L8 12 L14 12" />
          <path d="M32 32 L32 12 L26 12" />
          <line x1="8" y1="32" x2="32" y2="32" />
        </svg>
      );
    case 'rock-beam':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 32 L10 16 L20 20 L30 14 L34 32 Z" />
        </svg>
      );
    case 'hexa-beam':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="20,8 30,14 30,26 20,32 10,26 10,14" />
        </svg>
      );
    case 'twin-fold':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 32 L10 16 L20 12 L20 32" />
          <path d="M20 32 L20 16 L30 12 L30 32" />
        </svg>
      );
    case 'angle-corner':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 32 L8 12 L16 12 L16 20" />
          <path d="M32 32 L32 12 L24 12 L24 20" />
        </svg>
      );
    case 'twist-base':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 32 Q20 24 26 20 Q14 16 20 8" strokeLinecap="round" />
        </svg>
      );
    case 'slope-base':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 32 L10 18 L30 14 L30 32 Z" />
        </svg>
      );
    case 'fluted-base':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="20" cy="30" rx="10" ry="3" />
          <ellipse cx="20" cy="10" rx="6" ry="2" />
          <path d="M14 10 L10 30" />
          <path d="M17 10 L15 30" />
          <path d="M23 10 L25 30" />
          <path d="M26 10 L30 30" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="12" y="10" width="16" height="20" rx="2" />
        </svg>
      );
  }
}

// ============================================
// Category Filter
// ============================================

interface CategoryFilterProps {
  value: LegCategory | 'all';
  onChange: (category: LegCategory | 'all') => void;
  isNL?: boolean;
}

function CategoryFilter({ value, onChange, isNL = true }: CategoryFilterProps) {
  const categories: (LegCategory | 'all')[] = ['all', 'core', 'architectural', 'sculptural'];
  
  return (
    <div className="flex gap-1 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-sm transition-all duration-200",
            value === cat
              ? "bg-foreground text-background"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
          )}
        >
          {cat === 'all' 
            ? (isNL ? 'Alle' : 'All')
            : LEG_CATEGORY_LABELS[cat][isNL ? 'nl' : 'en']
          }
        </button>
      ))}
    </div>
  );
}

// ============================================
// Leg Card
// ============================================

interface LegCardProps {
  leg: LegStyle;
  isSelected: boolean;
  isCompatible: boolean;
  onSelect: () => void;
  isNL?: boolean;
}

function LegCard({ leg, isSelected, isCompatible, onSelect, isNL = true }: LegCardProps) {
  return (
    <button
      onClick={() => isCompatible && onSelect()}
      disabled={!isCompatible}
      className={cn(
        "relative flex flex-col items-center p-4 rounded-sm border transition-all duration-200 text-center group",
        isSelected 
          ? "border-foreground bg-foreground/5" 
          : isCompatible
            ? "border-border hover:border-foreground/50 hover:bg-secondary/20"
            : "border-border/50 opacity-40 cursor-not-allowed"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 mb-3 transition-colors",
        isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"
      )}>
        <LegIcon legId={leg.id} />
      </div>
      
      {/* Name */}
      <span className="text-xs font-medium block">{leg.name}</span>
      
      {/* Price uplift indicator */}
      {leg.priceUplift > 0 && isCompatible && (
        <span className="text-[10px] text-muted-foreground mt-1">
          +€{leg.priceUplift.toLocaleString('nl-NL')}
        </span>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-background" />
        </div>
      )}
      
      {/* Category badge - subtle */}
      <span className={cn(
        "absolute bottom-1 left-1 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm",
        leg.category === 'core' && "bg-secondary/50 text-muted-foreground",
        leg.category === 'architectural' && "bg-primary/10 text-primary/70",
        leg.category === 'sculptural' && "bg-accent/10 text-accent-foreground/70"
      )}>
        {LEG_CATEGORY_LABELS[leg.category][isNL ? 'nl' : 'en']}
      </span>
    </button>
  );
}

// ============================================
// Main Leg Selector Component
// ============================================

interface LegSelectorProps {
  value: string;
  shape: TableShape;
  length: number;
  diameter?: number;
  onChange: (legId: string) => void;
  isNL?: boolean;
  className?: string;
}

export function LegSelector({ 
  value, 
  shape, 
  length, 
  diameter,
  onChange, 
  isNL = true, 
  className 
}: LegSelectorProps) {
  const [categoryFilter, setCategoryFilter] = useState<LegCategory | 'all'>('all');

  // Filter legs by category
  const filteredLegs = useMemo(() => {
    const activeLegs = LEG_LIBRARY.filter(leg => leg.isActiveInConfigurator);
    if (categoryFilter === 'all') {
      return activeLegs.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return activeLegs
      .filter(leg => leg.category === categoryFilter)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categoryFilter]);

  // Check if current selection is still valid
  const selectedLeg = LEG_LIBRARY.find(l => l.id === value);
  const isCurrentValid = selectedLeg && isLegCompatible(value, shape, length, diameter);

  // Incompatibility message
  const incompatibleMessage = useMemo(() => {
    if (!isCurrentValid && selectedLeg) {
      return isNL 
        ? 'Niet beschikbaar voor deze vorm/maat'
        : 'Not available for this shape/size';
    }
    return null;
  }, [isCurrentValid, selectedLeg, isNL]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Category Filter */}
      <CategoryFilter 
        value={categoryFilter}
        onChange={setCategoryFilter}
        isNL={isNL}
      />

      {/* Incompatibility warning */}
      {incompatibleMessage && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-sm">
          {incompatibleMessage}
        </p>
      )}

      {/* Leg Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        {filteredLegs.map((leg) => {
          const isCompatible = isLegCompatible(leg.id, shape, length, diameter);
          const isSelected = value === leg.id;
          
          return (
            <LegCard
              key={leg.id}
              leg={leg}
              isSelected={isSelected}
              isCompatible={isCompatible}
              onSelect={() => onChange(leg.id)}
              isNL={isNL}
            />
          );
        })}
      </div>

      {/* Empty state */}
      {filteredLegs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          {isNL ? 'Geen onderstellen in deze categorie' : 'No bases in this category'}
        </p>
      )}
    </div>
  );
}
