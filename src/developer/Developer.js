import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import validator from 'validator';
import FieldSet from './FieldSet';
import { createApp, getApp, deleteApp } from './actions';
import PermissionList from '../../lib/permissions';
import Loading from '../widgets/Loading';

class Developer extends Component {
  constructor(props) {
    super(props);
    this.state = { error: {}, creatingNewApp: false };
    this.formFields = { permissions: {} };
    this.formData = {};
  }

  componentDidMount() {
    const user = this.props.auth.user;
    this.props.getApp(user.name);
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
      } else if (k !== 'tagline' && k !== 'description') {
        missingData = true;
      }
    });

    if (missingData) {
      this.state.error.save = 'Please fill all fields';
      this.setState({ error: this.state.error });
    } else {
      this.props.createApp(this.formData);
    }
  };

  createApp = () => this.setState({ creatingNewApp: true })

  render() {
    const permissionList = _.map(PermissionList, (v, k) => ({ ...v, api: k }));
    const { app: { name, author, tagline, description,
      permissions = [] }, isFetching } = this.props.developer;
    let { app: { origins = [], redirect_urls = [] } } = this.props.developer;

    origins = typeof origins === 'string' ? JSON.parse(origins) : origins;
    redirect_urls = typeof redirect_urls === 'string' ? JSON.parse(redirect_urls) : redirect_urls;
    origins = origins.length ? origins.join('\n') : origins;
    redirect_urls = redirect_urls.length ? redirect_urls.join('\n') : redirect_urls;

    const appExist = !_.isEmpty(this.props.developer.app);
    const showApp = appExist || this.state.creatingNewApp;

    return (
      <div>
        <div className="container">
          <div className="block block-developer mvl">
            {isFetching && <Loading />}
            {!isFetching && showApp && <form className="form form-developer">
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
            </form>}
          </div>
          {!isFetching && appExist && <p className="pas"><a href="#" onClick={this.props.deleteApp}>Delete App</a></p>}
          {!showApp && <p className="pas"><a href="#" onClick={this.createApp}>Create App</a></p>}
        </div>
      </div>
    );
  }
}

Developer.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  }),
  developer: PropTypes.shape({
    app: PropTypes.object,
    isFetching: PropTypes.bool,
  }),
  createApp: PropTypes.func,
  getApp: PropTypes.func,
  deleteApp: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth, developer: state.developer });
const mapDispatchToProps = dispatch =>
  (bindActionCreators({ createApp, getApp, deleteApp }, dispatch));
export default connect(mapStateToProps, mapDispatchToProps)(Developer);
