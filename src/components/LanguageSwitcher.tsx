import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  isLight?: boolean;
}

export function LanguageSwitcher({ isLight = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const activeLanguage = (i18n.resolvedLanguage ?? i18n.language ?? 'nl').toLowerCase().startsWith('en') ? 'en' : 'nl';

  const changeLanguage = (lng: 'nl' | 'en') => {
    localStorage.setItem('language', lng);
    void i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('nl')}
        className={cn(
          "font-sans text-[10px] uppercase tracking-[0.15em] transition-colors duration-300",
          isLight
            ? activeLanguage === 'nl'
              ? "text-white"
              : "text-white/60 hover:text-white"
            : activeLanguage === 'nl'
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
            ? activeLanguage === 'en'
              ? "text-white"
              : "text-white/60 hover:text-white"
            : activeLanguage === 'en'
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
