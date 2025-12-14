import { useTranslation } from 'react-i18next';
import { Sparkles, FileText, Palette, Hammer, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BespokeTimelineProps {
  className?: string;
  compact?: boolean;
}

export function BespokeTimeline({ className, compact = false }: BespokeTimelineProps) {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const steps = [
    {
      icon: Sparkles,
      step: '1',
      title: isNL ? 'Consultatie' : 'Consultation',
      duration: isNL ? '1-2 weken' : '1-2 weeks',
      description: isNL 
        ? 'Vrijblijvend gesprek over uw wensen, ruimte en materiaalvoorkeuren.' 
        : 'No-obligation conversation about your wishes, space and material preferences.',
    },
    {
      icon: FileText,
      step: '2',
      title: isNL ? 'Voorstel & Offerte' : 'Proposal & Quote',
      duration: isNL ? '1-2 weken' : '1-2 weeks',
      description: isNL 
        ? 'Schetsen, materiaalopties en prijsvoorstel op maat.' 
        : 'Sketches, material options and custom price proposal.',
    },
    {
      icon: Palette,
      step: '3',
      title: isNL ? 'Materiaalselectie' : 'Material Selection',
      duration: isNL ? '2-4 weken' : '2-4 weeks',
      description: isNL 
        ? 'Selecteer uw specifieke steenplaat. Foto\'s of showroom bezoek.' 
        : 'Select your specific stone slab. Photos or showroom visit.',
    },
    {
      icon: Hammer,
      step: '4',
      title: isNL ? 'Productie' : 'Production',
      duration: isNL ? '6-12 weken' : '6-12 weeks',
      description: isNL 
        ? 'Vakkundige productie in onze Europese werkplaats.' 
        : 'Expert production in our European workshop.',
    },
    {
      icon: Home,
      step: '5',
      title: isNL ? 'Levering & Plaatsing' : 'Delivery & Installation',
      duration: isNL ? '1-2 weken' : '1-2 weeks',
      description: isNL 
        ? 'White-glove levering en professionele plaatsing.' 
        : 'White-glove delivery and professional installation.',
    },
  ];

  const displaySteps = compact ? steps.slice(0, 3) : steps;

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      {!compact && (
        <div className="absolute left-5 top-8 bottom-8 w-px bg-border hidden lg:block" />
      )}
      
      <div className={cn(
        'space-y-6',
        compact && 'space-y-4'
      )}>
        {displaySteps.map((item, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-10 h-10 flex items-center justify-center border border-border bg-background z-10',
              compact && 'w-8 h-8'
            )}>
              <item.icon className={cn('w-4 h-4 text-foreground', compact && 'w-3 h-3')} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 mb-1">
                <h4 className={cn(
                  'font-sans text-sm font-medium text-foreground',
                  compact && 'text-xs'
                )}>
                  {item.title}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {item.duration}
                </span>
              </div>
              {!compact && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {compact && (
          <p className="text-xs text-muted-foreground pl-12">
            {isNL ? 'Totale doorlooptijd: 12-20 weken' : 'Total lead time: 12-20 weeks'}
          </p>
        )}
      </div>
    </div>
  );
}
