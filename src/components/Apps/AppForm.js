/* eslint-disable no-param-reassign */
import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Form, Modal, Input, Radio, notification } from 'antd';

class AppForm extends Component {
  static propTypes = {
    form: PropTypes.shape({}),
    data: PropTypes.shape({}),
    auth: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }),
    username: PropTypes.string,
    intl: intlShape.isRequired,
    submit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    const data = this.props.data || {};
    this.state = {
      data,
      submitting: false,
      displayRevokeModal: false,
    };
  }

  onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    const { data } = this.state;
    if (name === 'redirect_uris') {
      value = value.split('\n');
    }
    if (name === 'allowed_ips') {
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

  confirm = () => {
    const { intl, username } = this.props;
    fetch(`https://api.steemconnect.com/api/token/revoke/app/${username}`, {
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

  handleCancel = () => {
    this.setState({
      displayRevokeModal: false,
    });
  }

  showRevokeModal = () => {
    this.setState({
      displayRevokeModal: true,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.submitting) return;
    this.setState({ submitting: true });
    const { form: { validateFieldsAndScroll }, submit } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.redirect_uris) {
          values.redirect_uris = values.redirect_uris.split('\n');
        }
        if (values.allowed_ips) {
          values.allowed_ips = values.allowed_ips.split('\n');
        }

        values.type = 'app';
        if (values.is_public) delete values.is_public;

        Object.keys(values).forEach(key => (values[key] == null) && delete values[key]);

        submit(values);
      }
      this.setState({ submitting: false });
    });
  };

  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const { data, displayRevokeModal } = this.state;
    const { form: { getFieldDecorator }, auth, intl } = this.props;
    const redirectUris = data.redirect_uris && data.redirect_uris.join('\n');
    const allowedIPs = data.allowed_ips && data.allowed_ips.join('\n');
    return (
      <Form onSubmit={this.handleSubmit} className="steemconnect-form">
        <Form.Item
          label={<FormattedMessage id="app_name" />}
        >
          {getFieldDecorator('name', {
            initialValue: data.name,
          })(
            <Input
              placeholder={intl.formatMessage({ id: 'app_name' })}
            />,
          )}
          <small>
            <FormattedMessage id="something_users_trust" />
          </small>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="app_description" />}
        >
          {getFieldDecorator('about', {
            rules: [
              { max: 400 },
            ],
            initialValue: data.about,
          })(
            <Input.TextArea
              placeholder={intl.formatMessage({ id: 'app_description' })}
            />,
          )}
          <small>
            <FormattedMessage id="max_characters" values={{ characters: 400 }} />
          </small>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="app_icon" />}
        >
          {getFieldDecorator('profile_image', {
            initialValue: data.profile_image,
          })(
            <Input
              placeholder={intl.formatMessage({ id: 'app_icon' })}
            />,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="website" />}
        >
          {getFieldDecorator('website', {
            initialValue: data.website,
          })(
            <Input
              placeholder={intl.formatMessage({ id: 'website' })}
            />,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="redirect_uris" />}
        >
          {getFieldDecorator('redirect_uris', {
            rules: [
              { max: 2000 },
            ],
            initialValue: redirectUris,
          })(
            <Input.TextArea
              placeholder={intl.formatMessage({ id: 'redirect_uris' })}
            />,
          )}
          <small>
            <FormattedMessage id="auth_uri" />
          </small>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="allowed_ips" />}
        >
          {getFieldDecorator('allowed_ips', {
            initialValue: allowedIPs,
          })(
            <Input.TextArea
              placeholder={intl.formatMessage({ id: 'allowed_ips' })}
            />,
          )}
          <small>
            <FormattedMessage id="allowed_ips_tip" />
          </small>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="manage_visibility" />}
        >
          {getFieldDecorator('is_public', {
            rules: [{ required: true, message: intl.formatMessage({ id: 'error_required' }) }],
            initialValue: !data.is_public,
          })(
            <Radio.Group>
              <Radio style={radioStyle} value><FormattedMessage id="visible" /></Radio>
              <Radio style={radioStyle} value={false}><FormattedMessage id="not_visible" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
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
          {auth.isAuthenticated &&
          <button
            type="submit"
            className="btn btn-success ml-3"
            disabled={this.props.isLoading}
          >
            <FormattedMessage id="save" />
          </button>}
          {auth.isAuthenticated && data.creator === auth.user.name &&
          <button type="button" className="btn btn-danger ml-3" onClick={this.showRevokeModal}>
            <FormattedMessage id="revoke_access_tokens" />
          </button>}
        </div>
      </Form>
    );
  }
}

export default Form.create()(injectIntl(AppForm));
