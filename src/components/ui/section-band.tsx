import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type BandVariant = 'default' | 'sand' | 'cream' | 'dark';

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
    sand: 'bg-secondary/30',
    cream: 'bg-ivory/50',
    dark: 'bg-foreground text-background',
  };

  const sizeStyles = {
    sm: 'py-12 lg:py-16',
    md: 'py-16 lg:py-20',
    lg: 'py-20 lg:py-28',
    xl: 'py-24 lg:py-32',
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
}

export function SectionHeader({ 
  eyebrow, 
  title, 
  description, 
  centered = false,
  className 
}: SectionHeaderProps) {
  return (
    <header className={cn(
      'mb-12 lg:mb-16',
      centered && 'text-center max-w-2xl mx-auto',
      !centered && 'max-w-3xl',
      className
    )}>
      {eyebrow && (
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-display-sm text-foreground mb-4 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-body-md leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}
