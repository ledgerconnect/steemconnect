import React, { PropTypes } from 'react';
import { Button, Form, Input, Select } from 'antd';
import changeCase from 'change-case';
import steemOperations from 'steem/lib/broadcast/operations';
import customOperations from '../../helpers/operations/custom-operations';
import whitelistOperations from '../../helpers/operations/generate-link-whitelist';

const Option = Select.Option;

class Index extends React.Component {
  static propTypes = {
    form: PropTypes.shape(),
  }

  constructor(props) {
    super(props);
    this.state = {
      step: 'form',
      link: '',
      operation: null,
    };
  }

  handleChangeOperation = (operation) => {
    this.setState({ operation });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const port = window.location.port ? `:${window.location.port}` : '';
        let link = `${window.location.protocol}//${window.location.hostname}${port}/sign/${this.state.operation}?`;
        Object.keys(values).forEach((k) => {
          link += `${k}=${values[k]}&`;
        });
        this.setState({ step: 'link', link: link.slice(0, -1) });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const operations = [];

    for (let i = 0; i < whitelistOperations.length; i += 1) {
      operations.push(changeCase.camelCase(whitelistOperations[i]));
    }
    for (let i = 0; i < customOperations.length; i += 1) {
      operations.push(changeCase.camelCase(customOperations[i].operation));
    }
    operations.sort();

    let fields = [];
    if (this.state.operation) {
      let operation = customOperations.find(
        o => o.operation === changeCase.snakeCase(this.state.operation));
      if (!operation) {
        operation = steemOperations.find(
          o => o.operation === changeCase.snakeCase(this.state.operation));
      }
      fields = operation.params;
    }

    return (
      <div className="container my-5">
        <h1>Generate hot signing link</h1>
        {this.state.step === 'form' && <div>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="Operation">
              {getFieldDecorator('operation', {
                rules: [{
                  required: true, message: 'Operation is required',
                }],
              })(
                <Select
                  id="operation"
                  showSearch
                  onChange={this.handleChangeOperation}
                >
                  {operations.map(key =>
                    <Option value={key} key={`opt_${key}`}>
                      {key}
                    </Option>
                  )}
                </Select>
              )}
            </Form.Item>
            {fields.map(field =>
              <Form.Item label={field} key={`f_${field}`}>
                {getFieldDecorator(field, {
                  rules: [{
                    required: true, message: `${field} is required`,
                  }],
                })(
                  <Input id={field} />
                )}
              </Form.Item>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit">Generate</Button>
            </Form.Item>
          </Form>
        </div>}
        {this.state.step === 'link' && <div>
          <pre>
            {this.state.link}
          </pre>
          <br />
          <Form.Item>
            <Button type="primary" htmlType="button" onClick={() => (this.setState({ step: 'form', operation: null }))}>Get a new link</Button>
          </Form.Item>
        </div>}
      </div>
    );
  }
}

export default Form.create()(Index);
