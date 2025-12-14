import { Shield, Truck, Award, Clock, MapPin, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface TrustBadgesProps {
  variant?: 'horizontal' | 'vertical' | 'grid';
  showAll?: boolean;
  className?: string;
}

export function TrustBadges({ variant = 'horizontal', showAll = false, className }: TrustBadgesProps) {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const badges = [
    {
      icon: Award,
      title: isNL ? 'Europees Vakmanschap' : 'European Craftsmanship',
      description: isNL ? 'Handgemaakt door meester-ambachtslieden' : 'Handcrafted by master artisans',
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
      title: isNL ? 'Amsterdam Showroom' : 'Amsterdam Showroom',
      description: isNL ? 'Bezoek op afspraak' : 'Visits by appointment',
    },
    {
      icon: Clock,
      title: isNL ? '12-20 Weken Levertijd' : '12-20 Weeks Lead Time',
      description: isNL ? 'Vakmanschap vraagt tijd' : 'Craftsmanship takes time',
    },
  ];

  const displayBadges = showAll ? badges : badges.slice(0, 4);

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
            variant === 'horizontal' && 'flex-col items-center text-center max-w-[140px]',
            variant === 'grid' && 'flex-col'
          )}
        >
          <div className={cn(
            'flex items-center justify-center w-10 h-10 border border-border/50',
            variant === 'horizontal' && 'w-12 h-12'
          )}>
            <badge.icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className={cn(
              'font-sans text-xs uppercase tracking-wider text-foreground',
              variant === 'horizontal' && 'text-[10px]'
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
