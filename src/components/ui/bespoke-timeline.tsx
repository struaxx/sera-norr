import { cn } from '@/lib/utils';

export interface BespokeTimelineStep {
  number: string;
  title: string;
  description: string;
  tag?: string;
}

interface BespokeTimelineProps {
  steps: BespokeTimelineStep[];
  className?: string;
  supportImage?: string;
  supportImageAlt?: string;
}

export function BespokeTimeline({ 
  steps, 
  className,
  supportImage,
  supportImageAlt = 'Process detail'
}: BespokeTimelineProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Desktop: Horizontal with ghost numbers */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-0">
          {steps.slice(0, 3).map((step, index) => (
            <div 
              key={index} 
              className={cn(
                'relative py-12 px-10',
                // Vertical hairlines between steps
                index > 0 && 'border-l border-foreground/8',
              )}
            >
              {/* Large ghost number (watermark) */}
              <span className="font-serif text-[10rem] font-light leading-none text-foreground/[0.04] absolute -top-8 left-6 select-none pointer-events-none">
                {step.number}
              </span>
              
              {/* Content */}
              <div className="relative z-10 space-y-4">
                <h4 className="font-serif text-xl text-foreground">
                  {step.title}
                </h4>
                <p className="text-body-sm text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
                {step.tag && (
                  <p className="micro-label pt-4">
                    {step.tag}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Supporting visual (optional) */}
        {supportImage && (
          <div className="mt-16 flex justify-end">
            <div className="w-1/3 aspect-[3/2] bg-muted overflow-hidden">
              <img 
                src={supportImage} 
                alt={supportImageAlt}
                className="w-full h-full object-cover opacity-80"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Vertical stacked with ghost numbers */}
      <div className="lg:hidden space-y-0">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              'relative py-10 px-6',
              index > 0 && 'border-t border-foreground/8',
            )}
          >
            {/* Ghost number */}
            <span className="font-serif text-7xl font-light leading-none text-foreground/[0.05] absolute top-6 right-4 select-none pointer-events-none">
              {step.number}
            </span>
            
            {/* Content */}
            <div className="relative z-10 space-y-3">
              <h4 className="font-serif text-lg text-foreground">
                {step.title}
              </h4>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {step.tag && (
                <p className="micro-label pt-3">
                  {step.tag}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
