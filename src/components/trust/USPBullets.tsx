import { useTranslation } from 'react-i18next';
import { Clock, Truck, Wrench, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface USPBulletsProps {
  className?: string;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function USPBullets({ className, variant = 'default' }: USPBulletsProps) {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const usps = [
    {
      icon: Wrench,
      text: isNL ? 'Ontworpen in Nederland' : 'Designed in the Netherlands',
    },
    {
      icon: Clock,
      text: isNL ? 'Levertijd 12-20 weken' : 'Lead time 12-20 weeks',
    },
    {
      icon: Truck,
      text: isNL ? 'Levering & plaatsing inbegrepen' : 'Delivery & installation included',
    },
    {
      icon: Shield,
      text: isNL ? '5 jaar garantie' : '5-year warranty',
    },
  ];

  const displayUsps = variant === 'compact' ? usps.slice(0, 3) : usps;

  if (variant === 'horizontal') {
    return (
      <div className={cn('flex flex-wrap gap-4 lg:gap-6', className)}>
        {displayUsps.map((usp, index) => (
          <div key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <usp.icon className="h-5 w-5 flex-shrink-0 text-forest" />
            <span>{usp.text}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {displayUsps.map((usp, index) => (
        <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
          <usp.icon className="h-5 w-5 flex-shrink-0 text-forest" />
          <span>{usp.text}</span>
        </div>
      ))}
    </div>
  );
}
