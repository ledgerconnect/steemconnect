var React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	Dropzone = require('react-dropzone'),
	actions = require("../actions"),
	Link = require('react-router').Link;

var Dashboard = React.createClass({
	onDrop: function(files){
		this.props.setAvatar(this.props.auth.user.name, files[0]);
	},
	changeAvatar: function(event){
		this.props.changeAvatar();
	},
	render: function(){
		var avatarSrc = this.props.auth.user.avatar || ('//img.busy6.com/@' + this.props.auth.user.name);
		var avatarPlaceholder = (<div>
			<img className="avatar-img" src={avatarSrc} onError={this.changeAvatar}/><br />
			<button className="change-avatar-btn" onClick={this.changeAvatar}>Change avatar</button>
		</div>);
		if(this.props.auth.user.selectAvatar)
			avatarPlaceholder = (
						<Dropzone className="avatar-dropzone" onDrop={this.onDrop} accept='image/*'>
							<div>Try dropping some files here, or click to select files to upload.</div>
						</Dropzone>);
		return (
			<div className="main-panel">
				<Header />
				<div className="view-app">
					<Link to="/" className="mal"><img className="logo" src="/img/logo.svg" width="160" /></Link>
					<div className="block">
						<h1>Welcome @{this.props.auth.user.name}</h1>
						{avatarPlaceholder}
					</div>
				</div>
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {auth: state.auth};
};

var mapDispatchToProps = function(dispatch){
	return {
		setAvatar: function(username, img){ dispatch(actions.setAvatar(username, img)); },
		changeAvatar: function(){ dispatch(actions.changeAvatar()) }
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);