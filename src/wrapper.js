import Login from './auth/Login';

let React = require('react'),
  ReactRedux = require('react-redux'),
  cookie = require('./../lib/cookie'),
  actions = require('./actions'),
  Sidebar = require('./app/sidebar');

const Wrapper = React.createClass({
  componentWillMount() {
    this.props.getAccount();
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated && nextProps.location.pathname.indexOf('/login') === 0) {
      nextProps.router.push('/');
    }
  },
  render() {
    var className = (!this.props.app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    return (
    !this.props.auth.isAuthenticated ? <Login {...this.props} /> : <div className={className}>
        <Sidebar />
        <div className="main-panel">
          <div className="view-app">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return {
    auth: state.auth,
    app: state.app,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    getAccount() { dispatch(actions.getAccount()); },
    login(username, password) { dispatch(actions.login(username, password)); },
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Wrapper);
