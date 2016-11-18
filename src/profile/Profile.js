import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import { each } from 'lodash';
import AvatarUpdate from './AvatarUpdate';
import { setAvatar, accountUpdate, clearUpdatingResult } from '../actions';
import PasswordDialog from '../widgets/PasswordDialog';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = { error: {}, showPasswordDialog: false };
  }

  onDrop = (files, type) => {
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif => this.props.setAvatar(passwordOrWif, files[0], type),
    });
  }

  save = (event) => {
    event.preventDefault();
    const user = this.props.auth.user;
    const profileData = {};
    const refs = this.refs;
    each(refs, (item, refKeys) => {
      if (refKeys !== 'gender_female' && refKeys !== 'gender_male') {
        if (typeof item.value === 'string' && item.value.length && !this.state.error[refKeys]) {
          profileData[refKeys] = validator.trim(item.value);
        }
      }
    });

    profileData.gender = refs.gender_female.checked ? 'female' : 'male';
    const json_metadata = user.json_metadata || {};
    json_metadata.profile = profileData;
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif =>
        this.props.accountUpdate(user.name, passwordOrWif, user.memo_key, json_metadata),
    });
  }
  validate = (refKeys) => {
    const refs = this.refs;
    const value = refs[refKeys] && refs[refKeys].value;
    switch (refKeys) {
      case 'email':
        if (value.length && !validator.isEmail(value)) {
          this.state.error[refKeys] = `${refKeys} is not valid`;
          this.setState({ error: this.state.error });
        } else {
          this.state.error[refKeys] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
      case 'website':
        if (value.length && !validator.isURL(value, { require_protocol: true, protocols: ['http', 'https'] })) {
          this.state.error[refKeys] = `${refKeys} is not valid`;
          this.setState({ error: this.state.error });
        } else {
          this.state.error[refKeys] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
      default:
    }
  }

  closePasswordDialog = () => {
    this.setState({ showPasswordDialog: false, passwordCallback: undefined });
    this.props.clearUpdatingResult();
  }
  savePassword = (passwordOrWif) => {
    this.state.passwordCallback(passwordOrWif);
  }

  clearProfile = () => {
    const user = this.props.auth.user;
    const json_metadata = user.json_metadata || {};
    json_metadata.profile = {};
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif =>
        this.props.accountUpdate(user.name, passwordOrWif, user.memo_key, json_metadata),
    });
  }
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
      <div className="pbl">
        <div className="pvxl">
          <h1>Control your public identity</h1>
          <h3>Integrate identity architecture early,
            saving critical time and ensuring security.</h3>
        </div>
        <AvatarUpdate username={user.name} onDrop={this.onDrop} />
        <form>
          <div className="thin pvl">
            <fieldset className="form-group">
              <label htmlFor="first_name">Name</label>
              <input type="text" defaultValue={profile.name} placeholder="Add a nickname" className="form-control form-control-lg" ref="name" />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="about">About</label>
              <textarea className="form-control form-control-lg" defaultValue={profile.about} placeholder="Write few words about yourself" rows="3" ref="about" />
            </fieldset>
            <fieldset className={`form-group ${(this.state.error.website ? 'has-danger' : '')}`}>
              <label htmlFor="website">Website</label>
              <input type="text" defaultValue={profile.website} placeholder="Website address" className="form-control form-control-lg" ref="website" onBlur={() => this.validate('website')} />
              <div className="form-control-feedback">{this.state.error.website}</div>
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="location">Location</label>
              <input type="text" placeholder="Current location" defaultValue={profile.location} className="form-control form-control-lg" ref="location" />
            </fieldset>
          </div>
          <hr />
          <fieldset className="form-group text-lg-center ptl">
            <button className="btn btn-success" onClick={this.save}>Save Changes</button><span className="spacer">or</span>
            <button className="btn btn-outline-danger" onClick={this.clearProfile}>Clear Profile</button>
          </fieldset>
        </form>
        {passwordDialog}
      </div>
    );
  }
}

Settings.propTypes = {
  clearUpdatingResult: PropTypes.func,
  accountUpdate: PropTypes.func,
  setAvatar: PropTypes.func,
  auth: PropTypes.shape({
    user: PropTypes.shape({}),
  }),
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch =>
  (bindActionCreators({ setAvatar, accountUpdate, clearUpdatingResult }, dispatch));

module.exports = connect(mapStateToProps, mapDispatchToProps)(Settings);
