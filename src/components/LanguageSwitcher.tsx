import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  isLight?: boolean;
}

export function LanguageSwitcher({ isLight = false }: LanguageSwitcherProps) {
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
          isLight
            ? i18n.language === 'nl'
              ? "text-white"
              : "text-white/60 hover:text-white"
            : i18n.language === 'nl'
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
        )}
      >
        NL
      </button>
      <span className={cn(
        "text-xs transition-colors duration-300",
        isLight ? "text-white/40" : "text-muted-foreground/40"
      )}>/</span>
      <button
        onClick={() => changeLanguage('en')}
        className={cn(
          "font-sans text-[10px] uppercase tracking-[0.15em] transition-colors duration-300",
          isLight
            ? i18n.language === 'en'
              ? "text-white"
              : "text-white/60 hover:text-white"
            : i18n.language === 'en'
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
