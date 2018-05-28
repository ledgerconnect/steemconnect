import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { authenticate } from './actions/auth';
import getTranslations, { getAvailableLocale } from './utils/locales';
import './styles/common.less';

@connect(
  state => ({
    auth: state.auth,
    locale: state.appLocale.locale,
  }),
  dispatch => bindActionCreators({
    authenticate,
  }, dispatch)
)
export default class Wrapper extends Component {
  static propTypes = {
    children: PropTypes.shape(),
    auth: PropTypes.shape(),
    authenticate: PropTypes.func,
    locale: PropTypes.string,
  }

  componentWillMount() {
    this.props.authenticate();
  }

  render() {
    const { locale: appLocale } = this.props;

    const locale = getAvailableLocale(appLocale);
    const translations = getTranslations(appLocale);

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
