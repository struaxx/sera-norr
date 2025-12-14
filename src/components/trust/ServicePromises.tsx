import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServicePromisesProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function ServicePromises({ className, variant = 'default' }: ServicePromisesProps) {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const promises = isNL ? [
    'Ontworpen in Nederland',
    '5 jaar garantie op alle stenen meubels',
    'Professionele levering en plaatsing inbegrepen',
    'Maatwerk mogelijk op aanvraag',
    'Persoonlijk advies vanuit onze studio',
  ] : [
    'Designed in the Netherlands',
    '5-year warranty on all stone furniture',
    'Professional delivery and installation included',
    'Bespoke customization available on request',
    'Personal consultation in our Amsterdam showroom',
  ];

  const displayPromises = variant === 'compact' ? promises.slice(0, 3) : promises;

  return (
    <div className={cn('space-y-3', className)}>
      {displayPromises.map((promise, index) => (
        <div key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
          <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-forest" />
          <span>{promise}</span>
        </div>
      ))}
    </div>
  );
}
