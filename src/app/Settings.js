import EditImageHeader from './../header/EditImageHeader';
import { setAvatar, accountUpdate, clearUpdatingProfileResult } from './../actions';

const React = require('react'),
  ReactRedux = require('react-redux'),
  validator = require('validator'),
  Link = require('react-router').Link,
  bindActionCreators = require('redux').bindActionCreators,
  PasswordDialog = require('./../widgets/PasswordDialog'),
  Header = require('./../app/header');

const Settings = React.createClass({
  getInitialState() {
    return { error: {}, showPasswordDialog: false };
  },
  onDrop(files, type) {
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif => this.props.setAvatar(passwordOrWif, files[0], type),
    });
  },

  save(event) {
    event.preventDefault();
    const user = this.props.auth.user;
    const profileData = {};
    for (const refKeys in this.refs) {
      if (refKeys === 'gender_female' || refKeys === 'gender_male')
        continue;
      const item = this.refs[refKeys];
      if (typeof item.value === 'string' && item.value.length && !this.state.error[refKeys]) {
        profileData[refKeys] = validator.trim(item.value);
      }
    }
    profileData.gender = this.refs.gender_female.checked ? 'female' : 'male';
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif => this.props.accountUpdate(user.name, passwordOrWif, user.memo_key, { profile: profileData }),
    });
  },
  validate(refs) {
    const value = this.refs[refs] && this.refs[refs].value;
    switch (refs) {
      case 'email':
        if (value.length && !validator.isEmail(value)) {
          this.state.error[refs] = refs + ' in not valid';
          this.setState({ error: this.state.error });
        } else {
          this.state.error[refs] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
      case 'website':
        if (value.length && !validator.isURL(value, { require_protocol: true, protocols: ['http', 'https'] })) {
          this.state.error[refs] = refs + ' in not valid';
          this.setState({ error: this.state.error });
        } else {
          this.state.error[refs] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
    }
  },
  closePasswordDialog() {
    this.setState({ showPasswordDialog: false, passwordCallback: undefined });
    this.props.clearUpdatingProfileResult();
  },
  savePassword(passwordOrWif) {
    this.state.passwordCallback(passwordOrWif);
  },
  clearProfile() {
    const user = this.props.auth.user;
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif => this.props.accountUpdate(user.name, passwordOrWif, user.memo_key, { profile: {} }),
    });
  },
  render() {
    const user = this.props.auth.user;
    const profile = typeof user.json_metadata.profile === 'object' ? user.json_metadata.profile : {};
    let passwordDialog;
    if (this.state.showPasswordDialog) {
      passwordDialog = (<PasswordDialog
        isUpdating={user.isUpdatingProfile}
        error={user.isUpdatingProfileError}
        onClose={this.closePasswordDialog}
        onSave={this.savePassword}
      />);
    }
    return (
      <div>
        <Header />
        <EditImageHeader username={user.name} onDrop={this.onDrop} />
        <form className="form pvx mhl">
          <div className="mbl">
            <fieldset className={"form-group"}>
              <input autoFocus type="text" defaultValue={profile.name} placeholder="Name" className="form-control form-control-lg" ref="name" />
            </fieldset>
            <fieldset className={"form-group"}>
              <input type="text" placeholder="First Name" defaultValue={profile.first_name} className="form-control form-control-lg" ref="first_name" />
            </fieldset>
            <fieldset className={"form-group"}>
              <input type="text" placeholder="Last Name" defaultValue={profile.last_name} className="form-control form-control-lg" ref="last_name" />
            </fieldset>
            <fieldset className={'form-group ' + (this.state.error.email ? 'has-danger' : '')}>
              <input type="email" defaultValue={profile.email} placeholder="Email" className="form-control form-control-lg" ref="email" onBlur={this.validate.bind(this, 'email')} />
              <div className="form-control-feedback">{this.state.error.email}</div>
            </fieldset>
            <fieldset className="form-group">
              <label className="custom-control custom-radio">
                <input name="radio" type="radio" value="female" className="custom-control-input" ref="gender_female" defaultChecked={profile.gender === 'female'} />
                <span className="custom-control-indicator" />
                <span className="custom-control-description">Female</span>
              </label>
              <label className="custom-control custom-radio">
                <input name="radio" type="radio" value="male" className="custom-control-input" ref="gender_male" defaultChecked={profile.gender === 'male'} />
                <span className="custom-control-indicator" />
                <span className="custom-control-description">Male</span>
              </label>
            </fieldset>
            <fieldset className={"form-group"}>
              <textarea className="form-control form-control-lg" defaultValue={profile.about} placeholder="About" rows="3" ref="about" />
            </fieldset>
            <fieldset className={'form-group ' + (this.state.error.website ? 'has-danger' : '')}>
              <input type="text" defaultValue={profile.website} placeholder="Website" className="form-control form-control-lg" ref="website" onBlur={this.validate.bind(this, 'website')} />
              <div className="form-control-feedback">{this.state.error.website}</div>
            </fieldset>
            <fieldset className={"form-group"}>
              <input type="text" placeholder="Location" defaultValue={profile.location} className="form-control form-control-lg" ref="location" />
            </fieldset>
          </div>
          <fieldset className="form-group"><button className="btn btn-primary" onClick={this.save}>Save</button></fieldset>
          <p className="ptm"><a href="#" className="errorMessages" onClick={this.clearProfile}>Clear profile</a></p>
        </form>
        {passwordDialog }
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return { auth: state.auth };
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({ setAvatar, accountUpdate, clearUpdatingProfileResult }, dispatch);
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Settings);
