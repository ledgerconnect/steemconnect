var React = require('react'),
	ReactRedux = require('react-redux'),
	apps = require('./../../lib/apps');

var Dashboard = React.createClass({
	render: function () {
		// var app = apps[this.props.params.app];
		let appName = this.props.params.app;
		let {appAuthor, clientId, redirect_uri, scope} = this.props.location.query;
		console.log(appAuthor, clientId, redirect_uri, scope, appName);
		return (
			<div className="block">
				<div className="mbl"><img src={'/img/app/' + appName + '.svg'} width="70" /></div>
				<p>The app <b>{appName}</b> is requesting permission to do the following: </p>
				<ul className="mbm">
					<li><i className="icon icon-sm material-icons">check_box</i> Verify your identity</li>
				</ul>
				<a href={`/app/authorize?clientId=${clientId}&redirect_uri=${redirect_uri}&appAuthor=${appAuthor}&appName=${appName}`} className="btn btn-primary mbm" ref="body">Continue as @{this.props.auth.user.name}</a>
			</div>
		);
	}
});

var mapStateToProps = function (state) {
	return { auth: state.auth };
};

module.exports = ReactRedux.connect(mapStateToProps)(Dashboard);
