var React = require('react'),
  ReactRedux = require('react-redux'),
  Login = require('./../components/login');

var Wrapper = React.createClass({
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

module.exports = ReactRedux.connect(mapStateToProps)(Wrapper);