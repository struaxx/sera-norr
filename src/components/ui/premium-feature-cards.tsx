import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface FeatureCard {
  icon?: LucideIcon;
  label?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
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
      'grid gap-5 lg:gap-6',
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
              'border border-border/50 rounded-sm',
              'shadow-card',
              'hover:shadow-card-hover',
              'hover:-translate-y-0.5',
              'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
            )}
          >
            {/* Label / Icon */}
            <div className="mb-4 flex items-center gap-3">
              {Icon && (
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" strokeWidth={1.5} />
              )}
              {card.label && (
                <span className="text-eyebrow uppercase text-muted-foreground">
                  {card.label}
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 className="font-serif text-lg lg:text-xl text-foreground mb-2">
              {card.title}
            </h3>
            
            {/* Description - 1 sentence max */}
            <p className="text-body-sm text-muted-foreground leading-relaxed mb-4">
              {card.description}
            </p>

            {/* CTA Button */}
            {card.ctaText && card.ctaLink && (
              <Link 
                to={card.ctaLink}
                className="inline-flex items-center text-sm font-medium text-foreground group-hover:translate-x-1 transition-transform duration-300"
              >
                {card.ctaText}
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
