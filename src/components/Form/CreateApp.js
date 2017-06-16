import React from 'react';
import { Form, Input, Button } from 'antd';
import { accountNotExist, validateAccountName } from '../../utils/validator';

class Internal extends React.Component {
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
        <Form.Item
          label="Choose an username for your application"
          hasFeedback
        >
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: 'Please input an username for your application' },
              { validator: validateAccountName },
              { validator: accountNotExist },
            ],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">Create account</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Internal);
