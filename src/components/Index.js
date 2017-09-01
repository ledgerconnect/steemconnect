import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Button } from 'antd';
import './Index.less';

class Index extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      validateFieldsAndScroll: PropTypes.func,
      getFieldDecorator: PropTypes.func,
    }),
    intl: PropTypes.shape({
      formatMessage: PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitting: true });
    this.props.form.validateFieldsAndScroll(() => {
      this.setState({ submitting: false });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
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
                <a href="https://steemit.com/@steemconnect" target="_blank" rel="noreferrer noopener" className="follow-us">
                  <span><FormattedMessage id="lp_follow_us" /></span>
                  <object fill="#ffffff" data="img/steem.svg" type="image/svg+xml" />
                </a>
              </div>
            </div>
            <div className="hero">
              <h1 className="title"><FormattedMessage id="lp_hero_title" /></h1>
              <h2 className="sub-title"><FormattedMessage id="lp_hero_description" /></h2>
              <div className="newsletter">
                <Form onSubmit={this.handleSubmit} layout="inline">
                  <Form.Item hasFeedback>
                    {getFieldDecorator('email', {
                      rules: [
                        { type: 'email', message: this.props.intl.formatMessage({ id: 'error_invalid_email' }) },
                        { required: true, message: this.props.intl.formatMessage({ id: 'error_empty_email' }) },
                      ],
                    })(
                      <Input placeholder={this.props.intl.formatMessage({ id: 'email_address' })} />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={this.state.submitting} className="lp-link">
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
              <a href="/" className="lp-link">
                <FormattedMessage id="lp_subscribe_button" />
              </a>
            </div>
          </div>
        </div>

        <div className="lp-container footer-menu">
          <ul>
            <li><Link to="/"><FormattedMessage id="about_us" /></Link></li>
            <li className="separator">|</li>
            <li><Link to="/"><FormattedMessage id="terms" /></Link></li>
            <li className="separator">|</li>
            <li><Link to="/"><FormattedMessage id="privacy" /></Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Form.create()(
  injectIntl(Index)
);
