import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
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
        <h4><FormattedMessage id="account" /></h4>
        <p><Link onClick={this.handleLogoutClick}><FormattedMessage id="log_out" /></Link></p>
        <h4><FormattedMessage id="applications" /></h4>
        <p><Link to="/apps"><FormattedMessage id="apps" /></Link></p>
        <p><Link to="/apps/authorized"><FormattedMessage id="authorized_apps" /></Link></p>
        <h4><FormattedMessage id="developers" /></h4>
        <p><Link to="/apps/me"><FormattedMessage id="my_apps" /></Link></p>
        <p><Link to="/docs/oauth2"><FormattedMessage id="oauth2" /></Link></p>
      </div>
    );
  }
}
