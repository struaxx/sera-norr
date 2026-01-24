// ============================================
// Configurator Phase - 3D Builder
// ============================================

import { Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfiguratorStore } from '@/stores/configurator-store';
import { 
  ShapeSelector, 
  ProductTypeSelector 
} from '@/components/configurator/ShapeSelector';
import { DimensionSliders } from '@/components/configurator/DimensionSliders';
import { StoneSelectorV2, FinishSelector } from '@/components/configurator/StoneSelectorV2';
import { EdgeProfileSelector, BaseSelector } from '@/components/configurator/EdgeBaseSelector';
import { StickyDossier } from '@/components/configurator/StickyDossier';
import { 
  shouldUseFallback, 
  getFallbackPreview,
  calculatePriceEstimate,
} from '@/lib/configurator';

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
  const priceEstimate = useMemo(() => calculatePriceEstimate(config), [config]);

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
              <span>🇮🇹 Italiaans marmer</span>
              <span>•</span>
              <span>🇳🇱 Ontworpen in NL</span>
              <span>•</span>
              <span>2 jaar garantie</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Configuration Panels */}
        <div className="lg:col-span-5 space-y-6">
          {/* Product Type */}
          <ConfigPanel 
            title={isNL ? 'Type meubel' : 'Furniture type'}
            step={1}
          >
            <ProductTypeSelector 
              value={config.productType}
              onChange={(type) => useConfiguratorStore.getState().setProductType(type)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Shape */}
          <ConfigPanel 
            title={isNL ? 'Vorm' : 'Shape'}
            step={2}
          >
            <ShapeSelector 
              value={config.shape}
              productType={config.productType}
              onChange={(shape) => useConfiguratorStore.getState().setShape(shape)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Dimensions */}
          <ConfigPanel 
            title={isNL ? 'Afmetingen' : 'Dimensions'}
            step={3}
          >
            <DimensionSliders 
              dimensions={config.dimensions}
              productType={config.productType}
              shape={config.shape}
              onChange={(newDimensions) => {
                const store = useConfiguratorStore.getState();
                Object.entries(newDimensions).forEach(([key, value]) => {
                  if (value !== undefined) {
                    store.setDimension(key as any, value);
                  }
                });
              }}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Stone - Full 82-stone library */}
          <ConfigPanel 
            title={isNL ? 'Steensoort' : 'Stone type'}
            step={4}
          >
            <StoneSelectorV2 
              value={config.stone}
              onChange={(stone) => useConfiguratorStore.getState().setStone(stone)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Finish */}
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

          {/* Edge Profile */}
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

          {/* Base */}
          <ConfigPanel 
            title={isNL ? 'Onderstel' : 'Base'}
            step={7}
          >
            <BaseSelector 
              value={config.baseType}
              productType={config.productType}
              onChange={(base) => useConfiguratorStore.getState().setBaseType(base)}
              isNL={isNL}
            />
          </ConfigPanel>

          {/* Sticky Dossier Summary */}
          <StickyDossier 
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
      transition={{ delay: step * 0.05 }}
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
