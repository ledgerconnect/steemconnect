import React from 'react';
import { Form, Input, Button } from 'antd';
import { accountExist } from '../../helpers/validatorHelpers';

const FormItem = Form.Item;

class RecoverAccountForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 8,
        },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Account to recover"
          hasFeedback
        >
          {getFieldDecorator('account_to_recover', {
            rules: [
              { validator: accountExist },
              { required: true, message: 'Please input the account to recover' },
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Recent password"
          hasFeedback
          defaultValue="FSDFSF"
        >
          {getFieldDecorator('recent_password', {
            rules: [
              { required: true, message: 'Please input a recent password' },
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="New password"
          help={<p>Write down your password and keep it somewhere very safe and secure.</p>}
          hasFeedback
        >
          {getFieldDecorator('new_password', {
            rules: [
              { required: true, message: 'Please input a new password' },
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">Recover</Button>
        </FormItem>
      </Form>
    );
  }
}

const RecoverAccount = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return { ...props,
      new_password: {
        ...props.new_password,
        value: props.new_password.value,
      },
    };
  },
})(RecoverAccountForm);

export default RecoverAccount
