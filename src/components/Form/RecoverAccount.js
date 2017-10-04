import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Form, Input, Button } from 'antd';
import { accountExist } from '../../utils/validator';

const FormItem = Form.Item;

class RecoverAccountForm extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      validateFieldsAndScroll: PropTypes.func,
    }),
    intl: intlShape.isRequired,
    onSubmit: PropTypes.func,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  render() {
    const { form: { getFieldDecorator }, intl } = this.props;

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
          label={<FormattedMessage id="account_to_recover" />}
          hasFeedback
        >
          {getFieldDecorator('account_to_recover', {
            rules: [
              { validator: accountExist },
              { required: true, message: intl.formatMessage({ id: 'error_account_recover_required' }) },
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="recent_password" />}
          hasFeedback
          defaultValue="FSDFSF"
        >
          {getFieldDecorator('recent_password', {
            rules: [
              { required: true, message: intl.formatMessage({ id: 'error_recent_password_required' }) },
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="new_password" />}
          help={<p><FormattedMessage id="password_tip" /></p>}
          hasFeedback
        >
          {getFieldDecorator('new_password', {
            rules: [
              { required: true, message: intl.formatMessage({ id: 'error_new_password_required' }) },
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large"><FormattedMessage id="recover" /></Button>
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

export default injectIntl(RecoverAccount);
