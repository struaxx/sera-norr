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
      {/* Desktop: Horizontal timeline - clean editorial */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Connecting line - subtle */}
          <div className="absolute top-[3.5rem] left-0 right-0 h-px bg-border/40" />
          
          {/* Steps - always 3 columns for consistency */}
          <div className="grid grid-cols-3 gap-12 lg:gap-16">
            {steps.slice(0, 3).map((step, index) => (
              <div key={index} className="relative">
                {/* Large number - editorial style */}
                <div className="relative z-10 mb-8">
                  <span className="font-serif text-7xl lg:text-8xl font-light text-foreground/10 leading-none block">
                    {step.number}
                  </span>
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <h4 className="font-serif text-xl text-foreground">
                    {step.title}
                  </h4>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {step.detail && (
                    <p className="text-eyebrow uppercase text-muted-foreground/60 pt-4">
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical stacked timeline - clean */}
      <div className="lg:hidden space-y-10">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-6">
            {/* Number column */}
            <div className="flex-shrink-0 relative">
              <span className="font-serif text-5xl font-light text-foreground/15 leading-none block">
                {step.number}
              </span>
              {/* Vertical line for mobile */}
              {index < steps.length - 1 && (
                <div className="absolute top-16 left-5 bottom-0 w-px bg-border/40 -mb-10" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-2">
              <h4 className="font-serif text-lg text-foreground mb-2">
                {step.title}
              </h4>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {step.detail && (
                <p className="text-eyebrow uppercase text-muted-foreground/60 mt-4">
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
