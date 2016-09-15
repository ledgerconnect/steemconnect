var React = require('react'),
  ReactRedux = require('react-redux'),
  {withRouter} = require('react-router'),
  cookie = require('./../../lib/cookie'),
  actions = require('../actions'),
  LastUserSelector = require('../components/LastUserSelector'),
  Login = require('./../auth/Login');

var Wrapper = React.createClass({
  componentWillMount: function () {
    var sca = cookie.get();
    if (sca) { this.props.login(sca.username, sca.wif); }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated && nextProps.location.pathname.indexOf('/login') === 0) {
      nextProps.router.push('/');
    }
  },
  render: function () {
    let {routes} = this.props;
    let nonisAuthenticatedComponent = <Login {...this.props} />
    if (routes.length && routes[1] && routes[1].path && routes[1].path.indexOf('loginlist') > 0) {
      nonisAuthenticatedComponent = <LastUserSelector {...this.props} />
    }

    return (
      <div className='app-wrapper'>
        <div className="main-panel">
          <div className="view-app">
            <img className="logo mbl" src="/img/logo.svg" width="180" />
            {this.props.auth.isAuthenticated && this.props.children}
            {!this.props.auth.isAuthenticated && nonisAuthenticatedComponent}
          </div>
        </div>
      </div>
    );
  }
});

var mapStateToProps = function (state) {
  return { auth: state.auth };
};

var mapDispatchToProps = function (dispatch) {
  return {
    login: function (username, password) { dispatch(actions.login(username, password)); }
  }
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(Wrapper));
