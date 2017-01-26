import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import validator from 'validator';
import FieldsetInput from '../widgets/Form/FieldsetInput';
import FieldSetTextarea from '../widgets/Form/FieldsetTextarea';
import { createApp, getApp, deleteApp } from '../developers/actions';
import PermissionList from '../../lib/permissions';
import Loading from '../widgets/Loading';

class AppSetup extends Component {
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
      case 'author':
        if (validator.trim(value).length === 0) {
          this.state.error[refs] = 'This field cannot be empty';
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
          this.state.error[refs] = 'This field cannot be empty';
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
      } else if (k === 'envDev' || k === 'envProd') {
        if (v.checked) {
          this.formData.env = v.value;
        }
      } else if (v.value) {
        this.formData[k] = v.value.trim();
      } else if (k !== 'author') {
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

  createApp = () => this.setState({ creatingNewApp: true });

  render() {
    const permissionList = _.map(PermissionList, (v, k) => ({ ...v, api: k }));
    const { app: { author, env = 'dev',
      permissions = [] }, isFetching } = this.props.developer;
    let { app: { origins = [], redirect_urls: redirectUrls = [] } } = this.props.developer;

    origins = _.isString(origins) ? JSON.parse(origins) : origins;
    redirectUrls = _.isString(redirectUrls) ? JSON.parse(redirectUrls) : redirectUrls;
    origins = _.isArray(origins) ? origins.join('\n') : origins;
    redirectUrls = _.isArray(redirectUrls) ? redirectUrls.join('\n') : redirectUrls;
    const appExist = !_.isEmpty(this.props.developer.app);

    return (
      <div className="pbl">
        {isFetching && <div className="my-4"><Loading /></div>}
        {!isFetching &&
          <form className="form">
            <div className="thin py-4">
              <FieldsetInput name="author" label="Author" placeholder="Add the author username" defaultValue={author} error={this.state.error} validate={this.validate} formFields={this.formFields} />
              <fieldset className="form-group">
                <label htmlFor="origins">Requested permissions</label>
                {permissionList.map(({ name: permissionName, api }) => <div key={api}>
                  <input type="checkbox" className="form-check-input mls" ref={c => (this.formFields.permissions[api] = c)} defaultChecked={permissions.indexOf(api) >= 0} value={api} />
                  {permissionName}
                </div>
                )}
              </fieldset>
              <FieldSetTextarea name="origins" label="Allowed origins" placeholder="Enter a list of origin URLs separated by new line" defaultValue={origins} error={this.state.error} validate={this.validate} formFields={this.formFields} />
              <FieldSetTextarea name="redirect_urls" label="Allowed redirect urls" placeholder="Enter a list of redirect URLs separated by new line" defaultValue={redirectUrls} error={this.state.error} validate={this.validate} formFields={this.formFields} />
              <fieldset className="form-group">
                <div className="btn-group">
                  <label className="btn btn-secondary">
                    <input ref={c => (this.formFields.envDev = c)} type="radio" name="env" id="dev" value="dev" defaultChecked={env === 'dev'} /> Development
                  </label>
                  <label className="btn btn-secondary">
                    <input ref={c => (this.formFields.envProd = c)} type="radio" name="env" id="prod" value="prod" defaultChecked={env === 'prod'} /> Production
                  </label>
                </div>
              </fieldset>
            </div>
            <hr />
            <fieldset className="form-group text-lg-center ptl">
              <div className="form-control-danger man px-3">{this.state.error.save}</div>
              <button className="btn btn-success" onClick={this.save}>Save Changes</button>
              {appExist && <span>
                <span className="spacer">or</span>
                <button className="btn btn-outline-danger" onClick={this.props.deleteApp}>Delete App</button>
              </span>}
            </fieldset>
          </form>
        }
      </div>
    );
  }
}

AppSetup.propTypes = {
  deleteApp: PropTypes.func,
  createApp: PropTypes.func,
  getApp: PropTypes.func,
  developer: PropTypes.shape({
    app: PropTypes.shape({}),
    isFetching: PropTypes.bool,
  }),
  auth: PropTypes.shape({
    user: PropTypes.shape({}),
  }),
};

const mapStateToProps = state => ({
  auth: state.auth,
  developer: state.developer,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({ createApp, getApp, deleteApp }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AppSetup);
