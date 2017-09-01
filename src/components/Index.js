import React, { PropTypes } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, Popover } from 'antd';
import * as actions from '../actions/appLocale';
import './Index.less';

const LanguageItem = ({ setLocale, locale }) => (
  <li>
    <button onClick={() => setLocale(locale)}>
      <FormattedMessage id={locale} />
    </button>
  </li>
);
LanguageItem.propTypes = {
  setLocale: PropTypes.func,
  locale: PropTypes.string,
};

@connect(
  state => ({
    locale: state.appLocale.locale,
  }),
  dispatch =>
    bindActionCreators(
      {
        setLocale: actions.setLocale,
      },
      dispatch,
    ),
)
class Index extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      validateFieldsAndScroll: PropTypes.func,
    }),
    intl: PropTypes.shape({
      formatMessage: PropTypes.func,
    }),
    setLocale: PropTypes.func,
    locale: PropTypes.func,
  }
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form: { getFieldDecorator }, setLocale, locale } = this.props;
    return (
      <div>
        <div id="header">
          <img src="/img/macbook.png" id="macbook-img" alt="macbook" />
          <object data="img/hero.svg" type="image/svg+xml" id="header-bg" />
          <div className="lp-container">
            <div id="menu">
              <div className="menu-item logo">
                <object data="img/logo-white.svg" type="image/svg+xml" />
              </div>
              <div className="menu-item">
                <Popover
                  placement="bottom"
                  content={
                    <ul className="lp-language-select">
                      <LanguageItem locale="en" setLocale={setLocale} />
                      <LanguageItem locale="fr" setLocale={setLocale} />
                      <LanguageItem locale="ko" setLocale={setLocale} />
                      <LanguageItem locale="zh" setLocale={setLocale} />
                    </ul>
                  }
                  trigger="click"
                >
                  <Button><FormattedMessage id={locale} /></Button>
                </Popover>
              </div>
            </div>
            <div className="hero">
              <h1 className="title"><FormattedMessage id="lp_hero_title" /></h1>
              <h2 className="sub-title"><FormattedMessage id="lp_hero_description" /></h2>
              <div className="newsletter">
                <Form
                  onSubmit={() => {}}
                  action="//busy.us14.list-manage.com/subscribe/post?u=c8daffe293678b527521abf65&amp;id=0a6cefe541"
                  method="post"
                  name="mc-embedded-subscribe-form"
                  target="_blank"
                  className="ant-form ant-form-inline"
                  layout="inline"
                >
                  <Form.Item hasFeedback>
                    <input type="hidden" name="b_c8daffe293678b527521abf65_0a6cefe541" />
                    {getFieldDecorator('email', {
                      rules: [
                        { type: 'email', message: this.props.intl.formatMessage({ id: 'error_invalid_email' }) },
                        { required: true, message: this.props.intl.formatMessage({ id: 'error_empty_email' }) },
                      ],
                      className: 'hero_form_item',
                    })(
                      <Input name="EMAIL" placeholder={this.props.intl.formatMessage({ id: 'email_address' })} />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" name="subscribe" htmlType="submit" className="lp-link">
                      <FormattedMessage id="signup" />
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-container how-it-works">
          <span className="small-title">
            <FormattedMessage id="lp_section_1_tag" />
          </span>
          <h3><FormattedMessage id="lp_section_1_title" /></h3>
        </div>

        <div className="steem-features-container">
          <div className="lp-container steem-features">
            <div className="steem-feature">
              <object data="img/apps.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_1_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_1_description" />
              </p>
            </div>
            <div className="steem-feature">
              <object data="img/account.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_2_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_2_description" />
              </p>
            </div>
            <div className="steem-feature">
              <object data="img/wallet.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_3_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_3_description" />
              </p>
            </div>
          </div>
        </div>

        <div className="safe-secure-container">
          <div className="lp-container safe-secure">
            <div>
              <object data="img/lock.svg" type="image/svg+xml" />
            </div>
            <div>
              <span className="small-title">
                <FormattedMessage id="lp_section_2_tag" />
              </span>
              <h3><FormattedMessage id="lp_section_2_title" /></h3>
              <p><FormattedMessage id="lp_section_2_description" /></p>
            </div>
          </div>
        </div>

        <div className="lp-container learn-more">
          <span className="small-title">
            <FormattedMessage id="lp_section_3_tag" />
          </span>
          <h3><FormattedMessage id="lp_section_3_title" /></h3>
        </div>

        <div className="lp-container project">
          <div className="project-item">
            <object data="img/opensource.svg" type="image/svg+xml" />
            <div>
              <h4 className="project-title"><FormattedMessage id="lp_opensource_title" /></h4>
              <p><FormattedMessage id="lp_opensource_description" /></p>
              <a href="https://github.com/steemit/sc2" target="_blank" rel="noreferrer noopener" className="lp-link">
                <FormattedMessage id="lp_opensource_button" />
              </a>
            </div>
          </div>
          <div className="project-item">
            <object data="img/code.svg" type="image/svg+xml" />
            <div>
              <h4 className="project-title"><FormattedMessage id="lp_developers_title" /></h4>
              <p><FormattedMessage id="lp_developers_description" /></p>
              <a href="/" className="lp-link"><FormattedMessage id="lp_developers_button" /></a>
            </div>
          </div>
        </div>

        <div className="get-started-container">
          <div className="lp-container get-started">
            <div>
              <h2><FormattedMessage id="lp_subscribe_title" /></h2>
              <p><FormattedMessage id="lp_subscribe_description" /></p>
            </div>
            <div>
              <a href="http://eepurl.com/c1PtNX" rel="noopener noreferrer" target="_blank" className="lp-link">
                <FormattedMessage id="lp_subscribe_button" />
              </a>
            </div>
          </div>
        </div>

        <div className="lp-container footer-menu">
          <ul>
            <li><FormattedMessage id="lp_footer" /></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Form.create()(
  injectIntl(Index)
);
