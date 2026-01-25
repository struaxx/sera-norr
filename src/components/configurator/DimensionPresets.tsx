// ============================================
// SERA NORR - Dimension Presets (Fixed Sizes)
// ============================================

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { TableShape } from '@/lib/configurator';

// Fixed dimension presets per shape
export interface DimensionPreset {
  id: string;
  label: string;
  length: number;
  width: number;
  radius?: number;
}

// ELLIPS presets
const ELLIPS_PRESETS: DimensionPreset[] = [
  { id: 'ellips-200x100', label: '200 × 100 cm', length: 200, width: 100 },
  { id: 'ellips-220x100', label: '220 × 100 cm', length: 220, width: 100 },
  { id: 'ellips-240x110', label: '240 × 110 cm', length: 240, width: 110 },
  { id: 'ellips-260x110', label: '260 × 110 cm', length: 260, width: 110 },
];

// OVALE presets
const OVALE_PRESETS: DimensionPreset[] = [
  { id: 'ovale-200x100', label: '200 × 100 cm', length: 200, width: 100 },
  { id: 'ovale-220x100', label: '220 × 100 cm', length: 220, width: 100 },
  { id: 'ovale-240x110', label: '240 × 110 cm', length: 240, width: 110 },
  { id: 'ovale-260x110', label: '260 × 110 cm', length: 260, width: 110 },
];

// ROUND presets (diameter = radius * 2)
const ROUND_PRESETS: DimensionPreset[] = [
  { id: 'round-120', label: 'Ø 120 cm', length: 120, width: 120, radius: 60 },
  { id: 'round-130', label: 'Ø 130 cm', length: 130, width: 130, radius: 65 },
  { id: 'round-150', label: 'Ø 150 cm', length: 150, width: 150, radius: 75 },
  { id: 'round-160', label: 'Ø 160 cm', length: 160, width: 160, radius: 80 },
];

// CORNER presets (rectangle with sharp corners)
const CORNER_PRESETS: DimensionPreset[] = [
  { id: 'corner-200x100', label: '200 × 100 cm', length: 200, width: 100 },
  { id: 'corner-220x100', label: '220 × 100 cm', length: 220, width: 100 },
  { id: 'corner-240x100', label: '240 × 100 cm', length: 240, width: 100 },
];

// CUT-CORNER presets (rectangle with chamfered corners)
const CUT_CORNER_PRESETS: DimensionPreset[] = [
  { id: 'cut-corner-200x100', label: '200 × 100 cm', length: 200, width: 100 },
  { id: 'cut-corner-220x100', label: '220 × 100 cm', length: 220, width: 100 },
  { id: 'cut-corner-240x100', label: '240 × 100 cm', length: 240, width: 100 },
];

export function getPresetsForShape(shape: TableShape): DimensionPreset[] {
  switch (shape) {
    case 'ellips':
      return ELLIPS_PRESETS;
    case 'ovale':
      return OVALE_PRESETS;
    case 'round':
      return ROUND_PRESETS;
    case 'corner':
      return CORNER_PRESETS;
    case 'cut-corner':
      return CUT_CORNER_PRESETS;
    default:
      return CORNER_PRESETS;
  }
}

// Thickness presets
export interface ThicknessPreset {
  id: string;
  value: number; // in cm (2 = 20mm, 3 = 30mm)
  label: string;
  labelEN: string;
  uplift: number; // price multiplier
}

export const THICKNESS_PRESETS: ThicknessPreset[] = [
  { id: 'thickness-20mm', value: 2, label: '20mm (standaard)', labelEN: '20mm (standard)', uplift: 1.0 },
  { id: 'thickness-30mm', value: 3, label: '30mm', labelEN: '30mm', uplift: 1.25 },
];

// ============================================
// Dimension Presets Selector Component
// ============================================

interface DimensionPresetsProps {
  shape: TableShape;
  currentLength: number;
  currentWidth: number;
  currentRadius?: number;
  onSelect: (preset: DimensionPreset) => void;
  isNL?: boolean;
  className?: string;
}

export function DimensionPresets({
  shape,
  currentLength,
  currentWidth,
  currentRadius,
  onSelect,
  isNL = true,
  className,
}: DimensionPresetsProps) {
  const presets = getPresetsForShape(shape);
  const isRound = shape === 'round';

  const isSelected = (preset: DimensionPreset) => {
    if (isRound && preset.radius) {
      return currentRadius === preset.radius;
    }
    return currentLength === preset.length && currentWidth === preset.width;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Afmeting' : 'Size'}
      </label>

      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const selected = isSelected(preset);
          
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={cn(
                "relative flex items-center justify-center py-3 px-4 rounded-sm border transition-all duration-200 text-center",
                selected
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/50"
              )}
            >
              <span className="text-sm font-medium tabular-nums">
                {preset.label}
              </span>
              
              {selected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-foreground rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-background" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground">
        {isNL 
          ? 'Afwijkende maten op aanvraag' 
          : 'Custom sizes available on request'
        }
      </p>
    </div>
  );
}

// ============================================
// Thickness Selector Component
// ============================================

interface ThicknessSelectorProps {
  value: number;
  onChange: (thickness: number) => void;
  isNL?: boolean;
  className?: string;
}

export function ThicknessSelector({
  value,
  onChange,
  isNL = true,
  className,
}: ThicknessSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Bladdikte' : 'Thickness'}
      </label>

      <div className="grid grid-cols-2 gap-2">
        {THICKNESS_PRESETS.map((preset) => {
          const selected = value === preset.value;
          
          return (
            <button
              key={preset.id}
              onClick={() => onChange(preset.value)}
              className={cn(
                "relative flex items-center justify-center py-3 px-4 rounded-sm border transition-all duration-200 text-center",
                selected
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/50"
              )}
            >
              <span className="text-sm font-medium">
                {isNL ? preset.label : preset.labelEN}
              </span>
              
              {selected && (
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
