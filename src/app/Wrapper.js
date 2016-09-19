import Login from './../auth/Login';

let React = require('react'),
  ReactRedux = require('react-redux'),
  { withRouter } = require('react-router'),
  cookie = require('./../../lib/cookie'),
  actions = require('../actions');

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
    return (
      <div className="app-wrapper">
        <div className="main-panel">
          <div className="view-app">
            <img alt="logo" className="logo mbl" src="/img/logo.svg" width="180" />
            {this.props.auth.isAuthenticated && this.props.children}
            {!this.props.auth.isAuthenticated && <Login {...this.props} />}
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return { auth: state.auth };
};

const mapDispatchToProps = function (dispatch) {
  return {
    getAccount() { dispatch(actions.getAccount()); },
    login(username, password) { dispatch(actions.login(username, password)); },
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Wrapper);
