import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PremiumFeatureCardsProps {
  cards: FeatureCard[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function PremiumFeatureCards({ cards, className, columns = 2 }: PremiumFeatureCardsProps) {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn(
      'grid gap-4 lg:gap-6',
      gridClass[columns],
      className
    )}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <article
            key={index}
            className={cn(
              'group relative p-6 lg:p-8',
              'bg-background',
              'border border-border/40 rounded-sm',
              'shadow-[0_2px_12px_-4px_hsl(var(--foreground)/0.04)]',
              'hover:shadow-[0_8px_24px_-8px_hsl(var(--foreground)/0.08)]',
              'hover:-translate-y-0.5',
              'transition-all duration-500 ease-out'
            )}
          >
            {/* Icon */}
            <div className="mb-4">
              <Icon className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors duration-300" strokeWidth={1.5} />
            </div>
            
            {/* Title */}
            <h3 className="font-serif text-base lg:text-lg text-foreground mb-2">
              {card.title}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
