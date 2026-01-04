import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface HairlineProps {
  className?: string;
  variant?: 'default' | 'dark' | 'accent';
}

export function Hairline({ className, variant = 'default' }: HairlineProps) {
  const variantStyles = {
    default: 'bg-foreground/8',
    dark: 'bg-foreground/15',
    accent: 'bg-brass/30',
  };

  return <div className={cn('h-px w-full', variantStyles[variant], className)} />;
}

interface HairlineSectionProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

export function HairlineSection({ label, children, className }: HairlineSectionProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Top hairline with optional micro-label */}
      <div className="flex items-center gap-6 mb-8 lg:mb-12">
        <Hairline className="flex-1" />
        {label && (
          <>
            <span className="micro-label shrink-0">{label}</span>
            <Hairline className="flex-1" />
          </>
        )}
      </div>
      {children}
    </div>
  );
}

interface MicroLabelProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
}

export function MicroLabel({ children, className, variant = 'default' }: MicroLabelProps) {
  return (
    <span className={cn(
      'text-[10px] font-sans font-medium uppercase tracking-[0.2em]',
      variant === 'default' ? 'text-muted-foreground/70' : 'text-foreground/50',
      className
    )}>
      {children}
    </span>
  );
}
