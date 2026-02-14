// ============================================
// Configurator Phase V3 - Geometry-First, Rules-Driven
// ============================================

import { Suspense, lazy, useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConfiguratorStore } from '@/stores/configurator-store';
import { resolveConfiguration, type ResolvedConfiguration } from '@/lib/configurator/engine/resolveConfiguration';
import {
  type RuleShape,
  type RuleLegStyle,
  type TestPreset,
  SHAPE_DEFINITIONS,
  LEG_DEFINITIONS,
  getValidLegStyles,
} from '@/lib/configurator/rules/productRules';

const ConfiguratorViewerV3 = lazy(() =>
  import('@/components/configurator/ConfiguratorViewerV3').then(m => ({ default: m.ConfiguratorViewerV3 }))
);

interface ConfiguratorPhaseProps {
  onBack: () => void;
  onContinue: () => void;
  isNL?: boolean;
}

function ViewerSkeleton() {
  return (
    <div className="w-full aspect-square bg-secondary/10 rounded-sm flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">3D laden...</p>
      </div>
    </div>
  );
}

// ============================================
// SHAPE SELECTOR (5 shapes)
// ============================================

function ShapeSelectorV3({
  value,
  onChange,
  isNL,
}: {
  value: RuleShape;
  onChange: (s: RuleShape) => void;
  isNL: boolean;
}) {
  const ShapeIcon = ({ shape }: { shape: RuleShape }) => {
    switch (shape) {
      case 'round':
        return <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>;
      case 'ellips':
        return <svg viewBox="0 0 36 24" className="w-7 h-7" fill="currentColor"><ellipse cx="18" cy="12" rx="16" ry="10" /></svg>;
      case 'ovale':
        return <svg viewBox="0 0 36 24" className="w-7 h-7" fill="currentColor"><rect x="1" y="2" width="34" height="20" rx="10" /></svg>;
      case 'corner':
        return <svg viewBox="0 0 36 24" className="w-7 h-7" fill="currentColor"><rect x="1" y="2" width="34" height="20" rx="3" /></svg>;
      case 'cut-corner':
        return (
          <svg viewBox="0 0 36 24" className="w-7 h-7" fill="currentColor">
            <polygon points="5,2 31,2 35,6 35,18 31,22 5,22 1,18 1,6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {SHAPE_DEFINITIONS.map(s => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={cn(
            "relative flex flex-col items-center gap-2 p-3 rounded-sm border transition-all duration-200",
            value === s.id
              ? "border-foreground bg-foreground/5"
              : "border-border hover:border-foreground/50"
          )}
        >
          <ShapeIcon shape={s.id} />
          <span className="text-[9px] uppercase tracking-wider leading-tight text-center">
            {isNL ? s.labelNL : s.label}
          </span>
          {value === s.id && (
            <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-foreground rounded-full flex items-center justify-center">
              <Check className="w-2 h-2 text-background" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================
// DIMENSION PRESETS (mm-based)
// ============================================

interface DimPreset {
  id: string;
  label: string;
  lengthMm: number;
  widthMm: number;
}

const DIM_PRESETS: Record<RuleShape, DimPreset[]> = {
  ellips: [
    { id: 'e-1800', label: '1800 × 900', lengthMm: 1800, widthMm: 900 },
    { id: 'e-2000', label: '2000 × 1000', lengthMm: 2000, widthMm: 1000 },
    { id: 'e-2200', label: '2200 × 1100', lengthMm: 2200, widthMm: 1100 },
    { id: 'e-2600', label: '2600 × 1100', lengthMm: 2600, widthMm: 1100 },
  ],
  round: [
    { id: 'r-1000', label: 'Ø 1000', lengthMm: 1000, widthMm: 1000 },
    { id: 'r-1200', label: 'Ø 1200', lengthMm: 1200, widthMm: 1200 },
    { id: 'r-1500', label: 'Ø 1500', lengthMm: 1500, widthMm: 1500 },
    { id: 'r-1600', label: 'Ø 1600', lengthMm: 1600, widthMm: 1600 },
  ],
  ovale: [
    { id: 'ov-2000', label: '2000 × 1000', lengthMm: 2000, widthMm: 1000 },
    { id: 'ov-2200', label: '2200 × 1100', lengthMm: 2200, widthMm: 1100 },
    { id: 'ov-2400', label: '2400 × 1100', lengthMm: 2400, widthMm: 1100 },
  ],
  corner: [
    { id: 'co-2000', label: '2000 × 1000', lengthMm: 2000, widthMm: 1000 },
    { id: 'co-2200', label: '2200 × 1000', lengthMm: 2200, widthMm: 1000 },
    { id: 'co-2400', label: '2400 × 1000', lengthMm: 2400, widthMm: 1000 },
  ],
  'cut-corner': [
    { id: 'cc-2000', label: '2000 × 1000', lengthMm: 2000, widthMm: 1000 },
    { id: 'cc-2200', label: '2200 × 1000', lengthMm: 2200, widthMm: 1000 },
    { id: 'cc-2400', label: '2400 × 1000', lengthMm: 2400, widthMm: 1000 },
  ],
};

function DimensionPresetsV3({
  shape,
  currentLength,
  currentWidth,
  onSelect,
}: {
  shape: RuleShape;
  currentLength: number;
  currentWidth: number;
  onSelect: (l: number, w: number) => void;
}) {
  const presets = DIM_PRESETS[shape] || [];

  return (
    <div className="grid grid-cols-2 gap-2">
      {presets.map(p => {
        const selected = p.lengthMm === currentLength && p.widthMm === currentWidth;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.lengthMm, p.widthMm)}
            className={cn(
              "relative flex items-center justify-center py-3 px-4 rounded-sm border transition-all duration-200 text-center",
              selected ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"
            )}
          >
            <span className="text-sm font-medium tabular-nums">{p.label}mm</span>
            {selected && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-foreground rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-background" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// THICKNESS SELECTOR (mm)
// ============================================

function ThicknessSelectorV3({
  value,
  onChange,
  isNL,
}: {
  value: number;
  onChange: (v: number) => void;
  isNL: boolean;
}) {
  const options = [
    { value: 20, label: '20mm', labelDetail: isNL ? '(standaard)' : '(standard)' },
    { value: 30, label: '30mm', labelDetail: '' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(o => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative flex items-center justify-center py-3 px-4 rounded-sm border transition-all duration-200 text-center",
              selected ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"
            )}
          >
            <span className="text-sm font-medium">{o.label} {o.labelDetail}</span>
            {selected && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-foreground rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-background" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// LEG STYLE SELECTOR (4 styles, auto count)
// ============================================

function LegSelectorV3({
  value,
  shape,
  lengthMm,
  onChange,
  isNL,
}: {
  value: RuleLegStyle;
  shape: RuleShape;
  lengthMm: number;
  onChange: (l: RuleLegStyle) => void;
  isNL: boolean;
}) {
  const validStyles = useMemo(() => getValidLegStyles(shape, lengthMm), [shape, lengthMm]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {LEG_DEFINITIONS.map(leg => {
          const isValid = validStyles.some(v => v.id === leg.id);
          const isSelected = value === leg.id;

          return (
            <button
              key={leg.id}
              onClick={() => isValid && onChange(leg.id)}
              disabled={!isValid}
              className={cn(
                "relative flex flex-col items-center p-4 rounded-sm border transition-all duration-200 text-center",
                isSelected
                  ? "border-foreground bg-foreground/5"
                  : isValid
                    ? "border-border hover:border-foreground/50"
                    : "border-border/50 opacity-40 cursor-not-allowed"
              )}
            >
              <span className="text-xs font-medium">{isNL ? leg.labelNL : leg.label}</span>
              {leg.priceUplift > 0 && isValid && (
                <span className="text-[10px] text-muted-foreground mt-1">+€{leg.priceUplift}</span>
              )}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-background" />
                </div>
              )}
              {!isValid && (
                <span className="text-[8px] text-muted-foreground mt-1">{isNL ? 'Niet beschikbaar' : 'Not available'}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// CONFIG PANEL WRAPPER
// ============================================

function ConfigPanel({
  title,
  step,
  children,
}: {
  title: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: step * 0.03 }}
      className="bg-background border border-border rounded-sm p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-secondary text-xs flex items-center justify-center">{step}</span>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// ============================================
// MAIN CONFIGURATOR PHASE
// ============================================

export function ConfiguratorPhase({ onBack, onContinue, isNL = true }: ConfiguratorPhaseProps) {
  const { config, resetConfig } = useConfiguratorStore();

  const [shape, setShape] = useState<RuleShape>('ellips');
  const [lengthMm, setLengthMm] = useState(2000);
  const [widthMm, setWidthMm] = useState(1000);
  const [heightMm, setHeightMm] = useState(750);
  const [thicknessMm, setThicknessMm] = useState(20);
  const [legStyle, setLegStyle] = useState<RuleLegStyle>('pedestal');
  const [stoneId, setStoneId] = useState('calacatta-viola');
  const [resolved, setResolved] = useState<ResolvedConfiguration | null>(null);

  const handleShapeChange = useCallback((newShape: RuleShape) => {
    setShape(newShape);
    const presets = DIM_PRESETS[newShape];
    if (presets?.[0]) {
      setLengthMm(presets[0].lengthMm);
      setWidthMm(presets[0].widthMm);
    }
    const validLegs = getValidLegStyles(newShape, presets?.[0]?.lengthMm ?? lengthMm);
    if (!validLegs.find(l => l.id === legStyle)) {
      const shapeDef = SHAPE_DEFINITIONS.find(s => s.id === newShape);
      setLegStyle(shapeDef?.defaultLegStyle ?? validLegs[0]?.id ?? 'pedestal');
    }
  }, [legStyle, lengthMm]);

  const handleDimensionSelect = useCallback((l: number, w: number) => {
    setLengthMm(l);
    setWidthMm(w);
    const validLegs = getValidLegStyles(shape, l);
    if (!validLegs.find(leg => leg.id === legStyle)) {
      const shapeDef = SHAPE_DEFINITIONS.find(s => s.id === shape);
      setLegStyle(shapeDef?.defaultLegStyle ?? validLegs[0]?.id ?? 'pedestal');
    }
  }, [shape, legStyle]);

  const handlePresetLoad = useCallback((preset: TestPreset) => {
    setShape(preset.shape);
    setLengthMm(preset.lengthMm);
    setWidthMm(preset.widthMm);
    setHeightMm(preset.heightMm);
    setThicknessMm(preset.thicknessMm);
    const validLegs = getValidLegStyles(preset.shape, preset.lengthMm);
    const shapeDef = SHAPE_DEFINITIONS.find(s => s.id === preset.shape);
    const defaultLeg = shapeDef?.defaultLegStyle ?? 'pedestal';
    if (validLegs.find(l => l.id === defaultLeg)) {
      setLegStyle(defaultLeg);
    } else {
      setLegStyle(validLegs[0]?.id ?? 'pedestal');
    }
  }, []);

  const handleConfigResolved = useCallback((r: ResolvedConfiguration) => {
    setResolved(r);
    if (r.wasAutoSwitched && r.legStyle !== legStyle) {
      setLegStyle(r.legStyle);
    }
  }, [legStyle]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
            {isNL ? 'Stap 1 van 2' : 'Step 1 of 2'}
          </span>
          <h1 className="text-2xl md:text-3xl font-serif">
            {isNL ? 'Stel uw stuk samen' : 'Design your piece'}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            resetConfig();
            setShape('ellips');
            setLengthMm(2000);
            setWidthMm(1000);
            setHeightMm(750);
            setThicknessMm(20);
            setLegStyle('pedestal');
          }}
          className="text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </motion.div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left - 3D Viewer */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-24"
          >
            <Suspense fallback={<ViewerSkeleton />}>
              <ConfiguratorViewerV3
                shape={shape}
                lengthMm={lengthMm}
                widthMm={widthMm}
                heightMm={heightMm}
                thicknessMm={thicknessMm}
                legStyle={legStyle}
                stoneId={stoneId}
                onConfigResolved={handleConfigResolved}
                onPresetLoad={handlePresetLoad}
                isNL={isNL}
              />
            </Suspense>

            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span>{isNL ? 'Handgemaakt op bestelling' : 'Handmade to order'}</span>
              <span>•</span>
              <span>{isNL ? 'Ontworpen in NL' : 'Designed in NL'}</span>
              <span>•</span>
              <span>{isNL ? '2 jaar garantie' : '2-year warranty'}</span>
            </div>
          </motion.div>
        </div>

        {/* Right - Config Panels */}
        <div className="lg:col-span-5 space-y-5">
          <ConfigPanel title={isNL ? 'Vorm' : 'Shape'} step={1}>
            <ShapeSelectorV3 value={shape} onChange={handleShapeChange} isNL={isNL} />
          </ConfigPanel>

          <ConfigPanel title={isNL ? 'Afmeting' : 'Size'} step={2}>
            <DimensionPresetsV3
              shape={shape}
              currentLength={lengthMm}
              currentWidth={widthMm}
              onSelect={handleDimensionSelect}
            />
            <p className="text-[10px] text-muted-foreground mt-2">
              {isNL ? 'Alle maten in millimeters' : 'All dimensions in millimeters'}
            </p>
          </ConfigPanel>

          <ConfigPanel title={isNL ? 'Bladdikte' : 'Thickness'} step={3}>
            <ThicknessSelectorV3 value={thicknessMm} onChange={setThicknessMm} isNL={isNL} />
          </ConfigPanel>

          <ConfigPanel title={isNL ? 'Onderstel' : 'Base'} step={4}>
            <LegSelectorV3
              value={legStyle}
              shape={shape}
              lengthMm={lengthMm}
              onChange={setLegStyle}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-4 bg-background border border-foreground/20 rounded-sm p-5 shadow-lg"
          >
            <div className="space-y-3 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{isNL ? 'Uw selectie' : 'Your selection'}</p>
                  <h4 className="text-sm font-medium">
                    {SHAPE_DEFINITIONS.find(s => s.id === shape)?.[isNL ? 'labelNL' : 'label']} – {lengthMm}×{widthMm}mm
                  </h4>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{resolved?.legDefinition?.[isNL ? 'labelNL' : 'label'] ?? legStyle}</span>
                <span>•</span>
                <span>{thicknessMm}mm blad</span>
                <span>•</span>
                <span>{resolved?.legCount ?? '?'} {isNL ? 'poten' : 'legs'}</span>
              </div>
            </div>

            <Button variant="atelier" className="w-full" onClick={onContinue}>
              {isNL ? 'Vraag voorstel aan' : 'Request proposal'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-border">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isNL ? 'Reset ontwerp' : 'Reset design'}
        </Button>
        <Button variant="atelier" onClick={onContinue}>
          {isNL ? 'Bekijk dossier' : 'View dossier'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
