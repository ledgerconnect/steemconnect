import React from 'react';
import { Link } from 'react-router';
import { Form, Input, Button } from 'antd';
import './Index.less';

class Index extends React.Component {
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
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div id="header">
          <div id="menu">
            <div className="menu-item logo">
              <object data="img/logo-white.svg" type="image/svg+xml" />
            </div>
            <div className="menu-item">
              <a href="https://busy.org/@busy" target="_blank" rel="noreferrer noopener" className="follow-us">
                <span>Follow us on</span><object fill="#ffffff" data="img/steem.svg" type="image/svg+xml" />
              </a>
            </div>
          </div>
          <h1 className="title">Plateform to Manage Your Steems</h1>
          <h2 className="sub-title">Manage your Steem account and apps through a secure and independant plateform</h2>
          <div className="newsletter">
            <Form onSubmit={this.handleSubmit} layout="inline">
              <Form.Item hasFeedback>
                {getFieldDecorator('email', {
                  rules: [
                    { type: 'email', message: 'Please input a valid email address' },
                    { required: true, message: 'Please input your email address' },
                  ],
                })(
                  <Input placeholder="Email address" />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={this.state.submitting}>Notify Me</Button>
              </Form.Item>
            </Form>
          </div>
          <object data="img/hero.svg" type="image/svg+xml" id="header-bg" />
          <img src="/img/macbook.png" id="macbook-img" alt="macbook" />
        </div>

        <div className="landing-container how-it-works">
          <span className="small-title">How it works</span>
          <h3>
            SteemConnect is a simple identity layer built on top of the Steem blockchain
            that allows you to connect to authorized apps in a secure and convenient way.
          </h3>
        </div>

        <div className="landing-container steem-features-container">
          <div className="steem-features">
            <div className="steem-feature">
              <object data="img/apps.svg" type="image/svg+xml" />
              <strong className="feature-title">Steem Apps</strong>
              <p className="feature-desc">
                Select among various websites and apps using SteemConnect where you can easily log in with confidence
              </p>
            </div>
            <div className="steem-feature">
              <object data="img/account.svg" type="image/svg+xml" />
              <strong className="feature-title">Manage Account</strong>
              <p className="feature-desc">
                Access to authorized websites and apps with your Steem account credentials
                using mechanisms for robust signing and encryption without giving to secure your password/key
              </p>
            </div>
            <div className="steem-feature">
              <object data="img/wallet.svg" type="image/svg+xml" />
              <strong className="feature-title">Steem Wallet</strong>
              <p className="feature-desc">Manage your wallet, check your activity on Steem and edit your Public Steem Profile</p>
            </div>
          </div>
        </div>

        <div className="safe-secure-container">
          <div className="landing-container safe-secure">
            <div>
              <object data="img/lock.svg" type="image/svg+xml" />
            </div>
            <div>
              <span className="small-title">Safe & Secure</span>
              <h3>Your information have never been more secured</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
              </p>
            </div>
          </div>
        </div>

        <div className="landing-container learn-more">
          <span className="small-title">Learn more</span>
          <h3>Become part of the community</h3>
        </div>

        <div className="landing-container project">
          <div className="project-item">
            <object data="img/opensource.svg" type="image/svg+xml" />
            <div className="project-info">
              <h4 className="project-title">It's an Open Source Project</h4>
              <p className="project-desc">
                Check the github repository <br />
                and start digging
              </p>
              <a href="https://github.com/steemit/sc2" target="_blank" rel="noreferrer noopener" className="landing-link">Learn More</a>
            </div>
          </div>
          <div className="project-item">
            <object data="img/code.svg" type="image/svg+xml" />
            <div className="project-info">
              <h4 className="project-title">We Invite Developers</h4>
              <p className="project-desc">
                Start developing your app and rely on SteemConnect
              </p>
              <a href="/" className="landing-link">Register Now</a>
            </div>
          </div>
        </div>

        <div className="get-started-container">
          <div className="landing-container get-started">
            <div>
              <h2>Register to Get Started</h2>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusant doloremque laudantium, totam rem aperiam</p>
            </div>
            <div>
              <a href="/" className="landing-link">Get Started Now</a>
            </div>
          </div>
        </div>

        <div className="landing-container footer-menu">
          <ul>
            <li><Link to="/">About Us</Link></li>
            <li className="separator">|</li>
            <li><Link to="/">Careers</Link></li>
            <li className="separator">|</li>
            <li><Link to="/">Terms of Services</Link></li>
            <li className="separator">|</li>
            <li><Link to="/">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Form.create()(Index);
