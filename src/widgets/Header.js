import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import SteemitAvatar from './SteemitAvatar';
import './Header.less';
import { logout, authenticate } from '../actions/auth';

@connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    logout,
    authenticate,
  }, dispatch)
)
export default class Header extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    authenticate: PropTypes.func.isRequired,
  };

  handleLogoutClick = () => {
    this.props.logout();
  };

  changeAccount = ({ key }) => {
    // eslint-disable-next-line no-shadow
    const { authenticate, username } = this.props;
    if (key !== username && localStorage && localStorage.getItem('accounts')) {
      const accounts = JSON.parse(localStorage.getItem('accounts'));
      const account = accounts.find(acc => acc.username === key);
      localStorage.setItem('token', account.token);
      authenticate();
    }
  }

  render() {
    const { username } = this.props;
    let accounts = [];
    if (localStorage && localStorage.getItem('accounts')) {
      accounts = JSON.parse(localStorage.getItem('accounts'));
    }
    return (
      <div className="Header container">
        <div className="Header__log">
          {username &&
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            overlay={
              <Menu className="switch-account-menu" onClick={this.changeAccount}>
                <Menu.Item key="switch-account-active" className="active">
                  <SteemitAvatar username={username} size="72" /><span className="username">{username}</span>
                </Menu.Item>
                {accounts.filter(account => account.username !== username).map(account =>
                  <Menu.Item key={account.username}>
                    <SteemitAvatar username={account.username} size="36" /><span className="username">{account.username}</span>
                  </Menu.Item>
                )}
                <Menu.Item key="switch-account-actions" className="actions" disabled>
                  <Link to="/login">
                    <FormattedMessage id="add_account" />
                  </Link>
                  <Link onClick={this.handleLogoutClick}>
                    <FormattedMessage id="log_out" />
                  </Link>
                </Menu.Item>
              </Menu>
            }
          >
            <a className="ant-dropdown-link" href={undefined}>
              <SteemitAvatar username={username} />
            </a>
          </Dropdown>
          }
          {!username &&
          <div>
            <Link to="/login"><FormattedMessage id="log_in" /></Link>
          </div>
          }
        </div>
      </div>
    );
  }
}
