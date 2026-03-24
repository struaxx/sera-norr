// ============================================
// Leg Selector - Updated for 9-style system
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
    case 'cylindrical':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="16" y="8" width="8" height="24" rx="4" />
        </svg>
      );
    case 'cylindrical_fluted':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="14" y="8" width="12" height="24" rx="1" />
          <line x1="17" y1="8" x2="17" y2="32" />
          <line x1="20" y1="8" x2="20" y2="32" />
          <line x1="23" y1="8" x2="23" y2="32" />
        </svg>
      );
    case 'conical':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 32 L17 8 L23 8 L26 32 Z" />
        </svg>
      );
    case 'hourglass':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 8 L22 20 L14 32 M26 8 L18 20 L26 32" />
        </svg>
      );
    case 'quartet_legs':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="20" cy="28" rx="12" ry="4" />
          <ellipse cx="20" cy="12" rx="10" ry="3" />
          <line x1="10" y1="12" x2="8" y2="28" />
          <line x1="30" y1="12" x2="32" y2="28" />
        </svg>
      );
    case 'v_legs':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 8 L16 32" strokeLinecap="round" />
          <path d="M28 8 L24 32" strokeLinecap="round" />
        </svg>
      );
    case 'd_legs':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 8 L14 32 Q20 32 20 20 Q20 8 14 8" />
          <path d="M26 8 L26 32 Q20 32 20 20 Q20 8 26 8" />
        </svg>
      );
    case 'rounded_legs':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="12" y1="8" x2="12" y2="28" strokeLinecap="round" />
          <circle cx="12" cy="30" r="2" />
          <line x1="28" y1="8" x2="28" y2="28" strokeLinecap="round" />
          <circle cx="28" cy="30" r="2" />
        </svg>
      );
    case 'curved_legs':
      return (
        <svg viewBox="0 0 40 40" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 8 Q10 20 14 32" strokeLinecap="round" />
          <path d="M28 8 Q30 20 26 32" strokeLinecap="round" />
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
  const categories: (LegCategory | 'all')[] = ['all', 'pedestal', 'fixed'];
  
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
      <div className={cn(
        "w-12 h-12 mb-3 transition-colors",
        isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"
      )}>
        <LegIcon legId={leg.id} />
      </div>
      
      <span className="text-xs font-medium block">{leg.name}</span>
      

      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-background" />
        </div>
      )}
      
      <span className={cn(
        "absolute bottom-1 left-1 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm",
        leg.category === 'pedestal' && "bg-secondary/50 text-muted-foreground",
        leg.category === 'fixed' && "bg-primary/10 text-primary/70",
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

  const filteredLegs = useMemo(() => {
    const activeLegs = LEG_LIBRARY.filter(leg => leg.isActiveInConfigurator);
    if (categoryFilter === 'all') {
      return activeLegs.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return activeLegs
      .filter(leg => leg.category === categoryFilter)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categoryFilter]);

  const selectedLeg = LEG_LIBRARY.find(l => l.id === value);
  const isCurrentValid = selectedLeg && isLegCompatible(value, shape, length, diameter);

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
      <CategoryFilter 
        value={categoryFilter}
        onChange={setCategoryFilter}
        isNL={isNL}
      />

      {incompatibleMessage && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-sm">
          {incompatibleMessage}
        </p>
      )}

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

      {filteredLegs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          {isNL ? 'Geen onderstellen in deze categorie' : 'No bases in this category'}
        </p>
      )}
    </div>
  );
}
