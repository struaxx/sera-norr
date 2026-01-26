// ============================================
// Configurator Phase - 3D Builder (Sales-Ready V2)
// ============================================

import { Suspense, lazy, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfiguratorStore } from '@/stores/configurator-store';
import { ShapeSelector } from '@/components/configurator/ShapeSelector';
import { DimensionPresets, ThicknessSelector, type DimensionPreset } from '@/components/configurator/DimensionPresets';
import { StoneSelectorV2, FinishSelector } from '@/components/configurator/StoneSelectorV2';
import { EdgeProfileSelector } from '@/components/configurator/EdgeBaseSelector';
import { LegSelector } from '@/components/configurator/LegSelector';
import { StickyDossier } from '@/components/configurator/StickyDossier';
import {
  shouldUseFallback, 
  getFallbackPreview,
} from '@/lib/configurator';
import { calculateModularPrice } from '@/lib/configurator/pricing-v2';

// Lazy load 3D viewer
const ConfiguratorViewer = lazy(() => 
  import('@/components/configurator/ConfiguratorViewer').then(m => ({ default: m.ConfiguratorViewer }))
);

interface ConfiguratorPhaseProps {
  onBack: () => void;
  onContinue: () => void;
  isNL?: boolean;
}

// Fallback static preview for low-end devices
function FallbackPreview({ productType, shape, stone }: { productType: string; shape: string; stone: string }) {
  const imagePath = getFallbackPreview(productType as any, shape as any, stone as any);
  
  return (
    <div className="w-full aspect-square bg-secondary/20 rounded-sm flex items-center justify-center overflow-hidden">
      <img 
        src={imagePath} 
        alt="Product preview"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
    </div>
  );
}

// Loading skeleton for 3D viewer
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

export function ConfiguratorPhase({ onBack, onContinue, isNL = true }: ConfiguratorPhaseProps) {
  const { config, resetConfig } = useConfiguratorStore();
  
  const useFallback = useMemo(() => shouldUseFallback(), []);
  const priceEstimate = useMemo(() => calculateModularPrice(config), [config]);

  const handleDimensionPresetSelect = useCallback((preset: DimensionPreset) => {
    const store = useConfiguratorStore.getState();
    store.setDimension('length', preset.length);
    store.setDimension('width', preset.width);
    if (preset.radius) {
      store.setDimension('radius', preset.radius);
    }
  }, []);

  const handleThicknessChange = useCallback((thickness: number) => {
    useConfiguratorStore.getState().setDimension('thickness', thickness);
  }, []);

  const handleRequestQuote = () => {
    onContinue();
  };

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
          onClick={resetConfig}
          className="text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {isNL ? 'Reset' : 'Reset'}
        </Button>
      </motion.div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - 3D Viewer */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-24"
          >
            {useFallback ? (
              <FallbackPreview 
                productType={config.productType}
                shape={config.shape}
                stone={config.stone}
              />
            ) : (
              <Suspense fallback={<ViewerSkeleton />}>
                <ConfiguratorViewer config={config} isNL={isNL} />
              </Suspense>
            )}
            
            {/* Trust badge under viewer */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span>{isNL ? 'Handgemaakt op bestelling' : 'Handmade to order'}</span>
              <span>•</span>
              <span>{isNL ? 'Ontworpen in NL' : 'Designed in NL'}</span>
              <span>•</span>
              <span>{isNL ? '2 jaar garantie' : '2-year warranty'}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Configuration Panels */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Shape */}
          <ConfigPanel 
            title={isNL ? 'Vorm' : 'Shape'}
            step={1}
          >
            <ShapeSelector 
              value={config.shape}
              productType={config.productType}
              onChange={(shape) => useConfiguratorStore.getState().setShape(shape)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Step 2: Dimensions (Fixed presets) */}
          <ConfigPanel 
            title={isNL ? 'Afmeting' : 'Size'}
            step={2}
          >
            <DimensionPresets 
              shape={config.shape}
              currentLength={config.dimensions.length}
              currentWidth={config.dimensions.width}
              currentRadius={config.dimensions.radius}
              onSelect={handleDimensionPresetSelect}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Step 3: Thickness (20mm / 30mm) */}
          <ConfigPanel 
            title={isNL ? 'Bladdikte' : 'Thickness'}
            step={3}
          >
            <ThicknessSelector 
              value={config.dimensions.thickness}
              onChange={handleThicknessChange}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Step 4: Stone - Full 82-stone library */}
          <ConfigPanel 
            title={isNL ? 'Steensoort' : 'Stone type'}
            step={4}
          >
            <StoneSelectorV2 
              value={config.stone}
              onChange={(stone) => useConfiguratorStore.getState().setStone(stone)}
              onCustomStoneRequest={(request) => useConfiguratorStore.getState().setCustomStoneRequest(request)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Step 5: Finish */}
          <ConfigPanel 
            title={isNL ? 'Afwerking' : 'Finish'}
            step={5}
          >
            <FinishSelector 
              value={config.finish}
              onChange={(finish) => useConfiguratorStore.getState().setFinish(finish)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Step 6: Edge Profile */}
          <ConfigPanel 
            title={isNL ? 'Randprofiel' : 'Edge profile'}
            step={6}
          >
            <EdgeProfileSelector 
              value={config.edgeProfile}
              shape={config.shape}
              onChange={(edge) => useConfiguratorStore.getState().setEdgeProfile(edge)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Step 7: Leg / Base */}
          <ConfigPanel 
            title={isNL ? 'Onderstel' : 'Base'}
            step={7}
          >
            <LegSelector 
              value={config.legStyle || 'pillar-leg'}
              shape={config.shape}
              length={config.dimensions.length}
              diameter={config.shape === 'round' ? (config.dimensions.radius ? config.dimensions.radius * 2 : config.dimensions.length) : undefined}
              onChange={(legStyle) => useConfiguratorStore.getState().setLegStyle(legStyle)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Sticky Dossier Summary - Updated with "vanaf" price */}
          <StickyDossierV2 
            config={config}
            priceEstimate={priceEstimate}
            onRequestQuote={handleRequestQuote}
            isNL={isNL}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-border">
        <Button 
          variant="ghost"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isNL ? 'Reset ontwerp' : 'Reset design'}
        </Button>
        
        <Button 
          variant="atelier"
          onClick={onContinue}
        >
          {isNL ? 'Bekijk dossier' : 'View dossier'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Config Panel wrapper component
function ConfigPanel({ 
  title, 
  step, 
  isOptional = false,
  children 
}: { 
  title: string; 
  step: number; 
  isOptional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: step * 0.03 }}
      className="bg-background border border-border rounded-sm p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-secondary text-xs flex items-center justify-center">
            {step}
          </span>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        {isOptional && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Optioneel
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
}

// Updated Sticky Dossier with "vanaf" pricing
import { getStoneById } from '@/lib/configurator/stone-library';
import { getLegById } from '@/lib/configurator/leg-library';
import { SHAPES, BASES } from '@/lib/configurator/config';
import type { ModularPriceEstimate } from '@/lib/configurator/pricing-v2';
import { formatVanafPrice, getModularLeadTime } from '@/lib/configurator/pricing-v2';

interface StickyDossierV2Props {
  config: import('@/lib/configurator/types').ConfiguratorState;
  priceEstimate: ModularPriceEstimate;
  onRequestQuote: () => void;
  isNL?: boolean;
}

function StickyDossierV2({ config, priceEstimate, onRequestQuote, isNL = true }: StickyDossierV2Props) {
  const stone = getStoneById(config.stone);
  const shapeName = SHAPES.find(s => s.id === config.shape)?.name[isNL ? 'nl' : 'en'];
  
  // Use new leg library if legStyle is set, otherwise fall back to legacy BASES
  const leg = config.legStyle ? getLegById(config.legStyle) : null;
  const baseName = leg?.name || BASES.find(b => b.id === config.baseType)?.name[isNL ? 'nl' : 'en'];
  
  const leadTime = getModularLeadTime(config);

  // Dimension string
  const dimensionString = config.shape === 'round' && config.dimensions.radius
    ? `⌀${config.dimensions.radius * 2} cm`
    : `${config.dimensions.length} × ${config.dimensions.width} cm`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-4 bg-background border border-foreground/20 rounded-sm p-5 shadow-lg"
    >
      {/* Summary */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {isNL ? 'Uw selectie' : 'Your selection'}
            </p>
            <h4 className="text-sm font-medium">
              {stone?.name || (isNL ? 'Steen op aanvraag' : 'Stone on request')}
            </h4>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">
              {isNL ? 'Vanaf' : 'From'}
            </p>
            <p className="text-lg font-serif">
              {formatVanafPrice(priceEstimate.vanafPrice)}
            </p>
          </div>
        </div>

        {/* Quick specs */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{shapeName}</span>
          <span>•</span>
          <span>{dimensionString}</span>
          <span>•</span>
          <span>{config.dimensions.thickness * 10}mm</span>
          <span>•</span>
          <span>{baseName}</span>
        </div>

        {/* Lead time */}
        <p className="text-[10px] text-muted-foreground">
          {isNL ? `Levertijd: ${leadTime.min}-${leadTime.max} weken` : `Lead time: ${leadTime.min}-${leadTime.max} weeks`}
        </p>
      </div>

      {/* CTA */}
      <Button 
        variant="atelier"
        className="w-full"
        onClick={onRequestQuote}
      >
        {isNL ? 'Vraag voorstel aan' : 'Request proposal'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Disclaimer */}
      <p className="text-[10px] text-center text-muted-foreground mt-3">
        {priceEstimate.disclaimer}
      </p>
    </motion.div>
  );
}
