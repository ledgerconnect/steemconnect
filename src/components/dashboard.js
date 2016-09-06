var React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	Steem = require("steem"),
	{Link} = require('react-router');

var Dashboard = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<div className="view-app">
					<div className="block">
						<div className="avatar">
						{_.has(this.props.auth.user, 'reputation') && <div>{Steem.formatter.reputation(this.props.auth.user.reputation)}</div>}
						<img src={`https://img.busy6.com/@${this.props.auth.user.name}`} /></div>
						<h1>@{this.props.auth.user.name}</h1>
					</div>
				</div>
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {auth: state.auth};
};

module.exports = ReactRedux.connect(mapStateToProps)(Dashboard);