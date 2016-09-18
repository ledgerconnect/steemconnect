const React = require('react'),
	ReactRedux = require('react-redux'),
	EditImageHeader = require('./../header/EditImageHeader'),
	Loading = require('./../widgets/Loading'),
	cookie = require('../../lib/cookie'),
	{Link, withRouter} = require('react-router'),
	actions = require("../actions");

var Login = React.createClass({
	getInitialState: function () {
		let {params} = this.props;
		let lastUserList = cookie.get('last_users');
		if (!_.isArray(lastUserList))
			lastUserList = [];
		let showSignWithDifferent = lastUserList.length !== 0;

		let selectedUser = params.username;
		return { lastUserList, selectedUser, showSignWithDifferent };
	},
	componentWillMount: function () {
		let {lastUserList, selectedUser} = this.state;
        let {location} = this.props;

        if (location.query.redirect == 'false' || selectedUser) {
            return;
        }
        if (lastUserList[0] !== undefined) {
            this.props.router.push({
				pathname: '/login/' + lastUserList[0],
				params: { username: lastUserList[0] }
			});
			this.setState({
				selectedUser: lastUserList[0]
			})
        }
	},
	login: function (event) {
		event.preventDefault();
		this.props.login(this.refs.username.value, this.refs.passwordOrWif.value);
	},
	demo: function (event) {
		event.preventDefault();
		this.props.login('guest123', '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg');
	},
	render: function () {
		let { selectedUser} = this.state;
		return (<section>
			<div className="block">
				{this.props.auth.isFetching && <Loading />}
				{!this.props.auth.isFetching && <div>
					<div>
						{selectedUser && <EditImageHeader username={selectedUser} />}
						<form className="form pvx mhl" onSubmit={this.handleSubmit}>
							<fieldset className="form-group">
								<input autoFocus type={selectedUser ? "hidden" : "text"} placeholder="Username" defaultValue={selectedUser} className="form-control form-control-lg" ref="username" />
							</fieldset>
							<fieldset className="form-group">
								<input type="password" placeholder="Password or posting WIF" className="form-control form-control-lg" ref="passwordOrWif" />
							</fieldset>
							{this.props.auth.errorMessage &&
								<ul className="errorMessages">
									<li>{this.props.auth.errorMessage}</li>
								</ul>}
							<fieldset className="form-group"><button className="btn btn-primary" onClick={this.login}>Log In</button></fieldset>
							<fieldset className="form-group"><button className="btn btn-secondary" onClick={this.demo}>Demo</button></fieldset>
							{this.state.showSignWithDifferent && <Link to={{ pathname: "/loginlist", query: { redirect: false } }}>Sign in with a different account</Link>}
						</form>
					</div>
				</div>}
			</div>
			<div className="mvl">
				<p>New to Steem? <a href="https://steemit.com/create_account" target="_blank">Sign up now</a></p>
				<p><a href="https://steemit.com/recover_account_step_1" target="_blank">Forgot password?</a></p>
			</div>
		</section>
		);
	}
});

var mapStateToProps = function (state) {
	return {
		auth: state.auth
	};
};

var mapDispatchToProps = function (dispatch) {
	return {
		login: function (username, passwordOrWif) { dispatch(actions.login(username, passwordOrWif)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
