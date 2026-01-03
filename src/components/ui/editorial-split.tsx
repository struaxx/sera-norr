import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Button } from './button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditorialSplitProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  reverse?: boolean;
  variant?: 'default' | 'sand' | 'cream';
  className?: string;
  children?: ReactNode;
}

export function EditorialSplit({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  reverse = false,
  variant = 'default',
  className,
  children
}: EditorialSplitProps) {
  const variantStyles = {
    default: 'bg-background',
    sand: 'bg-secondary/30',
    cream: 'bg-ivory/50',
  };

  return (
    <section className={cn(variantStyles[variant], 'py-section-sm lg:py-section', className)}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center',
          reverse && 'lg:[&>*:first-child]:order-2'
        )}>
          {/* Image */}
          <div className="image-reveal">
            <div className="aspect-[4/5] lg:aspect-[3/4] bg-muted overflow-hidden">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center max-w-lg">
            {eyebrow && (
              <p className="text-eyebrow uppercase text-muted-foreground mb-4">
                {eyebrow}
              </p>
            )}
            
            <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
              {title}
            </h2>
            
            <p className="text-body-md text-muted-foreground leading-relaxed mb-8">
              {description}
            </p>

            {children}

            {(ctaText || secondaryCtaText) && (
              <div className="flex flex-wrap items-center gap-4">
                {ctaText && ctaLink && (
                  <Button asChild variant="atelier-filled" size="lg">
                    <Link to={ctaLink}>
                      {ctaText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {secondaryCtaText && secondaryCtaLink && (
                  <Button asChild variant="ghost" size="lg">
                    <Link to={secondaryCtaLink}>
                      {secondaryCtaText}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
