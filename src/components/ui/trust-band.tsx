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
      'py-5 lg:py-6',
      className
    )}
    style={{ 
      backgroundColor: 'hsl(var(--secondary) / 0.2)',
      borderTop: '1px solid hsl(var(--foreground) / 0.06)',
      borderBottom: '1px solid hsl(var(--foreground) / 0.06)'
    }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 lg:gap-x-16">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              {index > 0 && (
                <span 
                  className="hidden lg:block w-px h-4"
                  style={{ backgroundColor: 'hsl(var(--foreground) / 0.1)' }}
                />
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
