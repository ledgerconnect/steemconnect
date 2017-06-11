import React from 'react';
import steem from 'steem';
import { Form, Icon, Input, Button } from 'antd';
import { accountExist } from '../../utils/validator';
import './Sign.less';

class Sign extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values;
        const { roles } = this.props;
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
        roles.map(r => {
          if (account[r].key_auths[0][0] === publicWif) {
            wifIsValid = true;
            role = r;
          }
        });

        /** Submit form */
        if (wifIsValid) {
          const payload = {
            username: username,
            wif: privateWif,
            role,
          };
          this.props.onSubmit && this.props.onSubmit(payload);
          this.props.sign && this.props.sign(payload);
        } else {
          this.props.form.setFields({
            password: {
              value: password,
              errors: [new Error('Password or WIF is not valid')],
            },
          });
        }
      }
    });
  };

  toCredentials = (password) => {
    const username = this.props.form.getFieldValue('username');
    return { username, password };
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const title = this.props.title ? this.props.title : 'Sign In';
    const btnTitle = this.props.btnTitle ? this.props.btnTitle : 'Sign In';
    return (
      <Form onSubmit={this.handleSubmit} className="SignForm">
        <center><h2>{title}</h2></center>
        <p>This operation requires your {this.props.roles.join(', ')} key or master password.</p>
        <Form.Item hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: 'Please input your username' },
              { validator: accountExist },
            ],
          })(
            <Input prefix={<Icon type="user" size="large" />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Please input your password or WIF' },
            ],
          })(
            <Input prefix={<Icon type="lock" size="large" />} type="password" placeholder="Password or WIF" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="SignForm__button">
            {btnTitle}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Sign);
