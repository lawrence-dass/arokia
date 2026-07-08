import 'intl-pluralrules'; // polyfill for Intl.PluralRules on older Android versions
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ta from '@/locales/ta.json';
import en from '@/locales/en.json';

i18n.use(initReactI18next).init({
  resources: { ta: { translation: ta }, en: { translation: en } },
  // Tamil-first: the app is a Tamil-first product, so `ta` is the default language regardless of
  // device locale. The user's saved choice (prefsStore) is applied on rehydration and via the
  // in-app language switcher; `ta` is also the fallback for any key another language is missing.
  lng: 'ta',
  fallbackLng: 'ta',
  interpolation: { escapeValue: false },
});

export default i18n;
