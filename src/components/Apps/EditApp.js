/* eslint-disable react/jsx-boolean-value */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import fetch from 'isomorphic-fetch';
import { Button, Form, Input, Tabs, Radio, notification } from 'antd';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/Avatar';
import './EditApp.less';

class EditApp extends Component {
  static propTypes = {
    params: PropTypes.shape({
      clientId: PropTypes.string,
    }),
    auth: PropTypes.shape({
      token: PropTypes.string,
    }),
    intl: intlShape.isRequired,
    form: PropTypes.shape({}).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      submitting: false,
      clientId: this.props.params.clientId,
      app: {},
    };
  }

  componentWillMount() {
    const { clientId } = this.state;
    this.setState({ isLoading: true });

    fetch(`/api/apps/@${clientId}`, {
      headers: new Headers({
        Authorization: this.props.auth.token,
      }),
    })
      .then(res => res.json())
      .then((app) => {
        this.setState({
          app,
          isLoading: false,
          isLoaded: true,
        });
      });
  }

  onChangeCheckbox = (event) => {
    const { name } = event.target;
    const { app } = this.state;
    app[name] = !app[name];
    this.setState({ app });
  }

  submit = (e) => {
    e.preventDefault();
    const { clientId } = this.state;
    const { form, intl } = this.props;
    if (this.state.submitting) return;
    this.setState({ submitting: true });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        fetch(`/api/apps/@${clientId}`, {
          method: 'PUT',
          headers: new Headers({
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: this.props.auth.token,
          }),
          body: JSON.stringify(values),
        })
          .then(res => res.json())
          .then(() => {
            this.setState({ submitting: false });
            notification.success({
              message: intl.formatMessage({ id: 'success' }),
              description: intl.formatMessage({ id: 'success_app_updated' }),
            });
          })
          .catch(() => {
            notification.error({
              message: intl.formatMessage({ id: 'error' }),
              description: intl.formatMessage({ id: 'general_error' }),
            });
          });
      } else {
        this.setState({ submitting: false });
      }
    });
  };

  render() {
    const origin = window.location.origin;
    const { app, isLoading, isLoaded, submitting } = this.state;
    const { intl, form: { getFieldDecorator } } = this.props;
    return (
      <div className="AppInformation">
        {isLoading && <Loading />}
        {isLoaded && <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={intl.formatMessage({ id: 'information' })} key="1" className="AppInformation__Tabs">
            <div className="AppInformation__Avatar">
              <Avatar icon={app.icon} size="140" className="float-left mr-3" />
            </div>
            <div className="AppInformation__content">
              <h2><FormattedMessage id="edit_information" /></h2>
              <Form onSubmit={this.submit}>
                <Form.Item label={<FormattedMessage id="app_name" />}>
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: intl.formatMessage({ id: 'is_required' }),
                    }],
                    initialValue: app.name,
                  })(
                    <Input name="name" placeholder={intl.formatMessage({ id: 'app_name' })} />
                  )}
                  <small>
                    <FormattedMessage id="something_users_trust" />
                  </small>
                </Form.Item>
                <Form.Item label={<FormattedMessage id="app_description" />}>
                  {getFieldDecorator('description', {
                    rules: [{
                      required: true, message: intl.formatMessage({ id: 'is_required' }),
                    }],
                    initialValue: app.description,
                  })(
                    <Input.TextArea name="description" placeholder={intl.formatMessage({ id: 'app_description' })} />
                  )}
                  <small>
                    <FormattedMessage id="max_characters" />
                  </small>
                </Form.Item>
                <Form.Item label={<FormattedMessage id="app_icon" />}>
                  {getFieldDecorator('icon', {
                    rules: [{
                      required: true, message: intl.formatMessage({ id: 'is_required' }),
                    }],
                    initialValue: app.icon,
                  })(
                    <Input name="icon" placeholder={intl.formatMessage({ id: 'app_icon' })} />
                  )}
                </Form.Item>
                <Form.Item label={<FormattedMessage id="website" />}>
                  {getFieldDecorator('website', {
                    initialValue: app.website,
                  })(
                    <Input name="website" placeholder={intl.formatMessage({ id: 'website' })} />
                  )}
                </Form.Item>
                <Form.Item label={<FormattedMessage id="redirect_uris" />}>
                  {getFieldDecorator('redirect_uris', {
                    rules: [{
                      required: true, message: intl.formatMessage({ id: 'is_required' }),
                    }],
                    initialValue: app.redirect_uris,
                  })(
                    <Input.TextArea name="redirect_uris" placeholder={intl.formatMessage({ id: 'redirect_uris' })} />
                  )}
                  <small>
                    <FormattedMessage id="auth_uri" />
                  </small>
                </Form.Item>
                <Form.Item label={<FormattedMessage id="manage_visibility" />}>
                  {getFieldDecorator('is_public', {
                    initialValue: app.is_public,
                  })(
                    <Radio.Group name="is_public" onChange={this.onChangeCheckbox}>
                      <Radio value={true} name="is_public"><FormattedMessage id="visible" /></Radio>
                      <Radio value={false} name="is_public"><FormattedMessage id="not_visible" /></Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item className="form-actions">
                  <Link to="/apps/me" className="btn btn-secondary"><FormattedMessage id="cancel" /></Link>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="btn ml-3"
                    loading={submitting}
                  >
                    <FormattedMessage id="save" />
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={intl.formatMessage({ id: 'oauth2' })} key="2" className="AppInformation__Tabs">
            <div>
              <h4><FormattedMessage id="implementing_oauth2" /></h4>
              <p>
                <FormattedMessage id="implementing_oauth2_text" values={{ link: <Link to="/apps/create"><FormattedMessage id="registering_app" /></Link> }} />
              </p>
              <div className="list-group">
                <div className="list-group-item">
                  <a className="mr-2" href={`${origin}/api/oauth2/authorize`}>
                    {`${origin}/api/oauth2/authorize`}
                  </a>
                  <b><FormattedMessage id="base_auth_url" /></b>
                </div>
                <div className="list-group-item">
                  <a className="mr-2" href={`${origin}/api/oauth2/token`}>
                    {`${origin}/api/oauth2/token`}
                  </a>
                  <b><FormattedMessage id="token_url" /></b>
                </div>
                <div className="list-group-item">
                  <a className="mr-2" href={`${origin}/api/oauth2/token/revoke`}>
                    {`${origin}/api/oauth2/token/revoke`}
                  </a>
                  <b><FormattedMessage id="revocation_url" /></b>
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>}
      </div>
    );
  }
}

export default Form.create()(injectIntl(EditApp));
