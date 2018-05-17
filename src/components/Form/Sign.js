import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import steem from '@steemit/steem-js';
import { Form, Icon, Input, Button } from 'antd';
import { accountExist } from '../../utils/validator';
import './Sign.less';

class Sign extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      validateFields: PropTypes.func,
      getFieldValue: PropTypes.func,
    }),
    intl: intlShape.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    btnTitle: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };
  }

  componentWillMount() {
    this.setState({ submitting: false });
  }

  keyAuthsHasPublicWif = (keys, publicWif) => keys.some(key => key[0] === publicWif);

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitting: true });
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values;
        const { roles, intl } = this.props;
        const accounts = await steem.api.getAccountsAsync([username]);
        const account = accounts[0];

        /** Change password to public WIF */
        const privateWif = steem.auth.isWif(password)
          ? password
          : steem.auth.toWif(username, password, roles[0]);
        const publicWif = steem.auth.wifToPublic(privateWif);

        /** Check if public WIF is valid */
        let wifIsValid = false;
        let role;
        for (let i = 0; i < roles.length; i += 1) {
          if (
            (roles[i] === 'memo' && account.memo_key === publicWif) ||
            (roles[i] !== 'memo' && this.keyAuthsHasPublicWif(account[roles[i]].key_auths, publicWif))
          ) {
            wifIsValid = true;
            role = roles[i];
            break;
          }
        }

        /** Submit form */
        if (wifIsValid) {
          const payload = {
            username,
            wif: privateWif,
            role,
          };
          if (this.props.onSubmit) {
            this.props.onSubmit(payload);
          }
          if (this.props.sign) {
            this.props.sign(payload);
          }
        } else {
          this.setState({ submitting: false });
          this.props.form.setFields({
            password: {
              value: password,
              errors: [new Error(intl.formatMessage({ id: 'error_password_not_valid' }))],
            },
          });
        }
      } else {
        this.setState({ submitting: false });
      }
    });
  };

  toCredentials = (password) => {
    const username = this.props.form.getFieldValue('username');
    return { username, password };
  };

  render() {
    const { form: { getFieldDecorator }, intl } = this.props;
    const title = this.props.title ? this.props.title : <FormattedMessage id="sign_in" />;
    const btnTitle = this.props.btnTitle ? this.props.btnTitle : <FormattedMessage id="sign_in" />;
    return (
      <Form onSubmit={this.handleSubmit} className="SignForm">
        <h5>{title}</h5>
        <p><FormattedMessage id="operation_require_roles" values={{ roles: this.props.roles.join(', ') }} /></p>
        <Form.Item hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: intl.formatMessage({ id: 'error_username_sign_required' }) },
              { validator: accountExist },
            ],
          })(
            <Input prefix={<Icon type="user" size="large" />} placeholder={intl.formatMessage({ id: 'username' })} autoCorrect="off" autoCapitalize="none" />
          )}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: intl.formatMessage({ id: 'error_password_required' }) },
            ],
          })(
            <Input prefix={<Icon type="lock" size="large" />} type="password" placeholder={intl.formatMessage({ id: 'password_or_key' })} autoCorrect="off" autoCapitalize="none" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="SignForm__button" loading={this.state.submitting}>
            {btnTitle}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(injectIntl(Sign));
