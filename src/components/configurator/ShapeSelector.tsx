import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { TableShape, ProductType } from '@/lib/configurator';
import { SHAPES, PRODUCT_TYPES, isShapeCompatible } from '@/lib/configurator';

interface ShapeSelectorProps {
  value: TableShape;
  productType: ProductType;
  onChange: (shape: TableShape) => void;
  isNL?: boolean;
  className?: string;
}

export function ShapeSelector({ value, productType, onChange, isNL = true, className }: ShapeSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Vorm' : 'Shape'}
      </label>
      <div className="grid grid-cols-4 gap-2">
        {SHAPES.map((shape) => {
          const isCompatible = isShapeCompatible(shape.id, productType);
          const isSelected = value === shape.id;
          
          return (
            <button
              key={shape.id}
              onClick={() => isCompatible && onChange(shape.id)}
              disabled={!isCompatible}
              className={cn(
                "relative flex flex-col items-center gap-2 p-3 rounded-sm border transition-all duration-200",
                isSelected 
                  ? "border-foreground bg-foreground/5" 
                  : isCompatible
                    ? "border-border hover:border-foreground/50"
                    : "border-border/50 opacity-40 cursor-not-allowed"
              )}
            >
              <span className="text-xl">{shape.icon}</span>
              <span className="text-[10px] uppercase tracking-wider">
                {shape.name[isNL ? 'nl' : 'en']}
              </span>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-foreground rounded-full flex items-center justify-center">
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

interface ProductTypeSelectorProps {
  value: ProductType;
  onChange: (type: ProductType) => void;
  isNL?: boolean;
  className?: string;
}

export function ProductTypeSelector({ value, onChange, isNL = true, className }: ProductTypeSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Type meubel' : 'Furniture type'}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PRODUCT_TYPES.map((type) => {
          const isSelected = value === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={cn(
                "relative flex items-center gap-3 p-3 rounded-sm border transition-all duration-200 text-left",
                isSelected 
                  ? "border-foreground bg-foreground/5" 
                  : "border-border hover:border-foreground/50"
              )}
            >
              <span className="text-lg flex-shrink-0">{type.icon}</span>
              <span className="text-xs">
                {type.name[isNL ? 'nl' : 'en']}
              </span>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-foreground rounded-full flex items-center justify-center">
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
