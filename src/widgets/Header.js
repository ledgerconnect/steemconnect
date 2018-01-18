import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Avatar from './Avatar';
import './Header.less';
import { logout } from '../actions/auth';

@connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    logout,
  }, dispatch)
)
export default class Header extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
  };

  handleLogoutClick = () => {
    this.props.logout();
  };

  render() {
    const { username } = this.props;
    return (
      <div className="Header">
        <Link to="/" className="logo">
          <object data="/img/logo.svg" type="image/svg+xml" id="logo" />
        </Link>
        <div className="Header__log">
          {username &&
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <Link onClick={this.handleLogoutClick}>
                    <FormattedMessage id="log_out" />
                  </Link>
                </Menu.Item>
              </Menu>
            }
          >
            <a className="ant-dropdown-link" href={undefined}>
              <Avatar username={username} /> <Icon type="down" />
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
