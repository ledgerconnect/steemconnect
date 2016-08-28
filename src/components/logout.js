var React = require('react'),
	ReactRedux = require("react-redux"),
	actions = require("../actions");

var Logout = React.createClass({
	componentWillMount: function(){
		this.props.logout();
	},
	render: function(){
		return (
			<div className="main-panel"></div>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		logout: function(){ dispatch(actions.logout()); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Logout);