var React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	Dropzone = require('react-dropzone'),
	actions = require("../actions"),
	Link = require('react-router').Link;

var Dashboard = React.createClass({
	onDrop: function (files) {
		this.props.setAvatar(this.props.auth.user.name, files[0]);
	},
	changeAvatar: function (event) {
		this.props.changeAvatar();
	},
	save: function (event) {
		event.preventDefault();
		var profileData = {};
		for (var _item in this.refs) {
			if (_item === 'gender_female' || _item === 'gender_male')
				continue;
			var item = this.refs[_item];
			if (typeof item.value === 'string' && item.value.length) {
				profileData[_item] = item.value
			}
		}
		profileData.gender = this.refs.gender_female.checked ? 'female' : 'male';
		var password = prompt('Enter your password to update.');
		this.props.updateProfile(password, profileData);
	},
	render: function () {
		const user = this.props.auth.user;
		var profile = typeof user.profile === 'object' ? user.profile : {};

		var avatarSrc = '//img.busy6.com/@' + user.name + '?cb=' + Math.floor(Math.random() * 10000000000);
		var avatarPlaceholder = (<div>
			<img className="avatar-img" src={avatarSrc} onError={this.changeAvatar}/><br />
			<button className="change-avatar-btn" onClick={this.changeAvatar}>Change avatar</button>
		</div>);
		if (user.selectAvatar)
			avatarPlaceholder = (
				<Dropzone className="avatar-dropzone" onDrop={this.onDrop} accept='image/*'>
					<div>Try dropping some files here, or click to select files to upload.</div>
				</Dropzone>);

		return (
			<div className="main-panel">
				<Header />
				<div className="view-app">
					<div className="block">
						<form>
							{avatarPlaceholder}
							<fieldset className="form-group">
								<input autoFocus type="text" defaultValue={profile.name} placeholder="ned stark" className="form-control form-control-lg" ref="name" />
							</fieldset>
							<fieldset className="form-group">
								<input type="email" defaultValue={profile.email} placeholder="ned@thrones.io" className="form-control form-control-lg" ref="email" />
							</fieldset>
							<fieldset className="form-group">
								<label className="custom-control custom-radio">
									<input name="radio" type="radio" value="male" className="custom-control-input" ref="gender_male" defaultChecked={profile.gender === 'male'}/>
									<span className="custom-control-indicator"></span>
									<span className="custom-control-description">male</span>
								</label>
								<label className="custom-control custom-radio">
									<input name="radio" type="radio" value="female" className="custom-control-input" ref="gender_female" defaultChecked={profile.gender === 'female'}/>
									<span className="custom-control-indicator"></span>
									<span className="custom-control-description">female</span>
								</label>
							</fieldset>
							<fieldset className="form-group">
								<textarea className="form-control form-control-lg" defaultValue={profile.about} placeholder="King in the north" rows="3" ref="about"></textarea>
							</fieldset>
							<fieldset className="form-group">
								<input type="text" placeholder="Ned" defaultValue={profile.first_name} className="form-control form-control-lg" ref="first_name" />
							</fieldset>
							<fieldset className="form-group">
								<input type="text" placeholder="Stark" defaultValue={profile.last_name} className="form-control form-control-lg" ref="last_name" />
							</fieldset>
							<fieldset className="form-group">
								<input type="text" placeholder="Winterfell" defaultValue={profile.location} className="form-control form-control-lg" ref="location" />
							</fieldset>
							<fieldset className="form-group">
								<input type="text"  defaultValue={profile.website} placeholder="website: https://steemconnect.com" className="form-control form-control-lg" ref="website" />
							</fieldset>
							<fieldset className="form-group"><button className="btn btn-primary" onClick={this.save}>Save</button></fieldset>
						</form>
					</div>
				</div>
			</div>
		);
	}
});

var mapStateToProps = function (state) {
	return { auth: state.auth };
};

var mapDispatchToProps = function (dispatch) {
	return {
		setAvatar: function (username, img) { dispatch(actions.setAvatar(username, img)); },
		changeAvatar: function () { dispatch(actions.changeAvatar()) },
		updateProfile: function (passwordOrWif, profileData) { dispatch(actions.updateProfile(passwordOrWif, profileData)) }
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);