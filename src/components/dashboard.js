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
	avatarLoadError: function(event){
		this.props.avatarLoadError();
	},
	render: function(){
		var avatarPlaceholder = <img src={'//img.busy6.com/@'+this.props.auth.user.name} onError={this.avatarLoadError}/>;
		if(this.props.auth.user.avatarNotFound)
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
		avatarLoadError: function(){ dispatch(actions.avatarLoadError()) }
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);