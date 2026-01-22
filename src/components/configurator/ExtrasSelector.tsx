import { cn } from '@/lib/utils';
import { Check, Package, Truck, Wrench, Palette } from 'lucide-react';
import type { ConfiguratorState } from '@/lib/configurator';
import { EXTRAS_PRICING } from '@/lib/configurator';
import { formatPrice } from '@/lib/configurator';

interface ExtrasSelectorProps {
  extras: ConfiguratorState['extras'];
  onChange: (extras: ConfiguratorState['extras']) => void;
  isNL?: boolean;
  className?: string;
}

const EXTRAS_ICONS = {
  sealer: Palette,
  delivery: Truck,
  installation: Wrench,
  sampleKit: Package,
};

const EXTRAS_DESCRIPTIONS = {
  sealer: {
    nl: 'Professionele impregnatie voor extra bescherming',
    en: 'Professional impregnation for extra protection',
  },
  delivery: {
    nl: 'White-glove bezorging door specialisten',
    en: 'White-glove delivery by specialists',
  },
  installation: {
    nl: 'Plaatsing en nivellering door ons team',
    en: 'Installation and leveling by our team',
  },
  sampleKit: {
    nl: 'Materiaalmonsters vooraf ontvangen',
    en: 'Receive material samples beforehand',
  },
};

export function ExtrasSelector({ extras, onChange, isNL = true, className }: ExtrasSelectorProps) {
  const toggleExtra = (key: keyof typeof extras) => {
    onChange({ ...extras, [key]: !extras[key] });
  };

  const extraKeys = Object.keys(EXTRAS_PRICING) as (keyof typeof EXTRAS_PRICING)[];

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isNL ? "Extra's & Services" : 'Extras & Services'}
      </label>
      
      <div className="space-y-2">
        {extraKeys.map((key) => {
          const extra = EXTRAS_PRICING[key];
          const Icon = EXTRAS_ICONS[key];
          const isSelected = extras[key];
          const description = EXTRAS_DESCRIPTIONS[key];
          
          return (
            <button
              key={key}
              onClick={() => toggleExtra(key)}
              className={cn(
                "relative w-full flex items-start gap-4 p-4 rounded-sm border transition-all duration-200 text-left",
                isSelected 
                  ? "border-foreground bg-foreground/5" 
                  : "border-border hover:border-foreground/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors",
                isSelected ? "bg-foreground text-background" : "bg-secondary text-foreground"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {extra.name[isNL ? 'nl' : 'en']}
                  </span>
                  <span className="text-sm tabular-nums flex-shrink-0">
                    {formatPrice(extra.price)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {description[isNL ? 'nl' : 'en']}
                </p>
              </div>

              <div className={cn(
                "w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                isSelected 
                  ? "bg-foreground border-foreground" 
                  : "border-border"
              )}>
                {isSelected && <Check className="w-3 h-3 text-background" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recommendation */}
      {!extras.sampleKit && (
        <p className="text-xs text-muted-foreground italic pt-2">
          {isNL 
            ? '💡 Tip: Bestel samples om de steen in uw ruimte te ervaren'
            : '💡 Tip: Order samples to experience the stone in your space'
          }
        </p>
      )}
    </div>
  );
}
