import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Icon, Menu, Dropdown } from 'antd';
import SteemitAvatar from '../SteemitAvatar';
import LanguageSelector from './LanguageSelector';
import { authenticate, logout } from '../../actions/auth';
import { setLocale } from '../../actions/appLocale';
import { getAccounts } from '../../utils/localStorage';
import './Header.less';

@connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    logout,
    authenticate,
    setLocale,
  }, dispatch)
)
export default class index extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    authenticate: PropTypes.func.isRequired,
    auth: PropTypes.shape({}).isRequired,
    setLocale: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  handleLogoutClick = () => {
    // eslint-disable-next-line no-shadow
    const { logout, auth: { user: { name } } } = this.props;
    let accounts = getAccounts();
    if (accounts.length > 0) {
      accounts = accounts.filter(acc => acc.username !== name);
      localStorage.setItem('accounts', JSON.stringify(accounts));
    }
    logout();
  };

  changeAccount = ({ key }) => {
    // eslint-disable-next-line no-shadow
    const { authenticate, auth: { user: { name } } } = this.props;
    const accounts = getAccounts();
    if (key !== name && accounts.length > 0) {
      const account = accounts.find(acc => acc.username === key);
      localStorage.setItem('token', account.token);
      authenticate();
    }
  }

  render() {
    // eslint-disable-next-line no-shadow
    const { auth, setLocale, type } = this.props;
    const accounts = getAccounts();
    let user = '';
    if (auth && auth.user && auth.user.json_metadata) {
      try {
        const metadata = JSON.parse(auth.user.json_metadata);
        if (metadata && metadata.profile && metadata.profile.name) {
          user = metadata.profile.name;
        } else {
          user = auth.user.name;
        }
      } catch (e) {
        // Do nothing
      }
    }
    return (
      <div className={`Header ${type}`}>
        <Link to="/" className="logo">
          {type === 'homepage' && <object data="img/logo-white.svg" type="image/svg+xml" />}
          {type !== 'homepage' && <object data="img/logo.svg" type="image/svg+xml" />}
        </Link>
        <div className="right-menu">
          {auth.user.name &&
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            overlay={
              <Menu className="switch-account-menu" onClick={this.changeAccount}>
                <Menu.Item key="switch-account-active" className="active">
                  <SteemitAvatar username={auth.user.name} size="72" />
                  <div className="account-information">
                    <span className="account-name">{user}</span>
                    <span className="username">@{auth.user.name}</span>
                    <Link onClick={this.handleLogoutClick} className="logout">
                      <FormattedMessage id="log_out" />
                    </Link>
                  </div>
                </Menu.Item>
                {accounts.filter(account => account.username !== auth.user.name).map(account =>
                  <Menu.Item key={account.username}>
                    <SteemitAvatar username={account.username} size="36" /><span className="other-account">{account.username}</span>
                  </Menu.Item>
                )}
                <Menu.Item key="switch-account-actions" className="actions" disabled>
                  <Link to="/login">
                    <FormattedMessage id="use_another_account" />
                  </Link>
                </Menu.Item>
              </Menu>
            }
          >
            <a className="ant-dropdown-link" href={undefined}>
              {type !== 'homepage' && <span className="account-name">{auth.user.name}</span>}
              <SteemitAvatar username={auth.user.name} /><Icon type="down" />
            </a>
          </Dropdown>
          }
          {!auth.user.name &&
          <Link to="/login" className="login-link"><FormattedMessage id="log_in" /></Link>
          }
          <LanguageSelector setLocale={setLocale} />
        </div>
      </div>
    );
  }
}
