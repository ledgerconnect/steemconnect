import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { authenticate } from './actions/auth';
import { setLocale } from './actions/appLocale';
import getTranslations, { getAvailableLocale } from './utils/locales';
import './styles/common.less';

@connect(
  state => ({
    auth: state.auth,
    locale: state.appLocale.locale,
  }),
  dispatch => bindActionCreators({
    authenticate,
    setLocale,
  }, dispatch)
)
export default class Wrapper extends Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    auth: PropTypes.object,
    authenticate: PropTypes.func,
    setLocale: PropTypes.func,
    locale: PropTypes.string,
  }

  componentWillMount() {
    this.props.authenticate();
  }

  render() {
    const { locale: appLocale } = this.props;

    const locale = getAvailableLocale(appLocale);
    const translations = getTranslations(appLocale);
    this.props.setLocale(locale);

    return (
      <IntlProvider locale={locale} messages={translations}>
        {React.cloneElement(
          this.props.children,
          { auth: this.props.auth }
        )}
      </IntlProvider>
    );
  }
}
