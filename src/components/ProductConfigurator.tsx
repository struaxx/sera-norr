import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ProductViewer3D } from './ProductViewer3D';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const materials = [
  { id: 'travertine', color: '#E8DFD0' },
  { id: 'calacattaViola', color: '#F5F0F5' },
  { id: 'verdeAlpi', color: '#2D4A3E' },
  { id: 'neroMarquina', color: '#1A1A1A' },
  { id: 'concrete', color: '#8C8C8C' },
];

const finishes = ['polished', 'honed', 'matte', 'natural'];

interface ProductConfiguratorProps {
  className?: string;
}

export function ProductConfigurator({ className }: ProductConfiguratorProps) {
  const { t } = useTranslation();
  const [selectedMaterial, setSelectedMaterial] = useState('travertine');
  const [selectedFinish, setSelectedFinish] = useState('honed');
  const [dimensions, setDimensions] = useState({
    width: 140,
    depth: 80,
    height: 40,
  });

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12", className)}>
      {/* 3D Viewer */}
      <div className="order-1">
        <ProductViewer3D
          material={selectedMaterial}
          finish={selectedFinish}
          width={dimensions.width}
          depth={dimensions.depth}
          height={dimensions.height}
        />
        <p className="text-center text-muted-foreground text-xs mt-4 tracking-wide">
          {t('configurator.rotateHint')}
        </p>
      </div>

      {/* Controls */}
      <div className="order-2 space-y-8">
        <div>
          <h3 className="font-serif text-2xl text-foreground mb-6">
            {t('configurator.title')}
          </h3>
        </div>

        {/* Material Selection */}
        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t('configurator.material')}
          </label>
          <div className="flex flex-wrap gap-3">
            {materials.map((material) => (
              <button
                key={material.id}
                onClick={() => setSelectedMaterial(material.id)}
                className={cn(
                  "relative w-12 h-12 rounded-full border-2 transition-all duration-300",
                  selectedMaterial === material.id
                    ? "border-foreground scale-110"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
                style={{ backgroundColor: material.color }}
                title={t(`configurator.materials.${material.id}`)}
              >
                {material.id === 'calacattaViola' && (
                  <div
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, transparent 40%, #8B6B8B 45%, transparent 50%)',
                    }}
                  />
                )}
                {material.id === 'neroMarquina' && (
                  <div
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: 'linear-gradient(45deg, transparent 45%, #4A4A4A 48%, transparent 51%)',
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <p className="text-foreground text-sm mt-3">
            {t(`configurator.materials.${selectedMaterial}`)}
          </p>
        </div>

        {/* Finish Selection */}
        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t('configurator.finish')}
          </label>
          <div className="flex flex-wrap gap-2">
            {finishes.map((finish) => (
              <button
                key={finish}
                onClick={() => setSelectedFinish(finish)}
                className={cn(
                  "px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300",
                  selectedFinish === finish
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {t(`configurator.finishes.${finish}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            {t('configurator.dimensions')}
          </label>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{t('configurator.width')}</span>
                <span className="text-sm text-foreground font-medium">{dimensions.width} {t('configurator.cm')}</span>
              </div>
              <Slider
                value={[dimensions.width]}
                onValueChange={(value) => setDimensions({ ...dimensions, width: value[0] })}
                min={80}
                max={240}
                step={10}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{t('configurator.depth')}</span>
                <span className="text-sm text-foreground font-medium">{dimensions.depth} {t('configurator.cm')}</span>
              </div>
              <Slider
                value={[dimensions.depth]}
                onValueChange={(value) => setDimensions({ ...dimensions, depth: value[0] })}
                min={40}
                max={120}
                step={10}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{t('configurator.height')}</span>
                <span className="text-sm text-foreground font-medium">{dimensions.height} {t('configurator.cm')}</span>
              </div>
              <Slider
                value={[dimensions.height]}
                onValueChange={(value) => setDimensions({ ...dimensions, height: value[0] })}
                min={30}
                max={80}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button asChild variant="atelier" size="lg" className="w-full">
            <Link to="/bespoke">
              {t('configurator.requestQuote')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
