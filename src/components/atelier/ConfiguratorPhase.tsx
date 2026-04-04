// ============================================
// Configurator Phase V3 - 9 Leg Styles, Rules-Driven
// ============================================

import { Suspense, lazy, useMemo, useCallback, useState } from 'react';
import { getStonesByFamily, type StoneLibraryEntry } from '@/lib/configurator/stone-library';
import { getSwatchTexture, hasTexture } from '@/lib/configurator/texture-resolver';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RotateCcw, Check, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { EDGE_PROFILES } from '@/lib/configurator/config';
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
    { value: 36, label: '36mm', labelDetail: '' },
    { value: 40, label: '40mm', labelDetail: '' },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
// MATERIAL SELECTOR V3
// ============================================

function MaterialSelectorV3({
  value,
  onChange,
  customValue,
  onCustomChange,
  isNL,
}: {
  value: string;
  onChange: (id: string) => void;
  customValue: string;
  onCustomChange: (v: string) => void;
  isNL: boolean;
}) {
  const allStones = useMemo(() => {
    return [...getStonesByFamily('travertine'), ...getStonesByFamily('marble')];
  }, []);

  const isCustomSelected = value === 'custom';

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground italic border-l-2 border-border pl-3">
        {isNL
          ? 'Elke steen is uniek. Definitieve selectie gebeurt op slab-niveau.'
          : 'Every stone is unique. Final selection happens at slab level.'}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {allStones.map((stone) => {
          const textureUrl = getSwatchTexture(stone.id);
          const showTexture = hasTexture(stone.id);
          const isSelected = value === stone.id;

          return (
            <button
              key={stone.id}
              onClick={() => { onChange(stone.id); onCustomChange(''); }}
              className={cn(
                "relative rounded-sm border transition-all duration-200 text-left group overflow-hidden",
                isSelected
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border hover:border-foreground/50"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 text-background" />
                </div>
              )}
              <div
                className="aspect-square w-full"
                style={{ backgroundColor: stone.swatchColor }}
              >
                {showTexture && (
                  <img
                    src={textureUrl}
                    alt={stone.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium line-clamp-1">{stone.name}</h4>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  {stone.family === 'travertine' ? (isNL ? 'Travertijn' : 'Travertine') : (isNL ? 'Marmer' : 'Marble')}
                </p>
              </div>
            </button>
          );
        })}

        {/* Anders / op aanvraag card */}
        <button
          onClick={() => onChange('custom')}
          className={cn(
            "relative rounded-sm border transition-all duration-200 text-left group overflow-hidden",
            isCustomSelected
              ? "border-foreground ring-1 ring-foreground"
              : "border-border hover:border-foreground/50"
          )}
        >
          {isCustomSelected && (
            <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-md">
              <Check className="w-3.5 h-3.5 text-background" />
            </div>
          )}
          <div className="aspect-square w-full bg-secondary/50 flex items-center justify-center">
            <div className="text-center px-4">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {isNL ? 'Beschrijf uw wens' : 'Describe your preference'}
              </p>
            </div>
          </div>
          <div className="p-3">
            <h4 className="text-sm font-medium line-clamp-1">
              {isNL ? 'Anders' : 'Other'}
            </h4>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              {isNL ? 'Op aanvraag' : 'On request'}
            </p>
          </div>
        </button>
      </div>

      {/* Custom text input when selected */}
      {isCustomSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <textarea
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder={isNL ? 'Bijv. Statuario Extra, Azul Bahia, of beschrijf uw gewenste steen...' : 'E.g. Statuario Extra, Azul Bahia, or describe your desired stone...'}
            className="w-full text-sm bg-secondary/50 border border-border rounded-sm p-3 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/30 placeholder:text-muted-foreground/60"
            rows={2}
            autoFocus
          />
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// EDGE PROFILE SELECTOR V3
// ============================================

function EdgeSelectorV3({
  value,
  onChange,
  isNL,
}: {
  value: string;
  onChange: (id: string) => void;
  isNL: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {EDGE_PROFILES.map((edge) => {
        const isSelected = value === edge.id;
        return (
          <button
            key={edge.id}
            onClick={() => onChange(edge.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-sm border transition-all duration-200 text-left",
              isSelected
                ? "border-foreground bg-foreground/5"
                : "border-border hover:border-foreground/50"
            )}
          >
            <span className="text-lg leading-none">{edge.icon}</span>
            <span className="text-sm font-medium">{isNL ? edge.name.nl : edge.name.en}</span>
            {isSelected && (
              <Check className="w-3.5 h-3.5 ml-auto text-foreground" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// "ANDERS" (OTHER) OPTION COMPONENT
// ============================================

function CustomRequestToggle({
  label,
  value,
  onChange,
  isNL,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  isNL: boolean;
}) {
  const [isOpen, setIsOpen] = useState(value.length > 0);
  const isActive = isOpen || value.length > 0;

  return (
    <div className="mt-4 pt-4 border-t border-border/60">
      <button
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (!next) onChange('');
        }}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all duration-200",
          isActive
            ? "border-foreground/30 bg-foreground/5 text-foreground"
            : "border-dashed border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground"
        )}
      >
        <MessageSquare className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1 text-left">
          <span className="text-xs font-medium">{label || (isNL ? 'Anders / op aanvraag' : 'Other / on request')}</span>
          {!isActive && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {isNL ? 'Heeft u iets anders in gedachten? Laat het ons weten.' : 'Have something else in mind? Let us know.'}
            </p>
          )}
        </div>
        {value && <Check className="w-4 h-4 text-foreground flex-shrink-0" />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3"
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isNL ? 'Beschrijf uw wens...' : 'Describe your preference...'}
            className="w-full text-sm bg-secondary/50 border border-border rounded-sm p-3 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/30 placeholder:text-muted-foreground/60"
            rows={2}
            autoFocus
          />
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// MAIN CONFIGURATOR PHASE
// ============================================

export function ConfiguratorPhase({ onBack, onContinue, isNL = true }: ConfiguratorPhaseProps) {
  const { config, resetConfig, setShape: setStoreShape, setDimension, setStone, setEdgeProfile: setStoreEdge, setLegStyle: setStoreLegStyle, setCustomRequests } = useConfiguratorStore();

  const [shape, setShape] = useState<RuleShape>('ellips');
  const [lengthMm, setLengthMm] = useState(2000);
  const [widthMm, setWidthMm] = useState(1000);
  const [heightMm, setHeightMm] = useState(750);
  const [thicknessMm, setThicknessMm] = useState(20);
  const [legStyle, setLegStyle] = useState<RuleLegStyle>('cylindrical');
  const [stoneId, setStoneId] = useState('calacatta-viola');
  const [edgeProfile, setEdgeProfile] = useState('straight');
  const [resolved, setResolved] = useState<ResolvedConfiguration | null>(null);

  // Custom request fields per step
  const [customShape, setCustomShape] = useState('');
  const [customDimension, setCustomDimension] = useState('');
  const [customThickness, setCustomThickness] = useState('');
  const [customLeg, setCustomLeg] = useState('');
  const [customEdge, setCustomEdge] = useState('');
  const [customStone, setCustomStone] = useState('');

  // Sync all local state to Zustand store before transitioning to dossier
  const syncToStore = useCallback(() => {
    setStoreShape(shape as any);
    setDimension('length', toCm(lengthMm));
    setDimension('width', toCm(widthMm));
    setDimension('height', toCm(heightMm));
    setDimension('thickness', thicknessMm / 10);
    setStone(stoneId as any);
    setStoreEdge(edgeProfile as any);
    setStoreLegStyle(legStyle);
    // Store custom requests
    const requests: Record<string, string> = {};
    if (customShape) requests.shape = customShape;
    if (customDimension) requests.dimension = customDimension;
    if (customThickness) requests.thickness = customThickness;
    if (customLeg) requests.leg = customLeg;
    if (customEdge) requests.edge = customEdge;
    if (customStone) requests.stone = customStone;
    setCustomRequests(requests);
  }, [shape, lengthMm, widthMm, heightMm, thicknessMm, stoneId, edgeProfile, legStyle, customShape, customDimension, customThickness, customLeg, customEdge, customStone, setStoreShape, setDimension, setStone, setStoreEdge, setStoreLegStyle, setCustomRequests]);

  const handleShapeChange = useCallback((newShape: RuleShape) => {
    setShape(newShape);
    setCustomShape('');
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
    <div className="space-y-8 overflow-x-hidden">
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
          {/* 3D Viewer - independently sticky */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="aspect-[4/3] w-full">
                <Suspense fallback={<ViewerSkeleton />}>
                  <ConfiguratorViewerV3
                    shape={shape}
                    lengthMm={lengthMm}
                    widthMm={widthMm}
                    heightMm={heightMm}
                    thicknessMm={thicknessMm}
                    legStyle={legStyle}
                    stoneId={stoneId}
                    edgeProfile={edgeProfile}
                    onConfigResolved={handleConfigResolved}
                    onPresetLoad={handlePresetLoad}
                    isNL={isNL}
                  />
                </Suspense>
              </div>
            </motion.div>
          </div>

          {/* Selection summary + CTA - scrolls naturally */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border border-foreground/20 rounded-sm p-4"
          >
            <div className="space-y-2 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{isNL ? 'Uw selectie' : 'Your selection'}</p>
                <h4 className="text-sm font-medium">
                  {SHAPE_DEFINITIONS.find(s => s.id === shape)?.[isNL ? 'labelNL' : 'label']} – {toCm(lengthMm)}×{toCm(widthMm)} cm
                </h4>
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

            <Button variant="atelier" className="w-full" onClick={() => {
              syncToStore();
              onContinue();
            }}>
              {isNL ? 'Vraag voorstel aan' : 'Request proposal'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span>{isNL ? 'Handgemaakt op bestelling' : 'Handmade to order'}</span>
            <span>•</span>
            <span>{isNL ? 'Ontworpen in NL' : 'Designed in NL'}</span>
            <span>•</span>
            <span>{isNL ? '2 jaar garantie' : '2-year warranty'}</span>
          </div>
        </div>

        {/* Right - Config Panels */}
        <div className="lg:col-span-5 space-y-5">
          <ConfigPanel title={isNL ? 'Vorm' : 'Shape'} step={1}>
            <ShapeSelectorV3 value={shape} onChange={handleShapeChange} isNL={isNL} />
            <CustomRequestToggle value={customShape} onChange={setCustomShape} isNL={isNL} />
          </ConfigPanel>

          <ConfigPanel title={isNL ? 'Afmeting' : 'Size'} step={2}>
            <DimensionSlidersV3
              shape={shape}
              currentLength={lengthMm}
              currentWidth={widthMm}
              currentHeight={heightMm}
              onLengthChange={(v) => { setLengthMm(v); setCustomDimension(''); if (shape === 'round') setWidthMm(v); }}
              onWidthChange={(v) => { setWidthMm(v); setCustomDimension(''); }}
              onHeightChange={(v) => { setHeightMm(v); setCustomDimension(''); }}
              isNL={isNL}
            />
            <CustomRequestToggle value={customDimension} onChange={setCustomDimension} isNL={isNL} label={isNL ? 'Andere afmeting gewenst' : 'Different size needed'} />
          </ConfigPanel>

          <ConfigPanel title={isNL ? 'Bladdikte' : 'Thickness'} step={3}>
            <ThicknessSelectorV3 value={thicknessMm} onChange={(v) => { setThicknessMm(v); setCustomThickness(''); }} isNL={isNL} />
            <CustomRequestToggle value={customThickness} onChange={setCustomThickness} isNL={isNL} />
          </ConfigPanel>

          <ConfigPanel title={isNL ? 'Onderstel' : 'Base'} step={4}>
            <LegSelectorV3
              value={legStyle}
              shape={shape}
              lengthMm={lengthMm}
              onChange={(v) => { setLegStyle(v); setCustomLeg(''); }}
              isNL={isNL}
            />
            <CustomRequestToggle value={customLeg} onChange={setCustomLeg} isNL={isNL} />
          </ConfigPanel>

          <ConfigPanel title={isNL ? 'Materiaal' : 'Material'} step={5}>
            <MaterialSelectorV3 value={stoneId} onChange={setStoneId} customValue={customStone} onCustomChange={setCustomStone} isNL={isNL} />
          </ConfigPanel>

          <ConfigPanel title={isNL ? 'Randafwerking' : 'Edge profile'} step={6}>
            <EdgeSelectorV3 value={edgeProfile} onChange={(v) => { setEdgeProfile(v); setCustomEdge(''); }} isNL={isNL} />
            <CustomRequestToggle value={customEdge} onChange={setCustomEdge} isNL={isNL} />
          </ConfigPanel>

        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pt-8 border-t border-border">
        <Button variant="ghost" onClick={onBack} className="shrink-0 min-w-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{isNL ? 'Reset ontwerp' : 'Reset design'}</span>
          <span className="sm:hidden">Reset</span>
        </Button>
        <Button variant="atelier" onClick={() => {
          syncToStore();
          onContinue();
        }} className="shrink-0 min-w-0">
          <span className="hidden sm:inline">{isNL ? 'Bekijk dossier' : 'View dossier'}</span>
          <span className="sm:hidden">Dossier</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
