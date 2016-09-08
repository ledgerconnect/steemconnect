const React = require('react'),
	ReactRedux = require("react-redux"),
	EditImageHeader = require('./../containers/edit-image-header'),
	cookie = require('../../lib/cookie'),
	actions = require("../actions");

var Login = React.createClass({
	login: function(event){
		event.preventDefault();
		this.props.login(this.refs.username.value, this.refs.passwordOrWif.value);
	},
	demo: function(event){
		event.preventDefault();
		this.props.login('guest123', '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg');
	},
	render: function(){
		let userCookie = cookie.get('last_user');
		let username = userCookie.username || 'steemconnect';
		var avatar = '//img.busy6.com/@' + username + '?cb=' + Math.floor(Math.random() * 10000000000);
		var cover = '//img.busy6.com/@' + username + '/cover?cb=' + Math.floor(Math.random() * 10000000000);
		return (
			<div className="main-panel">
				<div className="view-app">
					<img className="logo mbl" src="/img/logo.svg" width="180" />
					<div className="block">
						<EditImageHeader avatar={avatar} cover={cover}  />
						<form className="pvl mhl" onSubmit={this.handleSubmit}>
							{userCookie? <h1>@{username}</h1>:
							<fieldset className="form-group">
								<input autoFocus type="text" placeholder="Username" className="form-control form-control-lg" ref="username" />
							</fieldset>}
							<fieldset className="form-group">
								<input type="password" placeholder="Password or posting WIF" className="form-control form-control-lg" ref="passwordOrWif" />
							</fieldset>
							{this.props.auth.errorMessage &&
							<ul className="errorMessages">
								<li>{this.props.auth.errorMessage}</li>
							</ul>}
							<fieldset className="form-group"><button className="btn btn-primary" onClick={this.login}>Log In</button></fieldset>
							<fieldset className="form-group"><button className="btn btn-secondary" onClick={this.demo}>Demo</button></fieldset>
					</form>
					</div>
					<p>New to Steem? <a href="https://steemit.com/create_account" target="_blank">Sign up now</a></p>
					<p><a href="https://steemit.com/recover_account_step_1" target="_blank">Forgot password?</a></p>
				</div>
			</div>
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
		login: function(username, passwordOrWif){ dispatch(actions.login(username, passwordOrWif)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Login);