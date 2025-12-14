import { useTranslation } from 'react-i18next';
import { Check, Clock, Truck, Wrench, Shield } from 'lucide-react';
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
      text: isNL ? 'Handgemaakt in Europa' : 'Handcrafted in Europe',
    },
    {
      icon: Clock,
      text: isNL ? 'Levertijd 8-12 weken' : 'Lead time 8-12 weeks',
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
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <usp.icon className="h-4 w-4 flex-shrink-0 text-forest" />
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
          <usp.icon className="h-4 w-4 flex-shrink-0 text-forest" />
          <span>{usp.text}</span>
        </div>
      ))}
    </div>
  );
}
