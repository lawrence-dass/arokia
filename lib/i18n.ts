import 'intl-pluralrules'; // polyfill for Intl.PluralRules on older Android versions
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import ta from '@/locales/ta.json';

i18n.use(initReactI18next).init({
  resources: { ta: { translation: ta } },
  lng: Localization.getLocales()[0]?.languageCode ?? 'ta',
  fallbackLng: 'ta',
  interpolation: { escapeValue: false },
});

export default i18n;
