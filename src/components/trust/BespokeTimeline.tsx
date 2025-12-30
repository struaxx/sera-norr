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
      description: isNL 
        ? 'Vrijblijvend gesprek over uw wensen en ruimte.' 
        : 'No-obligation conversation about your wishes and space.',
    },
    {
      icon: FileText,
      step: '2',
      title: isNL ? 'Voorstel & Offerte' : 'Proposal & Quote',
      description: isNL 
        ? 'Schetsen, materiaalopties en offerte.' 
        : 'Sketches, material options and quote.',
    },
    {
      icon: Palette,
      step: '3',
      title: isNL ? 'Materiaalselectie' : 'Material Selection',
      description: isNL 
        ? 'Selecteer uw steenplaat aan de hand van foto\'s.' 
        : 'Select your stone slab based on photos.',
    },
    {
      icon: Hammer,
      step: '4',
      title: isNL ? 'Productie' : 'Production',
      description: isNL 
        ? 'Vakkundige productie door onze ambachtslieden.' 
        : 'Expert production by our artisans.',
    },
    {
      icon: Home,
      step: '5',
      title: isNL ? 'Levering & Plaatsing' : 'Delivery & Installation',
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
              <h4 className={cn(
                'font-sans text-sm font-medium text-foreground mb-1',
                compact && 'text-xs'
              )}>
                {item.title}
              </h4>
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
            {isNL ? 'Gemiddelde doorlooptijd: 12–16 weken' : 'Average lead time: 12–16 weeks'}
          </p>
        )}
      </div>
    </div>
  );
}
