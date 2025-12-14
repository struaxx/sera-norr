import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PriceIndicatorProps {
  className?: string;
  category: 'salontafel' | 'eettafel' | 'console' | 'bijzettafel' | 'custom';
}

export function PriceIndicator({ className, category }: PriceIndicatorProps) {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const priceRanges = {
    salontafel: { from: 2800, label: isNL ? 'Salontafels' : 'Coffee Tables' },
    eettafel: { from: 6500, label: isNL ? 'Eettafels' : 'Dining Tables' },
    console: { from: 3800, label: isNL ? 'Consoles' : 'Consoles' },
    bijzettafel: { from: 1400, label: isNL ? 'Bijzettafels' : 'Side Tables' },
    custom: { from: 2000, label: isNL ? 'Maatwerk' : 'Bespoke' },
  };

  const range = priceRanges[category];

  return (
    <div className={cn('text-sm', className)}>
      <span className="text-muted-foreground">
        {isNL ? 'Vanaf' : 'From'}{' '}
      </span>
      <span className="font-medium text-foreground">
        €{range.from.toLocaleString('nl-NL')}
      </span>
    </div>
  );
}
