import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Form, Input, Button } from 'antd';
import { accountNotExist, validateAccountName } from '../../utils/validator';

class Internal extends React.Component {
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
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label={<FormattedMessage id="choose_username" />}
          hasFeedback
        >
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: intl.formatMessage({ id: 'error_username_required' }) },
              { validator: validateAccountName },
              { validator: accountNotExist },
            ],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large"><FormattedMessage id="create_account" /></Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(injectIntl(Internal));
