import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PriceIndicatorProps {
  className?: string;
  category?: 'salontafel' | 'eettafel' | 'console' | 'bijzettafel' | 'custom';
}

export function PriceIndicator({ className }: PriceIndicatorProps) {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  return (
    <div className={cn('text-sm', className)}>
      <span className="font-medium text-foreground">
        {isNL ? 'Prijs op aanvraag' : 'Price on request'}
      </span>
    </div>
  );
}
