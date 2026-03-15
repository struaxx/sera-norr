import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import nl from './locales/nl.json';

const SUPPORTED_LANGUAGES = ['nl', 'en'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const normalizeLanguage = (value: string | null | undefined): SupportedLanguage => {
  const base = (value ?? '').toLowerCase().split('-')[0];
  return SUPPORTED_LANGUAGES.includes(base as SupportedLanguage) ? (base as SupportedLanguage) : 'nl';
};

const savedLanguage = normalizeLanguage(localStorage.getItem('language'));

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      nl: { translation: nl },
    },
    lng: savedLanguage,
    fallbackLng: 'nl',
    supportedLngs: SUPPORTED_LANGUAGES,
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    cleanCode: true,
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (nextLanguage) => {
  const normalized = normalizeLanguage(nextLanguage);
  if (nextLanguage !== normalized) {
    void i18n.changeLanguage(normalized);
    return;
  }

  localStorage.setItem('language', normalized);
});

const storedLanguage = normalizeLanguage(localStorage.getItem('language'));
if ((i18n.resolvedLanguage ?? i18n.language) !== storedLanguage) {
  void i18n.changeLanguage(storedLanguage);
}

export default i18n;
