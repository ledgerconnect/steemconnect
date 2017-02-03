import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import { each } from 'lodash';
import AvatarUpdate from './AvatarUpdate';
import { setAvatar, accountUpdate } from '../actions';
import { showPasswordDialog, updatePasswordDialog } from '../passwordDialog/actions';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = { error: {} };
  }

  onDrop = (files, type) => {
    this.props.showPasswordDialog({
      btnName: 'Update Avatar',
      onEnter: (passwordOrWif) => {
        this.props.updatePasswordDialog({ btnName: 'Updating', inProgress: true });
        this.props.setAvatar(passwordOrWif, files[0], type)
          .then(() => {
            this.props.updatePasswordDialog({ btnName: 'Close', isSuccess: true, message: 'Your avatar is updated' });
          })
          .catch(() => {
            this.props.updatePasswordDialog({ btnName: 'Retry', isError: true, message: 'Incorrect Password' });
          });
      },
    });
  }

  updateProfile = (passwordOrWif, json_metadata) => {
    const user = this.props.auth.user;
    this.props.updatePasswordDialog({ btnName: 'Updating', inProgress: true });
    this.props.accountUpdate(user.name, passwordOrWif, user.memo_key, json_metadata)
      .then(() => {
        this.props.updatePasswordDialog({ btnName: 'Close', isSuccess: true, message: 'Your profile is updated' });
      })
      .catch(() => {
        this.props.updatePasswordDialog({ btnName: 'Retry', isError: true, message: 'Incorrect Password' });
      });
  }

  save = (event) => {
    event.preventDefault();
    const user = this.props.auth.user;
    const profileData = {};
    const refs = this.refs;
    each(refs, (item, refKeys) => {
      if (typeof item.value === 'string' && item.value.length && !this.state.error[refKeys]) {
        profileData[refKeys] = validator.trim(item.value);
      }
    });

    const json_metadata = typeof user.json_metadata === 'object' ? user.json_metadata : {};
    json_metadata.profile = Object.assign({}, json_metadata.profile, profileData);
    this.props.showPasswordDialog({
      btnName: 'Update Profile',
      onEnter: passwordOrWif => this.updateProfile(passwordOrWif, json_metadata),
    });
  }
  validate = (refKeys) => {
    const refs = this.refs;
    const value = refs[refKeys] && refs[refKeys].value;
    switch (refKeys) {
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

  clearProfile = (event) => {
    event.preventDefault();
    const user = this.props.auth.user;
    const json_metadata = typeof user.json_metadata === 'object' ? user.json_metadata : {};
    json_metadata.profile = {};
    this.props.showPasswordDialog({
      btnName: 'Clear Profile',
      onEnter: passwordOrWif => this.updateProfile(passwordOrWif, json_metadata),
    });
  }
  render() {
    const user = this.props.auth.user;
    const profile = typeof user.json_metadata.profile === 'object' ? user.json_metadata.profile : {};
    return (
      <div className="mb-5">
        <AvatarUpdate username={user.name} onDrop={this.onDrop} />
        <form>
          <div className="thin py-5">
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
          <fieldset className="form-group text-lg-center pt-4">
            <button className="btn btn-success" onClick={this.save}>Save Changes</button><span className="spacer">or</span>
            <button className="btn btn-outline-danger" onClick={this.clearProfile}>Clear Profile</button>
          </fieldset>
        </form>
      </div>
    );
  }
}

Settings.propTypes = {
  accountUpdate: PropTypes.func,
  setAvatar: PropTypes.func,
  showPasswordDialog: PropTypes.func,
  updatePasswordDialog: PropTypes.func,
  auth: PropTypes.shape({
    user: PropTypes.shape({}),
  }),
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch =>
  (bindActionCreators({
    setAvatar,
    accountUpdate,
    showPasswordDialog,
    updatePasswordDialog,
  }, dispatch));

module.exports = connect(mapStateToProps, mapDispatchToProps)(Settings);
