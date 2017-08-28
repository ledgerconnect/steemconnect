import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import enTranslations from '../locales/en.json';

addLocaleData([...en]);

export default {
  en: enTranslations,
};
