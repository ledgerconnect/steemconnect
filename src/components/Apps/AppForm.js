import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, notification } from 'antd';
import { Link } from 'react-router';
import Form from '../../widgets/Form';

class AppForm extends Form {
  constructor(props) {
    super(props);
    const data = this.props.data || {};
    this.state = {
      data,
      displayRevokeModal: false,
    };
  }

  showRevokeModal = () => {
    this.setState({
      displayRevokeModal: true,
    });
  }

  handleCancel = () => {
    this.setState({
      displayRevokeModal: false,
    });
  }

  confirm = () => {
    const { intl } = this.props;
    const { data } = this.state;
    fetch(`/api/token/revoke/app/${data.client_id}`, {
      headers: new Headers({
        Authorization: this.props.auth.token,
      }),
    })
      .then(res => res.json())
      .then((result) => {
        this.handleCancel();
        if (result.success) {
          notification.success({
            message: intl.formatMessage({ id: 'success' }),
            description: intl.formatMessage({ id: 'success_revoke_app_tokens' }),
          });
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'error' }),
            description: intl.formatMessage({ id: 'general_error_short' }),
          });
        }
      });
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

  onChangeCheckbox = (event) => {
    const { name } = event.target;
    const { data } = this.state;
    data[name] = !data[name];
    this.setState({ data });
  }

  render() {
    const { data, displayRevokeModal } = this.state;
    const { auth, intl } = this.props;
    const redirectUris = data.redirect_uris && data.redirect_uris.join('\n');
    console.log(data, auth);
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
          <div className="form-group">
            <label className="label" htmlFor="is_public"><FormattedMessage id="manage_visibility" /></label>
            <label className="label" htmlFor="is_public">
              <input
                type="radio"
                className="form-control"
                name="is_public"
                onChange={this.onChangeCheckbox}
                checked={data.is_public}
              />&nbsp;
              <FormattedMessage id="visible" />
            </label>
            <label className="label" htmlFor="is_public">
              <input
                type="radio"
                className="form-control"
                name="is_public"
                onChange={this.onChangeCheckbox}
                checked={!data.is_public}
              />&nbsp;
              <FormattedMessage id="not_visible" />
            </label>
          </div>
        </div>
        <div className="form-group py-3 text-center">
          <Modal
            title={intl.formatMessage({ id: 'are_you_sure' })}
            visible={displayRevokeModal}
            onOk={this.confirm}
            onCancel={this.handleCancel}
            okText={intl.formatMessage({ id: 'yes' })}
            cancelText={intl.formatMessage({ id: 'no' })}
          >
            <p><FormattedMessage id="revoke_access_tokens_question_app" /></p>
          </Modal>
          <Link to="/apps/me" className="btn btn-secondary"><FormattedMessage id="cancel" /></Link>
          {auth.isAuthenticated && data.owner === auth.user.name &&
          <button
            type="submit"
            className="btn btn-success ml-3"
            disabled={this.props.isLoading}
          >
            <FormattedMessage id="save" />
          </button>}
          {auth.isAuthenticated && data.owner === auth.user.name &&
          <button type="button" className="btn btn-danger ml-3" onClick={this.showRevokeModal}>
            <FormattedMessage id="revoke_access_tokens" />
          </button>}
        </div>
      </form>
    );
  }
}

export default injectIntl(AppForm);
