import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Button } from './button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionPanelProps {
  label?: string;
  title: string;
  description?: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

export function ActionPanel({
  label,
  title,
  description,
  ctaText,
  ctaLink,
  className,
}: ActionPanelProps) {
  return (
    <div className={cn(
      'group relative p-8 lg:p-10 border border-foreground/8',
      'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
      'hover:border-foreground/15 hover:bg-foreground/[0.01]',
      className
    )}>
      {label && (
        <p className="micro-label mb-4">
          {label}
        </p>
      )}
      
      <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-3">
        {title}
      </h3>
      
      {description && (
        <p className="text-body-sm text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
      )}
      
      <Button asChild variant="sera-secondary" size="sm">
        <Link to={ctaLink}>
          {ctaText}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}

interface ActionPanelGroupProps {
  children: ReactNode;
  className?: string;
}

export function ActionPanelGroup({ children, className }: ActionPanelGroupProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/8', className)}>
      {children}
    </div>
  );
}
