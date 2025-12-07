import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('nl')}
        className={cn(
          "font-sans text-[10px] uppercase tracking-[0.15em] transition-colors duration-300",
          i18n.language === 'nl'
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        NL
      </button>
      <span className="text-muted-foreground/40 text-xs">/</span>
      <button
        onClick={() => changeLanguage('en')}
        className={cn(
          "font-sans text-[10px] uppercase tracking-[0.15em] transition-colors duration-300",
          i18n.language === 'en'
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
