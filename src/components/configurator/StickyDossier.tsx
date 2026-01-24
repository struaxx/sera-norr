import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConfiguratorState, PriceEstimate } from '@/lib/configurator';
import { 
  formatPriceRange, 
  getLeadTimeEstimate,
  getCompletionPercentage,
  PRODUCT_TYPES,
  STONE_MATERIALS,
  SHAPES,
} from '@/lib/configurator';

interface StickyDossierProps {
  config: ConfiguratorState;
  priceEstimate: PriceEstimate;
  onRequestQuote: () => void;
  isNL?: boolean;
  className?: string;
}

export function StickyDossier({ 
  config, 
  priceEstimate, 
  onRequestQuote, 
  isNL = true,
  className 
}: StickyDossierProps) {
  const completion = getCompletionPercentage(config);
  const leadTime = getLeadTimeEstimate(config);
  
  const productName = PRODUCT_TYPES.find(p => p.id === config.productType)?.name[isNL ? 'nl' : 'en'];
  const stoneName = STONE_MATERIALS.find(s => s.id === config.stone)?.name[isNL ? 'nl' : 'en'];
  const shapeName = SHAPES.find(s => s.id === config.shape)?.name[isNL ? 'nl' : 'en'];

  const dimensionString = config.shape === 'round' && config.dimensions.radius
    ? `⌀${config.dimensions.radius * 2} × H${config.dimensions.height}`
    : `${config.dimensions.length} × ${config.dimensions.width} × H${config.dimensions.height}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-background border border-border rounded-sm p-5 space-y-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {isNL ? 'Uw Dossier' : 'Your Dossier'}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          {completion}% {isNL ? 'compleet' : 'complete'}
        </div>
      </div>

      {/* Completion bar */}
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground">{isNL ? 'Type' : 'Type'}</span>
          <span className="text-sm text-right">{productName} — {shapeName}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground">{isNL ? 'Afmetingen' : 'Dimensions'}</span>
          <span className="text-sm font-mono">{dimensionString} cm</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground">{isNL ? 'Materiaal' : 'Material'}</span>
          <span className="text-sm text-right">{stoneName}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Price note - no specific prices shown */}
      <div className="space-y-1">
        <p className="text-[10px] text-muted-foreground">
          {isNL 
            ? 'Definitieve prijs na persoonlijk voorstel'
            : 'Final price after personal proposal'
          }
        </p>
      </div>

      {/* Lead time */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>
          {isNL ? 'Levertijd' : 'Lead time'}: {leadTime.min}–{leadTime.max} {isNL ? 'weken' : 'weeks'}
        </span>
      </div>

      {/* CTA */}
      <Button 
        onClick={onRequestQuote}
        variant="atelier"
        size="lg"
        className="w-full"
        disabled={completion < 50}
      >
        {isNL ? 'Vraag voorstel aan' : 'Request proposal'}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {completion < 50 && (
        <p className="text-[10px] text-center text-muted-foreground">
          {isNL ? 'Maak minimaal 50% van de keuzes' : 'Complete at least 50% of choices'}
        </p>
      )}
    </motion.div>
  );
}
