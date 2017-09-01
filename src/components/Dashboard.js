import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { logout } from '../actions/auth';

@connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    logout,
  }, dispatch)
)
export default class Login extends Component {
  static propTypes = {
    logout: PropTypes.func,
  }

  handleLogoutClick = () => {
    this.props.logout();
  };

  render() {
    return (
      <div className="container my-5">
        <h4>Account</h4>
        <p><Link onClick={this.handleLogoutClick}>Log Out</Link></p>
        <h4>Applications</h4>
        <p><Link to="/apps">Apps</Link></p>
        <p><Link to="/apps/authorized">Authorized Apps</Link></p>
        <h4>Developers</h4>
        <p><Link to="/apps/me">My Apps</Link></p>
        <p><Link to="/docs/oauth2">OAuth2</Link></p>
      </div>
    );
  }
}
