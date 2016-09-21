import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import validator from 'validator';
import FieldSet from './FieldSet';
import { createApplication } from './devAction';
import Header from './../header/Header';
import PasswordDialog from './../widgets/PasswordDialog';

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
      case 'appUserName':
      case 'appOwnerWif':
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
  }
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
      this.props.createApplication(this.formData);
    }
  }
  closePasswordDialog = () => {
    this.setState({ showPasswordDialog: false, passwordCallback: undefined });
    // this.props.clearUpdatingProfileResult();
  }
  savePassword = (passwordOrWif) => {
    this.state.passwordCallback(passwordOrWif);
  }
  render() {
    const { name, isUpdatingProfile, isUpdatingProfileError, json_metadata } = this.props.auth.user;
    const { result } = this.props.app;
    let keysView;
    const { app: { appName, author, permissions = [], private_metadata } } = json_metadata;
    if (result) {
      keysView = (<div>
        clientId: {result.clientId}<br />
        secret: {result.clientSecret}
      </div>);
    }

    console.log(this.props, result, appName, author, permissions, private_metadata);
    let passwordDialog;
    if (this.state.showPasswordDialog) {
      passwordDialog = (<PasswordDialog
        isUpdatingProfile={isUpdatingProfile}
        isUpdatingProfileError={isUpdatingProfileError}
        onClose={this.closePasswordDialog}
        onSave={this.savePassword}
      />);
    }


    return (
      <div className="block">
        <Header username={name} />
        <form className="form pvx mhl">
          {keysView}
          <div className="mbl">
            <FieldSet name={'appUserName'} defaultValue={appName} error={this.state.error} validate={this.validate} formFields={this.formFields} />
            <FieldSet name={'appOwnerWif'} error={this.state.error} validate={this.validate} formFields={this.formFields} />
            <FieldSet name={'appName'} defaultValue={appName} error={this.state.error} validate={this.validate} formFields={this.formFields} />
            <FieldSet name={'author'} defaultValue={author} error={this.state.error} validate={this.validate} formFields={this.formFields} />
            <fieldset className={"form-group"}>
              Permissions <br />
              <input type="checkbox" className="form-check-input" ref={c => (this.formFields.permissions.vote = c)} defaultChecked={permissions.indexOf('vote') >= 0} value="vote" /> Vote<br />
              <input type="checkbox" className="form-check-input" ref={c => (this.formFields.permissions.verify = c)} defaultChecked={permissions.indexOf('verify') >= 0} value="verify" /> Verify<br />
              <input type="checkbox" className="form-check-input" ref={c => (this.formFields.permissions.post = c)} defaultChecked={permissions.indexOf('post') >= 0} value="post" /> Post<br />
            </fieldset>
            <fieldset className={"form-group"}>
              Permissions <br />
              <textarea className="form-control form-control-lg" onBlur={() => this.validate('origins')} placeholder="each origins in new line" rows="3" ref={c => (this.formFields.origins = c)} />
              <div className="form-control-feedback">{this.state.error.origins}</div>
            </fieldset>
            <fieldset className={"form-group"}>
              <textarea className="form-control form-control-lg" onBlur={() => this.validate('redirect_urls')} placeholder="each redirect_urls in new line" rows="3" ref={c => (this.formFields.redirect_urls = c)} />
              <div className="form-control-feedback">{this.state.error.redirect_urls}</div>
            </fieldset>
          </div>
          <fieldset className="form-group">
            <button className="btn btn-primary" onClick={this.save}>Save</button>
            <div className="form-control-feedback">{this.state.error.save}</div>
          </fieldset>
        </form>
        {passwordDialog }
      </div>
    );
  }
}

Developer.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  }),
  app: PropTypes.shape({ result: PropTypes.object }),
  createApplication: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth, app: state.app });
const mapDispatchToProps = dispatch => ({
  createApplication: bindActionCreators(createApplication, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Developer);
