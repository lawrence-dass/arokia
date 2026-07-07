import 'intl-pluralrules'; // polyfill for Intl.PluralRules on older Android versions
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import ta from '@/locales/ta.json';
import en from '@/locales/en.json';

i18n.use(initReactI18next).init({
  resources: { ta: { translation: ta }, en: { translation: en } },
  // Device locale picks the language (en on an English simulator/phone); ta is the shipped default
  // and the fallback for any key a non-Tamil locale is missing.
  lng: Localization.getLocales()[0]?.languageCode ?? 'ta',
  fallbackLng: 'ta',
  interpolation: { escapeValue: false },
});

export default i18n;
