var React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	Link = require('react-router').Link;

var Dashboard = React.createClass({
	render: function(){
		var app = this.props.params.app;
		return (
			<div className="main-panel">
				<div className="view">
					<img className="logo mbl" src="/img/logo.svg" width="220" />
					<div className="block">
						<div className="mbl"><img src={'/img/app/' + app + '.svg'} width="70" /></div>
						<p>The app <b>@{app}</b> is requesting permission to do the following:</p>
						<ul className="mbm">
							<li><i className="icon icon-sm material-icons">check_box</i> Verify your identity</li>
						</ul>
						<a href={'http://localhost:3000/callback?token=' + this.props.auth.user.token} className="btn btn-primary mbm" ref="body">Continue as @{this.props.auth.user.name}</a>
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