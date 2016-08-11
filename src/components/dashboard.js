var React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	parser = require('./../../lib/parser'),
	Link = require('react-router').Link;

var Dashboard = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<div className="view-app">
					<Link to="/" className="mal"><img className="logo" src="/img/logo.svg" width="160" /></Link>
					<div className="block">
						<h1>Welcome @{this.props.auth.user.name}</h1>
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