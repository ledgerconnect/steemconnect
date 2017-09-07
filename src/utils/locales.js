import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import ru from 'react-intl/locale-data/ru';
import ko from 'react-intl/locale-data/ko';
import zh from 'react-intl/locale-data/zh';

import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';
import ruTranslations from '../locales/ru.json';
import koTranslations from '../locales/ko.json';
import zhTranslations from '../locales/zh.json';

addLocaleData([...en, ...fr, ...ru, ...zh, ...ko]);

export const translations = {
  en: enTranslations,
  fr: frTranslations,
  ru: ruTranslations,
  ko: koTranslations,
  zh: zhTranslations,
};

export const getAvailableLocale = (appLocale) => {
  let locale = appLocale || 'auto';

  if (typeof navigator !== 'undefined' && appLocale === 'auto') {
    locale =
      navigator.userLanguage ||
      navigator.language ||
      (navigator.languages && navigator.languages[0] ? navigator.languages[0] : 'en');
  }

  if (translations[locale.slice(0, 2)]) {
    return locale.slice(0, 2);
  }

  return 'en';
};

const getTranslations = appLocale => translations[getAvailableLocale(appLocale)];

export default getTranslations;
