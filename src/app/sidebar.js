import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import formatter from 'steem/lib/formatter';
import { Link } from 'react-router';
import { hideSidebar } from './appAction';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { menu: 'default' };
  }
  render() {
    const user = this.props.auth.user;
    return (
      <nav className="sidebar">
        <div className="sidebar-header">
          {this.props.app.sidebarIsVisible &&
            <a className="visible-xs hide-sidebar" onClick={() => this.props.hideSidebar()}>
              <i className="icon icon-md icon-menu material-icons">arrow_back</i>
            </a>}
          <div className="me">
            <Link to={`/@${user.name}`}>
              <span className="avatar avatar-sm">
                <span className="reputation">{formatter.reputation(user.reputation) }</span>
                <img alt={user.name} src={`https://img.busy6.com/@${user.name}`} />
              </span>
            </Link>
            <span style={{ clear: 'both', display: 'block' }}> @{user.name} <a onClick={() => this.setState({ menu: 'settings' })}><i className="icon icon-xs material-icons">settings</i></a></span>
          </div>
        </div>
        <div className="sidebar-content">
          {this.state.menu === 'default' &&
            <ul>
              <li className="title">
                <Link to="/"><i className="icon icon-md material-icons">show_chart</i> Dashboard</Link>
              </li>
              <li className="title">
                <Link to="/activity"><i className="icon icon-md material-icons">track_changes</i> Activity</Link>
              </li>
              <li className="title">
                <Link to="/payments"><i className="icon icon-md material-icons">payment</i> Payments</Link>
              </li>
              <li className="title">
                <Link to="/apps"><i className="icon icon-md material-icons">apps</i> Apps</Link>
              </li>
            </ul>}
          {this.state.menu === 'settings' &&
            <ul>
              <li className="title">
                <Link to="/profile"><i className="icon icon-md material-icons">perm_identity</i> Profile</Link>
              </li>
              <li className="title">
                <Link to="/#settings"><i className="icon icon-md material-icons">settings</i> Settings</Link>
              </li>
              <li className="title">
                <Link to="/developers"><i className="icon icon-md material-icons">code</i> Developers</Link>
              </li>
              <li className="title">
                <Link to="/logout"><i className="icon icon-md material-icons">lock_open</i> Log Out</Link>
              </li>
            </ul>}
        </div>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  app: PropTypes.shape({
    sidebarIsVisible: PropTypes.bool,
  }),
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  }),
  hideSidebar: PropTypes.func,
};

const mapStateToProps = state => ({
  app: state.app,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  hideSidebar() { dispatch(hideSidebar()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
