var React = require('react'),
  ReactRedux = require('react-redux'),
  actions = require('./../actions'),
  formatter = require('steem/lib/formatter'),
  _ = require('lodash'),
  Loading = require('./../widgets/Loading'),
  Link = require('react-router').Link;

var Sidebar = React.createClass({
  render(){
    var user = this.props.auth.user;
    return (
      <nav className="sidebar">
        <div className="sidebar-header">
          {this.props.app.sidebarIsVisible &&
          <a className="visible-xs hide-sidebar" onClick={() => this.props.hideSidebar()}>
            <i className="icon icon-md icon-menu material-icons">arrow_back</i>
          </a>}
          <div className="me">
            {this.props.auth.isAuthenticated?
              <div>
                <Link to={`/@${user.name}`}>
                  <span className="avatar avatar-sm">
                    <span className="reputation">{formatter.reputation(user.reputation)}</span>
                    <img alt={user.name} src={`https://img.busy6.com/@${user.name}`} />
                  </span>
                </Link>
                <span style={{ clear: 'both', display: 'block' }}>@{user.name}</span>
              </div>:
              <div className="log">
                <a href="https://steemconnect.com/authorize/@busy"><i className="icon icon-lg material-icons pam">lock_outline</i></a>
              </div>}
          </div>
        </div>
        <div className="sidebar-content">
          <ul>
            <li className="title">
              <Link to="/profile"><i className="icon icon-md material-icons">perm_identity</i> Profile</Link>
            </li>
            <li className="title">
              <Link to="/settings"><i className="icon icon-md material-icons">settings</i> Settings</Link>
            </li>
            <li className="title">
              <Link to="/developers"><i className="icon icon-md material-icons">code</i> Developers</Link>
            </li>
            <li className="title">
              <Link to="/logout"><i className="icon icon-md material-icons">lock_open</i> Log Out</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
});

var mapStateToProps = function (state) {
  return {
    app: state.app,
    auth: state.auth
  };
};

var mapDispatchToProps = function (dispatch) {
  return {
    hideSidebar() { dispatch(actions.hideSidebar()); }
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Sidebar);
