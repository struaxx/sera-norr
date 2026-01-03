import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type BandVariant = 'default' | 'sand' | 'cream' | 'dark' | 'greige';

interface SectionBandProps {
  children: ReactNode;
  variant?: BandVariant;
  className?: string;
  withDivider?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function SectionBand({ 
  children, 
  variant = 'default', 
  className,
  withDivider = false,
  size = 'lg'
}: SectionBandProps) {
  const variantStyles = {
    default: 'bg-background',
    sand: 'bg-secondary/25',
    cream: 'bg-ivory/40',
    greige: 'bg-greige/30',
    dark: 'bg-foreground text-background',
  };

  const sizeStyles = {
    sm: 'py-12 lg:py-16',
    md: 'py-16 lg:py-24',
    lg: 'py-20 lg:py-32',
    xl: 'py-28 lg:py-40',
  };

  return (
    <section 
      className={cn(
        variantStyles[variant],
        sizeStyles[size],
        withDivider && 'border-t border-border/30',
        className
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SectionHeader({ 
  eyebrow, 
  title, 
  description, 
  centered = false,
  className,
  size = 'md'
}: SectionHeaderProps) {
  const sizeStyles = {
    sm: 'mb-8 lg:mb-10',
    md: 'mb-12 lg:mb-16',
    lg: 'mb-16 lg:mb-20',
  };

  return (
    <header className={cn(
      sizeStyles[size],
      centered && 'text-center max-w-2xl mx-auto',
      !centered && 'max-w-3xl',
      className
    )}>
      {eyebrow && (
        <p className="text-eyebrow uppercase text-muted-foreground mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-body-md lg:text-body-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}
