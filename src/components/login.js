const React = require('react'),
	ReactRedux = require("react-redux"),
	EditImageHeader = require('./../containers/cover'),
	Loading = require('./../containers/loading'),
	cookie = require('../../lib/cookie'),
	actions = require("../actions");

const LastUserSelector = (props) => {
	return <div>
		{props.lastUserList.map((username, index) => {
			return <EditImageHeader username={username} onClick={() => props.changeselectedUser(username)} key={index} />
		}) }
		<a href="#" onClick={() => props.changeselectedUser(undefined, true) }>Add account</a>
	</div>
}

var Login = React.createClass({
	getInitialState: function () {
		let lastUserList = cookie.get('last_users');
		if (!_.isArray(lastUserList))
			lastUserList = [];

		let addNewToList = lastUserList.length === 0;
		let selectedUser = lastUserList[0];
		return { lastUserList, selectedUser, addNewToList };
	},
	login: function(event){
		event.preventDefault();
		this.props.login(this.refs.username.value, this.refs.passwordOrWif.value);
	},
	demo: function(event){
		event.preventDefault();
		this.props.login('guest123', '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg');
	},
	changeselectedUser:function(username,addNewToList){
		this.setState({
			selectedUser: username,
			addNewToList: addNewToList
		})
	},
	render: function(){
		let {lastUserList, selectedUser, addNewToList} = this.state;
		let inputUser = (<fieldset className="form-group">
			<input autoFocus type="hidden" defaultValue={selectedUser} className="form-control form-control-lg" ref="username" />
		</fieldset>);

		if (addNewToList) {
			inputUser = (<fieldset className="form-group">
				<input autoFocus type="text" defaultValue="" placeholder="Username" className="form-control form-control-lg" ref="username" />
			</fieldset>);
		}

		return (
			<div className="main-panel">
				<div className="view-app">
					<img className="logo mbl" src="/img/logo.svg" width="180" />
					<div className="block">
						{this.props.auth.isFetching && <Loading />}
						{!this.props.auth.isFetching && (addNewToList || selectedUser) &&
						<div>
							<EditImageHeader username={selectedUser} />
							<form className="pvx mhl" onSubmit={this.handleSubmit}>
								{inputUser}
								<fieldset className="form-group">
									<input type="password" placeholder="Password or posting WIF" className="form-control form-control-lg" ref="passwordOrWif" />
								</fieldset>
								{this.props.auth.errorMessage &&
									<ul className="errorMessages">
										<li>{this.props.auth.errorMessage}</li>
									</ul>}
								<fieldset className="form-group"><button className="btn btn-primary" onClick={this.login}>Log In</button></fieldset>
								<fieldset className="form-group"><button className="btn btn-secondary" onClick={this.demo}>Demo</button></fieldset>
								{!addNewToList && <a href="#" onClick={() => this.changeselectedUser(undefined, lastUserList.length === 1) }>Sign in with a different account</a>}
							</form>
						</div>}
						{!this.props.auth.isFetching && (!addNewToList && selectedUser) && <LastUserSelector lastUserList={lastUserList} changeselectedUser={this.changeselectedUser} />}
					</div>
					<p>New to Steem?<a href="https://steemit.com/create_account" target="_blank">Sign up now</a></p>
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