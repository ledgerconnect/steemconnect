import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { authenticate } from './actions/auth';
import locales from './utils/locales';
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
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    auth: PropTypes.object,
    authenticate: PropTypes.func,
    locale: PropTypes.string,
  }

  componentWillMount() {
    this.props.authenticate();
  }

  render() {
    const { locale } = this.props;
    return (
      <IntlProvider locale={locale} messages={locales[locale]}>
        {React.cloneElement(
          this.props.children,
          { auth: this.props.auth }
        )}
      </IntlProvider>
    );
  }
}
