import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LookbookFiltersProps {
  isNL: boolean;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  stone: string | null;
  type: string | null;
  shape: string | null;
  search: string;
}

export function LookbookFilters({ isNL, onFilterChange }: LookbookFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    stone: null,
    type: null,
    shape: null,
    search: "",
  });

  const stoneOptions = isNL
    ? ["Calacatta Viola", "Travertin", "Overig"]
    : ["Calacatta Viola", "Travertine", "Other"];

  const typeOptions = isNL
    ? ["Eettafel", "Salontafel", "Console", "TV-meubel", "Overig"]
    : ["Dining table", "Coffee table", "Console", "TV unit", "Other"];

  const shapeOptions = isNL
    ? ["Rond", "Ovaal", "Rechthoek", "Organisch"]
    : ["Round", "Oval", "Rectangle", "Organic"];

  const updateFilter = (key: keyof FilterState, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared: FilterState = { stone: null, type: null, shape: null, search: "" };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = filters.stone || filters.type || filters.shape || filters.search;

  const FilterChip = ({ 
    label, 
    isActive, 
    onClick 
  }: { 
    label: string; 
    isActive: boolean; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-xs uppercase tracking-[0.1em] transition-all duration-300 border",
        isActive
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent text-foreground/70 border-foreground/15 hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder={isNL ? "Zoek op steen, vorm of type..." : "Search by stone, shape or type..."}
          className="w-full pl-11 pr-4 py-3 text-sm bg-transparent border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Filter groups */}
      <div className="flex flex-wrap items-start gap-8">
        {/* Stone filter */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {isNL ? "Steensoort" : "Stone type"}
          </span>
          <div className="flex flex-wrap gap-2">
            {stoneOptions.map((option) => (
              <FilterChip
                key={option}
                label={option}
                isActive={filters.stone === option}
                onClick={() => updateFilter("stone", filters.stone === option ? null : option)}
              />
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {isNL ? "Producttype" : "Product type"}
          </span>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((option) => (
              <FilterChip
                key={option}
                label={option}
                isActive={filters.type === option}
                onClick={() => updateFilter("type", filters.type === option ? null : option)}
              />
            ))}
          </div>
        </div>

        {/* Shape filter */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {isNL ? "Vorm" : "Shape"}
          </span>
          <div className="flex flex-wrap gap-2">
            {shapeOptions.map((option) => (
              <FilterChip
                key={option}
                label={option}
                isActive={filters.shape === option}
                onClick={() => updateFilter("shape", filters.shape === option ? null : option)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
          {isNL ? "Wis filters" : "Clear filters"}
        </button>
      )}
    </div>
  );
}
