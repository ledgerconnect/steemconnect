var React = require('react'),
  ReactRedux = require('react-redux'),
  cookie = require('./../../lib/cookie'),
  actions = require('../actions'),
  Login = require('./../components/login');

var Wrapper = React.createClass({
  componentWillMount: function(){
    var sca = cookie.get();
    if (sca) { console.log(sca); this.props.login(sca.username, sca.wif); }
  },
  render: function(){
    return (
      <div className='app-wrapper'>
        {this.props.auth.isAuthenticated && this.props.children}
        {!this.props.auth.isAuthenticated && <Login />}
      </div>
    );
  }
});

var mapStateToProps = function(state){
  return {auth: state.auth};
};

var mapDispatchToProps = function(dispatch){
  return {
    login: function(username, password){ dispatch(actions.login(username, password)); }
  }
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Wrapper);