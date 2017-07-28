import React from 'react';
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
            <label className="label" htmlFor="appName">App Name</label>
            <input
              id="appName"
              type="text"
              className="form-control"
              name="name"
              onChange={this.onChange}
              defaultValue={data.name}
            />
            <small>
              Something users will recognize and trust
            </small>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="appDesc">App Description</label>
            <textarea
              id="appDesc"
              className="form-control"
              name="description"
              onChange={this.onChange}
              defaultValue={data.description}
            />
            <small>
              Maximum 400 characters
            </small>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="appIcon">App Icon</label>
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
            <label className="label" htmlFor="website">Website</label>
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
            <label className="label" htmlFor="redirectURI">Redirect URI(s)</label>
            <textarea
              id="redirectURI"
              className="form-control"
              name="redirect_uris"
              onChange={this.onChange}
              defaultValue={redirectUris}
            />
            <small>
              You must specify at least one URI for authentication to work. If you pass a
              URI in an OAuth request, it must exactly match one of the URIs you enter here.
            </small>
          </div>
        </div>
        <div className="form-group py-3 text-center">
          <Link to="/apps/me" className="btn btn-secondary">Cancel</Link>
          <button
            type="submit"
            className="btn btn-success ml-3"
            disabled={this.props.isLoading}
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}
