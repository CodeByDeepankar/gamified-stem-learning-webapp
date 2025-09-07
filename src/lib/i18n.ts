import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/data/locales/en/common.json';
import or from '@/data/locales/or/common.json';

// Detect persisted language in browser (guard against SSR)
const persistedLang = typeof window !== 'undefined' ? (localStorage.getItem('lang') || undefined) : undefined;

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: en },
        or: { common: or },
      },
      lng: persistedLang || 'en',
      fallbackLng: 'en',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      updateMissing: false,
    });
} else {
  // Hot-reload: merge updated resource bundles so new keys appear without restart
  i18n.addResourceBundle('en', 'common', en, true, true);
  i18n.addResourceBundle('or', 'common', or, true, true);
}

export default i18n;
