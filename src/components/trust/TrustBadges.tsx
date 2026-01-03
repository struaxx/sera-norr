import { Shield, Truck, Award, Clock, MapPin, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface TrustBadgesProps {
  variant?: 'horizontal' | 'vertical' | 'grid' | 'cards';
  showAll?: boolean;
  className?: string;
}

export function TrustBadges({ variant = 'horizontal', showAll = false, className }: TrustBadgesProps) {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const badges = [
    {
      icon: Award,
      title: isNL ? 'Ontworpen in Nederland' : 'Designed in the Netherlands',
      description: isNL ? 'Nederlandse studio, wereldwijd vakmanschap' : 'Dutch studio, global craftsmanship',
    },
    {
      icon: Shield,
      title: isNL ? '5 Jaar Garantie' : '5 Year Warranty',
      description: isNL ? 'Op alle stenen meubels' : 'On all stone furniture',
    },
    {
      icon: Truck,
      title: isNL ? 'White Glove Levering' : 'White Glove Delivery',
      description: isNL ? 'Professionele plaatsing inbegrepen' : 'Professional installation included',
    },
    {
      icon: Wrench,
      title: isNL ? 'Maatwerk Mogelijk' : 'Bespoke Available',
      description: isNL ? 'Aangepaste afmetingen op aanvraag' : 'Custom dimensions on request',
    },
    {
      icon: MapPin,
      title: isNL ? 'Online Atelier' : 'Online Atelier',
      description: isNL ? 'Persoonlijke begeleiding op afstand' : 'Personal guidance remotely',
    },
    {
      icon: Clock,
      title: isNL ? '12–16 Weken Doorlooptijd' : '12–16 Weeks Lead Time',
      description: isNL ? 'Afhankelijk van steenkeuze en locatie' : 'Depending on stone choice and location',
    },
  ];

  const displayBadges = showAll ? badges : badges.slice(0, 4);

  // Premium cards variant with hover effects
  if (variant === 'cards') {
    return (
      <div className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6',
        className
      )}>
        {displayBadges.map((badge, index) => (
          <div 
            key={index}
            className={cn(
              'group p-5 lg:p-6',
              'bg-background border border-border/40 rounded-sm',
              'shadow-[0_2px_12px_-4px_hsl(var(--foreground)/0.04)]',
              'hover:shadow-[0_8px_24px_-8px_hsl(var(--foreground)/0.08)]',
              'hover:-translate-y-0.5',
              'transition-all duration-500 ease-out'
            )}
          >
            <badge.icon className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors duration-300 mb-3" strokeWidth={1.5} />
            <p className="font-serif text-sm text-foreground mb-1">
              {badge.title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const containerClass = cn(
    variant === 'horizontal' && 'flex flex-wrap items-center justify-center gap-8 lg:gap-12',
    variant === 'vertical' && 'flex flex-col gap-4',
    variant === 'grid' && 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8',
    className
  );

  return (
    <div className={containerClass}>
      {displayBadges.map((badge, index) => (
        <div 
          key={index}
          className={cn(
            'flex items-start gap-3',
            variant === 'horizontal' && 'flex-col items-center text-center max-w-[160px]',
            variant === 'grid' && 'flex-col'
          )}
        >
          <div className={cn(
            'flex items-center justify-center w-12 h-12 border border-border/50',
            variant === 'horizontal' && 'w-14 h-14'
          )}>
            <badge.icon className={cn(
              'w-6 h-6 text-foreground/80',
              variant === 'horizontal' && 'w-7 h-7'
            )} strokeWidth={1.5} />
          </div>
          <div>
            <p className={cn(
              'font-sans text-xs uppercase tracking-wider text-foreground',
              variant === 'horizontal' && 'text-[11px]'
            )}>
              {badge.title}
            </p>
            {variant !== 'horizontal' && (
              <p className="text-sm text-muted-foreground mt-1">
                {badge.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
