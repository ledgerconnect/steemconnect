var React = require('react'),
	ReactRedux = require('react-redux'),
	withRouter = require('react-router').withRouter,
	actions = require("../actions");

var Logout = React.createClass({
	componentWillMount: function(){
		this.props.logout();
		this.props.router.replace('/');
	},
	render: function(){
		return null;
	}
});

var mapStateToProps = function(state){
	return {};
};

var mapDispatchToProps = function(dispatch){
	return {
		logout: function(){ dispatch(actions.logout()); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(withRouter(Logout));