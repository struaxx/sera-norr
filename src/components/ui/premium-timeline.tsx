import { cn } from '@/lib/utils';

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
  detail?: string;
}

interface PremiumTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function PremiumTimeline({ steps, className }: PremiumTimelineProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Desktop: Horizontal timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-0 right-0 h-px bg-border/60" />
          
          {/* Steps */}
          <div className="grid grid-cols-3 gap-8 lg:gap-12">
            {steps.slice(0, 3).map((step, index) => (
              <div key={index} className="relative pt-0">
                {/* Number */}
                <div className="relative z-10 mb-6">
                  <span className="font-serif text-5xl lg:text-6xl font-light text-foreground/15 leading-none">
                    {step.number}
                  </span>
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h4 className="font-serif text-lg text-foreground">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {step.detail && (
                    <p className="text-xs text-muted-foreground/70 pt-2 border-t border-border/30 mt-3">
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional steps if more than 3 */}
          {steps.length > 3 && (
            <div className="grid grid-cols-3 gap-8 lg:gap-12 mt-12">
              {steps.slice(3).map((step, index) => (
                <div key={index + 3} className="relative pt-0">
                  <div className="relative z-10 mb-6">
                    <span className="font-serif text-5xl lg:text-6xl font-light text-foreground/15 leading-none">
                      {step.number}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-foreground">
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    {step.detail && (
                      <p className="text-xs text-muted-foreground/70 pt-2 border-t border-border/30 mt-3">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Vertical stacked timeline */}
      <div className="lg:hidden space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-5">
            {/* Number column */}
            <div className="flex-shrink-0 relative">
              <span className="font-serif text-4xl font-light text-foreground/20 leading-none">
                {step.number}
              </span>
              {/* Vertical line for mobile */}
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-4 bottom-0 w-px bg-border/40 -mb-8" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-2">
              <h4 className="font-serif text-base text-foreground mb-1.5">
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {step.detail && (
                <p className="text-xs text-muted-foreground/70 mt-3 pt-2 border-t border-border/30">
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
