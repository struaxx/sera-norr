import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import nl from './locales/nl.json';

const savedLanguage = localStorage.getItem('language') || 'nl';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      nl: { translation: nl },
    },
    lng: savedLanguage,
    fallbackLng: 'nl',
    supportedLngs: ['nl', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

// Re-apply saved language on each page load to prevent drift
const stored = localStorage.getItem('language');
if (stored && (stored === 'nl' || stored === 'en') && i18n.language !== stored) {
  i18n.changeLanguage(stored);
}

export default i18n;
