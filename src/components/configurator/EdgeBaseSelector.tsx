import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { EdgeProfile, BaseType, TableShape, ProductType } from '@/lib/configurator';
import { EDGE_PROFILES, BASES, isEdgeCompatible } from '@/lib/configurator';

interface EdgeProfileSelectorProps {
  value: EdgeProfile;
  shape: TableShape;
  onChange: (edge: EdgeProfile) => void;
  isNL?: boolean;
  className?: string;
}

export function EdgeProfileSelector({ value, shape, onChange, isNL = true, className }: EdgeProfileSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Randprofiel' : 'Edge Profile'}
      </label>
      
      <div className="grid grid-cols-2 gap-2">
        {EDGE_PROFILES.map((edge) => {
          const isSelected = value === edge.id;
          const isCompatible = isEdgeCompatible(edge.id, shape);
          
          return (
            <button
              key={edge.id}
              onClick={() => isCompatible && onChange(edge.id)}
              disabled={!isCompatible}
              className={cn(
                "relative flex items-center gap-3 p-3 rounded-sm border transition-all duration-200 text-left",
                isSelected 
                  ? "border-foreground bg-foreground/5" 
                  : isCompatible
                    ? "border-border hover:border-foreground/50"
                    : "border-border/50 opacity-40 cursor-not-allowed"
              )}
            >
              {/* Edge profile visual */}
              <div className="w-8 h-8 border border-border rounded flex items-center justify-center text-lg">
                {edge.icon}
              </div>
              
              <div className="flex-1">
                <span className="text-xs block">
                  {edge.name[isNL ? 'nl' : 'en']}
                </span>
              </div>

              {isSelected && (
                <div className="w-4 h-4 bg-foreground rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-background" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface BaseSelectorProps {
  value: BaseType;
  productType: ProductType;
  onChange: (base: BaseType) => void;
  isNL?: boolean;
  className?: string;
}

export function BaseSelector({ value, productType, onChange, isNL = true, className }: BaseSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Onderstel' : 'Base'}
      </label>
      
      <div className="space-y-2">
        {BASES.map((base) => {
          const isSelected = value === base.id;
          const isCompatible = base.compatibleProducts.includes(productType);
          
          return (
            <button
              key={base.id}
              onClick={() => isCompatible && onChange(base.id)}
              disabled={!isCompatible}
              className={cn(
                "relative w-full flex items-start gap-4 p-4 rounded-sm border transition-all duration-200 text-left",
                isSelected 
                  ? "border-foreground bg-foreground/5" 
                  : isCompatible
                    ? "border-border hover:border-foreground/50"
                    : "border-border/50 opacity-40 cursor-not-allowed"
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {base.name[isNL ? 'nl' : 'en']}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {base.description[isNL ? 'nl' : 'en']}
                </p>
              </div>

              {isSelected && (
                <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
