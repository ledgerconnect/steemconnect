import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import Form from '../../widgets/Form';

export default class AppForm extends Form {
  constructor(props) {
    super(props);
    const data = this.props.data || {};
    this.state = { data };
  }

  onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    const { data } = this.state;
    if (name === 'redirect_uris') {
      value = value.split('\n');
    }
    data[name] = value;
    this.setState({ data });
  };

  render() {
    const { data } = this.state;
    const redirectUris = data.redirect_uris && data.redirect_uris.join('\n');
    return (
      <form onSubmit={this.onSubmit}>
        <div className="block">
          <div className="form-group">
            <label className="label" htmlFor="appName"><FormattedMessage id="app_name" /></label>
            <input
              id="appName"
              type="text"
              className="form-control"
              name="name"
              onChange={this.onChange}
              defaultValue={data.name}
            />
            <small>
              <FormattedMessage id="something_users_trust" />
            </small>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="appDesc"><FormattedMessage id="app_description" /></label>
            <textarea
              id="appDesc"
              className="form-control"
              name="description"
              onChange={this.onChange}
              defaultValue={data.description}
            />
            <small>
              <FormattedMessage id="max_characters" />
            </small>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="appIcon"><FormattedMessage id="app_icon" /></label>
            <input
              id="appIcon"
              type="text"
              className="form-control"
              name="icon"
              onChange={this.onChange}
              defaultValue={data.icon}
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="website"><FormattedMessage id="website" /></label>
            <input
              id="website"
              type="text"
              className="form-control"
              name="website"
              onChange={this.onChange}
              defaultValue={data.website}
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="redirectURI"><FormattedMessage id="redirect_uris" /></label>
            <textarea
              id="redirectURI"
              className="form-control"
              name="redirect_uris"
              onChange={this.onChange}
              defaultValue={redirectUris}
            />
            <small>
              <FormattedMessage id="auth_uri" />
            </small>
          </div>
        </div>
        <div className="form-group py-3 text-center">
          <Link to="/apps/me" className="btn btn-secondary"><FormattedMessage id="cancel" /></Link>
          <button
            type="submit"
            className="btn btn-success ml-3"
            disabled={this.props.isLoading}
          >
            <FormattedMessage id="save" />
          </button>
        </div>
      </form>
    );
  }
}
