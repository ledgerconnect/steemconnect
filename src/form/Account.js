var React = require("react"),
	ReactRedux = require("react-redux");

var Account = React.createClass({
	render: function(){
		return (
			<div className="mod-main">
				<div className="mod-header"><h2>Account</h2></div>
				<div className="mod-content">
					<div className="text-xs-center">
						<img className="avatar mbm" src={this.props.auth.user.picture_large} width="100" height="100" />
						<h1 className="mbl">{this.props.auth.user.name}</h1>
						<h2><a href="#">Settings</a></h2>
						<h2><a href="/logout">Logout</a></h2>
					</div>
				</div>
			</div>);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth
	};
};

var mapDispatchToProps = function(dispatch){
	return {}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Account);