import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import type { ConfiguratorState, ProductType, TableShape } from '@/lib/configurator';
import { DIMENSION_CONSTRAINTS } from '@/lib/configurator';

interface DimensionSlidersProps {
  dimensions: ConfiguratorState['dimensions'];
  productType: ProductType;
  shape: TableShape;
  onChange: (dimensions: ConfiguratorState['dimensions']) => void;
  isNL?: boolean;
  className?: string;
}

export function DimensionSliders({ 
  dimensions, 
  productType, 
  shape,
  onChange, 
  isNL = true, 
  className 
}: DimensionSlidersProps) {
  const constraints = DIMENSION_CONSTRAINTS[productType];
  const isRound = shape === 'round';

  const updateDimension = (key: keyof typeof dimensions, value: number) => {
    onChange({ ...dimensions, [key]: value });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? 'Afmetingen' : 'Dimensions'}
      </label>

      <div className="space-y-5">
        {/* Length / Diameter */}
        {isRound ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{isNL ? 'Diameter' : 'Diameter'}</span>
              <span className="text-sm font-medium tabular-nums">
                {(dimensions.radius ?? 100) * 2} cm
              </span>
            </div>
            <Slider
              value={[dimensions.radius ?? 100]}
              onValueChange={(v) => updateDimension('radius', v[0])}
              min={constraints.radius?.min ?? 50}
              max={constraints.radius?.max ?? 180}
              step={constraints.radius?.step ?? 10}
              className="touch-pan-y"
              aria-label={isNL ? 'Diameter' : 'Diameter'}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>⌀ {(constraints.radius?.min ?? 50) * 2}cm</span>
              <span>⌀ {(constraints.radius?.max ?? 180) * 2}cm</span>
            </div>
          </div>
        ) : (
          <>
            {/* Length */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{isNL ? 'Lengte' : 'Length'}</span>
                <span className="text-sm font-medium tabular-nums">{dimensions.length} cm</span>
              </div>
              <Slider
                value={[dimensions.length]}
                onValueChange={(v) => updateDimension('length', v[0])}
                min={constraints.length.min}
                max={constraints.length.max}
                step={constraints.length.step}
                className="touch-pan-y"
                aria-label={isNL ? 'Lengte' : 'Length'}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{constraints.length.min}cm</span>
                <span>{constraints.length.max}cm</span>
              </div>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{isNL ? 'Breedte' : 'Width'}</span>
                <span className="text-sm font-medium tabular-nums">{dimensions.width} cm</span>
              </div>
              <Slider
                value={[dimensions.width]}
                onValueChange={(v) => updateDimension('width', v[0])}
                min={constraints.width.min}
                max={constraints.width.max}
                step={constraints.width.step}
                className="touch-pan-y"
                aria-label={isNL ? 'Breedte' : 'Width'}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{constraints.width.min}cm</span>
                <span>{constraints.width.max}cm</span>
              </div>
            </div>
          </>
        )}

        {/* Height */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{isNL ? 'Hoogte' : 'Height'}</span>
            <span className="text-sm font-medium tabular-nums">{dimensions.height} cm</span>
          </div>
          <Slider
            value={[dimensions.height]}
            onValueChange={(v) => updateDimension('height', v[0])}
            min={constraints.height.min}
            max={constraints.height.max}
            step={constraints.height.step}
            className="touch-pan-y"
            aria-label={isNL ? 'Hoogte' : 'Height'}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{constraints.height.min}cm</span>
            <span>{constraints.height.max}cm</span>
          </div>
        </div>

        {/* Thickness */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{isNL ? 'Bladdikte' : 'Thickness'}</span>
            <span className="text-sm font-medium tabular-nums">{dimensions.thickness} cm</span>
          </div>
          <Slider
            value={[dimensions.thickness]}
            onValueChange={(v) => updateDimension('thickness', v[0])}
            min={constraints.thickness.min}
            max={constraints.thickness.max}
            step={constraints.thickness.step}
            className="touch-pan-y"
            aria-label={isNL ? 'Bladdikte' : 'Thickness'}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{constraints.thickness.min}cm</span>
            <span>{constraints.thickness.max}cm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
