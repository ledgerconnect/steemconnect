import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Form, Input, Select } from 'antd';
import changeCase from 'change-case';
import steemOperations from 'steem/lib/broadcast/operations';
import customOperations from '../../helpers/operations/custom-operations';
import helperOperations from '../../helpers/operations';
import authorOperations from '../../helpers/operation-author.json';
import whitelistOperations from '../../helpers/operations/generate-link-whitelist';
import './GenerateLink.less';

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
      submitting: false,
    };
  }

  handleChangeOperation = (operation) => {
    this.setState({ operation });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { form } = this.props;
    if (this.state.submitting) return;
    this.setState({ submitting: true });
    await form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const customOp = helperOperations[this.state.operation];
        if (customOp && typeof customOp.validate === 'function') {
          const errors = [];
          await customOp.validate(values, errors);
          if (errors.length > 0) {
            for (let i = 0; i < errors.length; i += 1) {
              const field = {};
              field[errors[i].field] = {
                value: form.getFieldValue(errors[i].field),
                errors: [new Error(errors[i].error)],
              };
              form.setFields(field);
            }
            this.setState({ submitting: false });
            return false;
          }
        }
        let link = `/sign/${this.state.operation}?`;
        Object.keys(values).forEach((k) => {
          if (k !== 'operation' && values[k]) {
            link += `${k}=${encodeURIComponent(values[k])}&`;
          }
        });
        this.setState({ step: 'link', link: link.slice(0, -1) });
      }
      this.setState({ submitting: false });
      return true;
    });
  }

  isRequiredField = (field) => {
    const { operation } = this.state;
    if (Object.keys(helperOperations).includes(changeCase.snakeCase(operation))) {
      const optionalFields = helperOperations[changeCase.snakeCase(operation)].optionalFields;
      if (optionalFields && optionalFields.includes(field)) {
        return false;
      }
    }

    const author = authorOperations[changeCase.snakeCase(operation)];
    if (author && author.includes(field)) {
      return false;
    }
    return true;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const operations = [];

    for (let i = 0; i < whitelistOperations.length; i += 1) {
      operations.push({
        name: whitelistOperations[i],
        mapped: whitelistOperations[i],
      });
    }
    for (let i = 0; i < customOperations.length; i += 1) {
      operations.push({
        name: customOperations[i].operation,
        mapped: customOperations[i].type,
      });
    }
    operations.sort((a, b) => a.name.localeCompare(b.name));

    let fields = [];
    let operation;
    if (this.state.operation) {
      operation = customOperations.find(
        o => o.operation === changeCase.snakeCase(this.state.operation));
      if (!operation) {
        operation = steemOperations.find(
          o => o.operation === changeCase.snakeCase(this.state.operation));
      }
      fields = operation.params;
    }
    const port = window.location.port ? `:${window.location.port}` : '';
    const domainLink = `${window.location.protocol}//${window.location.hostname}${port}`;
    return (
      <div className="container padding-top-30">
        <h1>Generate hot signing link</h1>
        {this.state.step === 'form' && <div>
          <Form onSubmit={this.handleSubmit} className="FormGenerateLink">
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
                  {operations.map(op =>
                    <Option value={op.name} key={`opt_${op.name}`}>
                      {changeCase.titleCase(op.name)} ({op.mapped})
                    </Option>
                  )}
                </Select>
              )}
            </Form.Item>
            {fields.map((field) => {
              const isRequired = this.isRequiredField(field);
              return (
                <Form.Item label={`${field}${isRequired ? '*' : ''}`} key={`f_${field}`}>
                  {getFieldDecorator(field, {
                    rules: [{
                      required: isRequired, message: `${field} is required`,
                    }],
                  })(
                    <Input id={field} />
                  )}
                </Form.Item>
              );
            })}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={this.state.submitting}>Generate</Button>
            </Form.Item>
          </Form>
        </div>}
        {this.state.step === 'link' && <div>
          <Form className="FormGenerateLinkResult">
            <Form.Item>
              <Input value={domainLink + this.state.link} />
            </Form.Item>
            <Form.Item>
              <Link to={this.state.link} className="ant-btn ant-btn-primary ant-btn-lg">Try it</Link>
              <Button htmlType="button" className="back" onClick={() => (this.setState({ step: 'form', operation: null }))}>Get a new link</Button>
            </Form.Item>
          </Form>
        </div>}
      </div>
    );
  }
}

export default Form.create()(Index);
