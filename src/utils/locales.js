import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import ko from 'react-intl/locale-data/ko';
import zh from 'react-intl/locale-data/zh';

import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';
import koTranslations from '../locales/ko.json';
import zhTranslations from '../locales/zh.json';

addLocaleData([...en, ...fr, ...zh, ...ko]);

export default {
  en: enTranslations,
  fr: frTranslations,
  ko: koTranslations,
  zh: zhTranslations,
};
