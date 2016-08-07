var React = require("react"),
	Header = require("./../containers/header");

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<div className="view">
					<img className="logo" src="/img/logo.svg" width="280" />
					<div className="block">
						<fieldset className="form-group">
							<input autoFocus type="text" placeholder="@username" className="form-control form-control-lg" ref="title" />
						</fieldset>
						<fieldset className="form-group">
							<input type="password" className="form-control form-control-lg" ref="body" />
						</fieldset>
						<button className="btn btn-primary" placeholder="Password or WIF" ref="body">Log In</button>
					</div>
					<p><a href="https://steemit.com/recover_account_step_1" target="_blank">Forgot password?</a></p>
					<p>New to Steem? <a href="https://steemit.com/create_account" target="_blank">Sign up now</a></p>
				</div>
			</div>
		);
	}
});