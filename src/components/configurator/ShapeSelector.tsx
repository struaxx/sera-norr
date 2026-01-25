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

// Custom SVG icons for each shape - matching silhouettes
const ShapeIcon = ({ shape, className }: { shape: TableShape; className?: string }) => {
  const iconClasses = cn("w-8 h-8", className);
  
  switch (shape) {
    case 'ellips':
      // Soft ellipse - more horizontal stretch
      return (
        <svg viewBox="0 0 40 24" className={iconClasses} fill="currentColor">
          <ellipse cx="20" cy="12" rx="18" ry="10" />
        </svg>
      );
    case 'ovale':
      // Classic oval - balanced proportion
      return (
        <svg viewBox="0 0 36 24" className={iconClasses} fill="currentColor">
          <ellipse cx="18" cy="12" rx="16" ry="11" />
        </svg>
      );
    case 'round':
      // Perfect circle
      return (
        <svg viewBox="0 0 24 24" className={iconClasses} fill="currentColor">
          <circle cx="12" cy="12" r="11" />
        </svg>
      );
    case 'corner':
      // Sharp rectangle
      return (
        <svg viewBox="0 0 36 24" className={iconClasses} fill="currentColor">
          <rect x="1" y="2" width="34" height="20" rx="1" />
        </svg>
      );
    case 'cut-corner':
      // Rectangle with chamfered corners
      return (
        <svg viewBox="0 0 36 24" className={iconClasses} fill="currentColor">
          <polygon points="5,2 31,2 35,6 35,18 31,22 5,22 1,18 1,6" />
        </svg>
      );
    default:
      return null;
  }
};

export function ShapeSelector({ value, productType, onChange, isNL = true, className }: ShapeSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Vorm' : 'Shape'}
      </label>
      <div className="grid grid-cols-5 gap-2">
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
              title={shape.description?.[isNL ? 'nl' : 'en']}
            >
              <ShapeIcon shape={shape.id} className="text-foreground/80" />
              <span className="text-[9px] uppercase tracking-wider leading-tight text-center">
                {shape.name[isNL ? 'nl' : 'en']}
              </span>
              {isSelected && (
                <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-foreground rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-background" />
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