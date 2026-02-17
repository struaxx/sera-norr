// ============================================
// Configurator Phase V3 - 9 Leg Styles, Rules-Driven
// ============================================

import { Suspense, lazy, useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useConfiguratorStore } from '@/stores/configurator-store';
import { resolveConfiguration, type ResolvedConfiguration } from '@/lib/configurator/engine/resolveConfiguration';
import {
  type RuleShape,
  type RuleLegStyle,
  type TestPreset,
  SHAPE_DEFINITIONS,
  LEG_DEFINITIONS,
  getValidLegStyles,
  isPedestalStyle,
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
    <div className="grid grid-cols-4 gap-2">
      {SHAPE_DEFINITIONS.filter(s => s.isActive !== false).map(s => (
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
// DIMENSION SLIDERS (continuous, mm-based)
// ============================================

// Ranges in mm, but step is 100mm (= 10cm) for clean round cm values
const DIM_RANGES: Record<string, { lengthMin: number; lengthMax: number; widthMin: number; widthMax: number }> = {
  round: { lengthMin: 800, lengthMax: 1800, widthMin: 800, widthMax: 1800 },
  _default: { lengthMin: 2000, lengthMax: 2600, widthMin: 600, widthMax: 1400 },
};

const HEIGHT_RANGE = { min: 720, max: 780, step: 10 }; // 72–78cm in 1cm steps

/** mm → display cm */
const toCm = (mm: number) => Math.round(mm / 10);

const snapValue = (v: number, step: number) => Math.round(v / step) * step;

function SliderRow({ label, value, min, max, snapStep, onChange }: {
  label: string; value: number; min: number; max: number; snapStep: number; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
        <span className="text-sm font-medium tabular-nums">{toCm(snapValue(value, snapStep))} cm</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([v]) => onChange(v)}
        onValueCommit={([v]) => onChange(snapValue(v, snapStep))}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
        <span>{toCm(min)} cm</span>
        <span>{toCm(max)} cm</span>
      </div>
    </div>
  );
}

function DimensionSlidersV3({
  shape,
  currentLength,
  currentWidth,
  currentHeight,
  onLengthChange,
  onWidthChange,
  onHeightChange,
  isNL,
}: {
  shape: RuleShape;
  currentLength: number;
  currentWidth: number;
  currentHeight: number;
  onLengthChange: (v: number) => void;
  onWidthChange: (v: number) => void;
  onHeightChange: (v: number) => void;
  isNL: boolean;
}) {
  const ranges = DIM_RANGES[shape] || DIM_RANGES._default;
  const isRound = shape === 'round';

  return (
    <div className="space-y-5">
      {isRound ? (
        <SliderRow
          label={isNL ? 'Diameter' : 'Diameter'}
          value={currentLength}
          min={ranges.lengthMin}
          max={ranges.lengthMax}
          snapStep={50}
          onChange={(v) => { onLengthChange(v); onWidthChange(v); }}
        />
      ) : (
        <>
          <SliderRow
            label={isNL ? 'Lengte' : 'Length'}
            value={currentLength}
            min={ranges.lengthMin}
            max={ranges.lengthMax}
            snapStep={50}
            onChange={onLengthChange}
          />
          <SliderRow
            label={isNL ? 'Breedte' : 'Width'}
            value={currentWidth}
            min={ranges.widthMin}
            max={ranges.widthMax}
            snapStep={50}
            onChange={onWidthChange}
          />
        </>
      )}
      <SliderRow
        label={isNL ? 'Hoogte' : 'Height'}
        value={currentHeight}
        min={HEIGHT_RANGE.min}
        max={HEIGHT_RANGE.max}
        snapStep={HEIGHT_RANGE.step}
        onChange={onHeightChange}
      />
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
// LEG STYLE SELECTOR (9 styles, 2 groups)
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

  // Filter out deactivated leg styles (quartet, rounded, etc.)
  const HIDDEN_LEGS: RuleLegStyle[] = ['quartet_legs', 'rounded_legs'];
  const pedestalStyles = LEG_DEFINITIONS.filter(l => l.category === 'pedestal' && !HIDDEN_LEGS.includes(l.id));
  const fixedStyles = LEG_DEFINITIONS.filter(l => l.category === 'fixed' && !HIDDEN_LEGS.includes(l.id));

  const hasPedestalOptions = pedestalStyles.some(l => validStyles.some(v => v.id === l.id));
  const hasFixedOptions = fixedStyles.some(l => validStyles.some(v => v.id === l.id));

  const renderLegButton = (leg: typeof LEG_DEFINITIONS[number]) => {
    const isValid = validStyles.some(v => v.id === leg.id);
    const isSelected = value === leg.id;

    if (!isValid) return null; // Hide invalid options

    return (
      <button
        key={leg.id}
        onClick={() => onChange(leg.id)}
        className={cn(
          "relative flex flex-col items-center p-4 rounded-sm border transition-all duration-200 text-center",
          isSelected
            ? "border-foreground bg-foreground/5"
            : "border-border hover:border-foreground/50"
        )}
      >
        <span className="text-xs font-medium">{isNL ? leg.labelNL : leg.label}</span>
        {leg.priceUplift > 0 && (
          <span className="text-[10px] text-muted-foreground mt-1">+€{leg.priceUplift}</span>
        )}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-background" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {hasPedestalOptions && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {isNL ? 'Pedestal (1 of 2)' : 'Pedestal (1 or 2)'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {pedestalStyles.map(renderLegButton)}
          </div>
        </div>
      )}
      {hasFixedOptions && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {isNL ? 'Vast' : 'Fixed'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {fixedStyles.map(renderLegButton)}
          </div>
        </div>
      )}
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
  const [legStyle, setLegStyle] = useState<RuleLegStyle>('cylindrical');
  const [stoneId, setStoneId] = useState('calacatta-viola');
  const [resolved, setResolved] = useState<ResolvedConfiguration | null>(null);

  const handleShapeChange = useCallback((newShape: RuleShape) => {
    setShape(newShape);
    // Set sensible defaults for the new shape
    if (newShape === 'round') {
      setLengthMm(1200);
      setWidthMm(1200);
    } else {
      // Keep current dims but clamp to valid ranges
      const ranges = DIM_RANGES[newShape] || DIM_RANGES._default;
      setLengthMm(prev => Math.max(ranges.lengthMin, Math.min(ranges.lengthMax, prev)));
      setWidthMm(prev => Math.max(ranges.widthMin, Math.min(ranges.widthMax, prev)));
    }
    const validLegs = getValidLegStyles(newShape, lengthMm);
    if (!validLegs.find(l => l.id === legStyle)) {
      const shapeDef = SHAPE_DEFINITIONS.find(s => s.id === newShape);
      setLegStyle(shapeDef?.defaultLegStyle ?? validLegs[0]?.id ?? 'cylindrical');
    }
  }, [legStyle, lengthMm]);

  const handleDimensionSelect = useCallback((l: number, w: number) => {
    setLengthMm(l);
    setWidthMm(w);
    const validLegs = getValidLegStyles(shape, l);
    if (!validLegs.find(leg => leg.id === legStyle)) {
      const shapeDef = SHAPE_DEFINITIONS.find(s => s.id === shape);
      setLegStyle(shapeDef?.defaultLegStyle ?? validLegs[0]?.id ?? 'cylindrical');
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
    const defaultLeg = shapeDef?.defaultLegStyle ?? 'cylindrical';
    if (validLegs.find(l => l.id === defaultLeg)) {
      setLegStyle(defaultLeg);
    } else {
      setLegStyle(validLegs[0]?.id ?? 'cylindrical');
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
            setLegStyle('cylindrical');
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
            <DimensionSlidersV3
              shape={shape}
              currentLength={lengthMm}
              currentWidth={widthMm}
              currentHeight={heightMm}
              onLengthChange={(v) => { setLengthMm(v); if (shape === 'round') setWidthMm(v); }}
              onWidthChange={setWidthMm}
              onHeightChange={setHeightMm}
              isNL={isNL}
            />
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

          {/* Spacer to prevent sticky summary from covering leg buttons */}
          <div className="h-32" />

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
                    {SHAPE_DEFINITIONS.find(s => s.id === shape)?.[isNL ? 'labelNL' : 'label']} – {toCm(lengthMm)}×{toCm(widthMm)} cm
                  </h4>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{resolved?.legDefinition?.[isNL ? 'labelNL' : 'label'] ?? legStyle}</span>
                <span>•</span>
                <span>{thicknessMm}mm blad • {toCm(heightMm)} cm hoog</span>
                <span>•</span>
                <span>{(() => {
                  const displayCount = resolved?.legStyle === 'hourglass' ? 2 : (resolved?.legCount ?? 0);
                  return `${displayCount || '?'} ${isNL ? (displayCount === 1 ? 'poot' : 'poten') : 'legs'}`;
                })()}</span>
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
