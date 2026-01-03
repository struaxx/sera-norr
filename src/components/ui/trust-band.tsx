import { cn } from '@/lib/utils';

interface TrustItem {
  text: string;
}

interface TrustBandProps {
  items: TrustItem[];
  className?: string;
}

export function TrustBand({ items, className }: TrustBandProps) {
  return (
    <section className={cn(
      'py-6 lg:py-8 bg-secondary/20 border-y border-border/30',
      className
    )}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 lg:gap-x-12">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {index > 0 && (
                <span className="hidden lg:block w-px h-4 bg-border/60" />
              )}
              <span className="text-body-sm text-muted-foreground">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
