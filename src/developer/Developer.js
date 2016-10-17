import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import validator from 'validator';
import Header from './../app/header';
import FieldSet from './FieldSet';
import { accountUpdate, clearUpdatingResult } from '../actions';
import PasswordDialog from './../widgets/PasswordDialog';
import PermissionList from '../../lib/permissions';

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
      case 'name':
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
        this.formData[refs] = value.trim();
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
          const user = this.props.auth.user;
          const json_metadata = user.json_metadata || {};
          json_metadata.app = this.formData;
          this.props.accountUpdate(user.name, passwordOrWif, user.memo_key, json_metadata);
        },
      });
    }
  };
  closePasswordDialog = () => {
    this.setState({ showPasswordDialog: false, passwordCallback: undefined });
    this.props.clearUpdatingResult();
  };
  savePassword = (passwordOrWif) => {
    this.state.passwordCallback(passwordOrWif);
  };
  render() {
    const permissionList = _.map(PermissionList, (v, k) => ({ ...v, api: k }));
    const user = this.props.auth.user;
    const { json_metadata } = user;
    const { name, author, tagline, description, permissions = [] } = json_metadata.app || {};
    let { origins = '', redirect_urls = '' } = json_metadata.app || {};
    origins = origins.length ? origins.join('\n') : origins;
    redirect_urls = redirect_urls.length ? redirect_urls.join('\n') : redirect_urls;

    return (
      <div>
        <Header />
        <div className="container">
          <div className="block block-developer mvl">
            <form className="form form-developer">
              <div className="pam">
                <label htmlFor="name">App Name</label>
                <FieldSet name={'name'} defaultValue={name} error={this.state.error} validate={this.validate} formFields={this.formFields} />
                <label htmlFor="author">Author</label>
                <FieldSet name={'author'} defaultValue={author} error={this.state.error} validate={this.validate} formFields={this.formFields} />
                <label htmlFor="tagline">Tagline</label>
                <FieldSet name={'tagline'} defaultValue={tagline} error={this.state.error} validate={this.validate} formFields={this.formFields} />
                <label htmlFor="description">Description</label>
                <FieldSet name={'description'} defaultValue={description} error={this.state.error} validate={this.validate} formFields={this.formFields} />
                <fieldset className="form-group">
                  <label htmlFor="origins">Requested permissions</label>
                  {permissionList.map(({ name: permissionName, api }) => <div key={api}>
                    <input type="checkbox" className="form-check-input mls" ref={c => (this.formFields.permissions[api] = c)} defaultChecked={permissions.indexOf(api) >= 0} value={api} />
                    {permissionName}
                  </div>
                  )}
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="origins">Allowed Origins</label>
                  <textarea className="form-control form-control-lg" defaultValue={origins} onBlur={() => this.validate('origins')} placeholder="each origins in new line" rows="3" ref={c => (this.formFields.origins = c)} />
                  <div className="form-control-feedback">{this.state.error.origins}</div>
                </fieldset>
                <fieldset className="form-group">
                  <h3>Allowed Redirect Urls</h3>
                  <textarea className="form-control form-control-lg" defaultValue={redirect_urls} onBlur={() => this.validate('redirect_urls')} placeholder="each redirect_urls in new line" rows="3" ref={c => (this.formFields.redirect_urls = c)} />
                  <div className="form-control-feedback">{this.state.error.redirect_urls}</div>
                </fieldset>
              </div>
              <fieldset className="form-group man">
              <div className="form-control-feedback man phm">{this.state.error.save}</div>
                <button className="btn btn-primary form-submit" onClick={this.save}>Save</button>
              </fieldset>
            </form>
            {this.state.showPasswordDialog && <PasswordDialog
              isUpdating={user.isUpdatingProfile}
              error={user.isUpdatingProfileError}
              onClose={this.closePasswordDialog}
              onSave={this.savePassword}
            />}
          </div>
          <p className="pas"><a href="#" onClick={this.clearProfile}>Delete App</a></p>
        </div>
      </div>
    );
  }
}

Developer.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  }),
  accountUpdate: PropTypes.func,
  clearUpdatingResult: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth, developer: state.developer });
const mapDispatchToProps = dispatch =>
  (bindActionCreators({ accountUpdate, clearUpdatingResult }, dispatch));
export default connect(mapStateToProps, mapDispatchToProps)(Developer);
