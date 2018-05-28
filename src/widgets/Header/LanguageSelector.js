import React, { PropTypes } from 'react';
import { Button, Popover } from 'antd';
import locales from '../../../helpers/locales.json';

const LanguageItem = ({ setLocale, locale }) => (
  <li>
    <button onClick={() => setLocale(locale)}>
      {locales[locale]}
    </button>
  </li>
);
LanguageItem.propTypes = {
  setLocale: PropTypes.func,
  locale: PropTypes.string,
};

const LanguageSelector = ({ setLocale }) => (
  <Popover
    placement="bottom"
    content={
      <ul className="lp-language-select">
        {Object.keys(locales).map(locale =>
          <LanguageItem locale={locale} setLocale={setLocale} />)}
      </ul>
    }
    trigger="click"
  >
    <Button className="language-switch-btn"><i className="iconfont icon-language" /></Button>
  </Popover>

);
LanguageSelector.propTypes = {
  setLocale: PropTypes.func.isRequired,
};
export default LanguageSelector;
