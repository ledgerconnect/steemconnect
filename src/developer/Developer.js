import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import validator from 'validator';
import steemAuth from 'steemauth';
import Header from './../app/header';
import FieldSet from './FieldSet';
import { createApplication } from './devAction';
import PasswordDialog from './../widgets/PasswordDialog';
import apiList from '../../lib/apiList';

class Developer extends Component {
  constructor(props) {
    super(props);
    this.state = { error: {}, showPasswordDialog: false };
    this.formFields = { permissions: {} };
    this.formData = {};
  }

  validate = (refs) => {
    const value = this.formFields[refs] && this.formFields[refs].value;
    switch (refs) {
      case 'appName':
      case 'author':
        if (validator.trim(value).length === 0) {
          this.state.error[refs] = `${refs} cannot be empty`;
          this.setState({ error: this.state.error });
        } else {
          this.formData[refs] = value.trim();
          this.state.error[refs] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
      case 'origins':
      case 'redirect_urls': //eslint-disable-line
        let valid = true;
        const urls = value.split('\n');
        if (urls.length === 0) {
          this.state.error[refs] = `${refs} cannot be empty`;
          this.setState({ error: this.state.error });
          break;
        }
        _.each(urls, (url) => {
          if (url.length && !validator.isURL(url, { require_protocol: true, protocols: ['http', 'https'] })) {
            this.state.error[refs] = `${refs} in not valid`;
            this.setState({ error: this.state.error });
            valid = false;
            return false;
          }
          return true;
        });

        if (valid) {
          this.formData[refs] = value.trim().split('\n');
          this.state.error[refs] = undefined;
          this.setState({ error: this.state.error });
        }

        break;
      default:
        break;
    }
  };
  save = (event) => {
    event.preventDefault();
    let missingData = false;
    _.each(this.formFields, (v, k) => {
      if (k === 'permissions') {
        this.formData.permissions = _.chain(v).map((v1, k1) => v1.checked && k1).filter().value();
      } else if (k === 'origins' || k === 'redirect_urls') {
        this.formData[k] = v.value.trim().split('\n');
      } else if (v.value) {
        this.formData[k] = v.value.trim();
      } else {
        missingData = true;
      }
    });
    if (missingData) {
      this.state.error.save = 'Please fill all fields';
      this.setState({ error: this.state.error });
    } else {
      this.setState({
        showPasswordDialog: true,
        passwordCallback: (passwordOrWif) => {
          const isWif = steemAuth.isWif(passwordOrWif);
          const ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(this.props.auth.user.name, passwordOrWif, 'owner');
          this.formData.appOwnerWif = ownerKey;
          this.props.createApplication(this.formData);
        },
      });
    }
  };
  closePasswordDialog = () => {
    this.setState({ showPasswordDialog: false, passwordCallback: undefined });
    // this.props.clearUpdatingProfileResult();
  };
  savePassword = (passwordOrWif) => {
    this.state.passwordCallback(passwordOrWif);
  };
  render() {
    const permissionList = _.map(apiList, (v, k) => ({ ...v, api: k }));
    const { isUpdatingProfile, isUpdatingProfileError, json_metadata } = this.props.auth.user;
    const { keys } = this.props.developer;
    const { name: appName, author, permissions = [] } = json_metadata.app || {};

    return (
      <div>
        <Header />
        <form className="form">
          {keys && (<div style={{ wordBreak: 'break-all' }}>
            clientId: {keys.clientId}<br />
            secret: {keys.clientSecret}
          </div>)}
          <div className="mbl">
            <FieldSet name={'appName'} defaultValue={appName} error={this.state.error} validate={this.validate} formFields={this.formFields} />
            <FieldSet name={'author'} defaultValue={author} error={this.state.error} validate={this.validate} formFields={this.formFields} />
            <fieldset className="form-group">
              <h3>Requested Permissions</h3>
              {permissionList.map(({ name, api }) => <div key={api}>
                <input type="checkbox" className="form-check-input" ref={c => (this.formFields.permissions[api] = c)} defaultChecked={permissions.indexOf(api) >= 0} value={api} />
                {name}
              </div>
              ) }
            </fieldset>
            <fieldset className="form-group">
              <h3>Allowed Permissions</h3>
              <textarea className="form-control form-control-lg" onBlur={() => this.validate('origins')} placeholder="each origins in new line" rows="3" ref={c => (this.formFields.origins = c)} />
              <div className="form-control-feedback">{this.state.error.origins}</div>
            </fieldset>
            <fieldset className="form-group">
              <h3>Allowed Redirect Urls</h3>
              <textarea className="form-control form-control-lg" onBlur={() => this.validate('redirect_urls')} placeholder="each redirect_urls in new line" rows="3" ref={c => (this.formFields.redirect_urls = c)} />
              <div className="form-control-feedback">{this.state.error.redirect_urls}</div>
            </fieldset>
          </div>
          <fieldset className="form-group">
            <button className="btn btn-primary" onClick={this.save}>Save</button>
            <div className="form-control-feedback">{this.state.error.save}</div>
          </fieldset>
        </form>
        {this.state.showPasswordDialog && <PasswordDialog
          isUpdating={isUpdatingProfile}
          error={isUpdatingProfileError}
          onClose={this.closePasswordDialog}
          onSave={this.savePassword}
        />}
      </div>
    );
  }
}

Developer.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  }),
  developer: PropTypes.shape({
    keys: PropTypes.object,
  }),
  createApplication: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth, developer: state.developer });
const mapDispatchToProps = dispatch => ({
  createApplication: bindActionCreators(createApplication, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Developer);
