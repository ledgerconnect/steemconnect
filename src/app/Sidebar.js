import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { hideSidebar } from './appAction';
import { logout } from '../actions';
import Avatar from '../widgets/Avatar';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const user = this.props.auth.user;
    return (
      <nav className="sidebar">
        <div className="sidebar-header">
          <a className="hide-sidebar" onClick={() => this.props.hideSidebar()}>
            <i className="icon icon-md icon-menu material-icons">arrow_back</i>
          </a>
          <div className="me">
            <Link to="profile">
              <Avatar sm username={user.name} reputation={user.reputation} />
            </Link>
            <span style={{ clear: 'both', display: 'block' }}> @{user.name}</span>
          </div>
        </div>
        <div className="sidebar-content">
          <ul>
            <li className="title">
              <Link to="/profile"><i className="icon icon-md material-icons">perm_identity</i> Profile</Link>
            </li>
            <li className="title">
              <Link to="/developers"><i className="icon icon-md material-icons">code</i> Developers</Link>
            </li>
            <li className="title">
              <a href="/logout"><i className="icon icon-md material-icons">lock_open</i> Log Out</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  app: state.app,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  hideSidebar() { dispatch(hideSidebar()); },
  logout() { dispatch(logout()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
