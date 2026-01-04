import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ProofItem {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface ProofGridProps {
  items: ProofItem[];
  className?: string;
}

export function ProofGrid({ items, className }: ProofGridProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Top hairline */}
      <div className="h-px bg-foreground/8 mb-0" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              'relative py-10 lg:py-12 px-0 lg:px-8',
              // First item no left padding on desktop
              index === 0 && 'lg:pl-0',
              // Last item no right padding on desktop
              index === items.length - 1 && 'lg:pr-0',
            )}
          >
            {/* Vertical hairline between items (desktop) */}
            {index > 0 && (
              <div className="hidden lg:block absolute left-0 top-6 bottom-6 w-px bg-foreground/8" />
            )}
            
            {/* Horizontal hairline between items (mobile/tablet) */}
            {index > 0 && (
              <div className="lg:hidden absolute top-0 left-0 right-0 h-px bg-foreground/8" />
            )}
            
            <div className="space-y-3">
              {item.icon && (
                <div className="text-foreground/30 mb-4">
                  {item.icon}
                </div>
              )}
              <h4 className="font-serif text-lg lg:text-xl text-foreground">
                {item.title}
              </h4>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom hairline */}
      <div className="h-px bg-foreground/8 mt-0" />
    </div>
  );
}
