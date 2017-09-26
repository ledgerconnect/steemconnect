/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { message, Button, Form, Input, Icon, Steps } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import changeCase from 'change-case';
import steemOperations from 'steem/lib/broadcast/operations';
import customOperations from '../../helpers/operations/custom-operations';
import helperOperations from '../../helpers/operations';
import authorOperations from '../../helpers/operation-author.json';
import whitelistOperations from '../../helpers/operations/generate-link-whitelist';
import './GenerateLink.less';

class Index extends React.Component {
  static propTypes = {
    form: PropTypes.shape(),
    intl: PropTypes.shape(),
  }

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      step: 'select',
      stepNumber: 0,
      link: '',
      operation: null,
      submitting: false,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillMount() {
    document.body.style.backgroundColor = '#f0f2f4';
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    document.body.style.backgroundColor = '#fcfcfc';
  }

  copyToClipboard = (text) => {
    if (window.clipboardData && window.clipboardData.setData) {
      // IE specific code path to prevent textarea being shown while dialog is visible.
      // eslint-disable-next-line no-undef
      return clipboardData.setData('Text', text);
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      const textarea = document.createElement('textarea');
      textarea.textContent = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const res = document.execCommand('copy');
        message.success(this.props.intl.formatMessage({ id: 'copy_success' }));
        return res;
      } catch (ex) {
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
    return false;
  }

  filterOperations = (e) => {
    this.setState({ filter: e.target.value });
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
        let link = `/sign/${changeCase.paramCase(this.state.operation)}?`;
        Object.keys(values).forEach((k) => {
          if (k !== 'operation' && values[k]) {
            link += `${k}=${encodeURIComponent(values[k])}&`;
          }
        });
        this.setState({ step: 'link', stepNumber: 2, link: link.slice(0, -1) });
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

  selectOperationStep1 = (operation) => {
    this.setState({ operation, step: 'form', stepNumber: 1, filter: '' });
  }

  selectOperationStep2 = (operation) => {
    this.setState({ operation });
  }

  render() {
    const { form: { getFieldDecorator }, intl } = this.props;
    const { step, stepNumber, filter, operation } = this.state;

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
    let opt;
    if (operation) {
      opt = customOperations.find(
        o => o.operation === changeCase.snakeCase(operation));
      if (!opt) {
        opt = steemOperations.find(
          o => o.operation === changeCase.snakeCase(operation));
      }
      fields = opt.params;
    }
    const port = window.location.port ? `:${window.location.port}` : '';
    const domainLink = `${window.location.protocol}//${window.location.hostname}${port}`;
    return (
      <div className="GenerateLinkContainer">
        <h1><FormattedMessage id="gfl_title" /></h1>
        <h2><FormattedMessage id="gfl_subtitle" /></h2>
        <Steps progressDot current={stepNumber}>
          <Steps.Step title={intl.formatMessage({ id: 'select_operation' })} />
          <Steps.Step title={intl.formatMessage({ id: 'information' })} />
          <Steps.Step title={intl.formatMessage({ id: 'copy_link' })} />
        </Steps>
        {step === 'select' && <div className="SelectOperation">
          <div className="SelectOperation__operation search-operation">
            <Icon type="search" /><input className="search-input" type="text" onChange={this.filterOperations} placeholder={intl.formatMessage({ id: 'search_placeholder' })} />
          </div>
          {operations.filter(op => filter === '' || changeCase.sentenceCase(op.name).includes(filter.toLowerCase())).map(op =>
            <a key={`op_${op.name}`} href={undefined} className="SelectOperation__operation" onClick={() => { this.selectOperationStep1(op.name); }}>
              <strong>{changeCase.titleCase(op.name)}</strong>
              <span className="operation-description"><FormattedMessage id={`${op.name}_description`} /></span>
              <Icon type="right" />
            </a>
          )}
        </div>}
        {step === 'form' && <div>
          <Form onSubmit={this.handleSubmit} className="FormGenerateLink">
            <Form.Item label="Operation">
              <div className="SelectOperation operation-select">
                <div className="SelectOperation__operation selected-operation">
                  <strong>{changeCase.titleCase(operation)}</strong>
                  <span className="operation-description"><FormattedMessage id={`${operation}_description`} /></span>
                  <Icon type="down" />
                  <Icon type="up" />
                </div>
                <ul>
                  <li>
                    <div className="SelectOperation__operation search-operation">
                      <Icon type="search" /><input className="search-input" type="text" onChange={this.filterOperations} placeholder={intl.formatMessage({ id: 'search_placeholder' })} />
                    </div>
                  </li>
                  {operations.filter(op => filter === '' || changeCase.sentenceCase(op.name).includes(filter.toLowerCase())).map(op =>
                    <li className={`SelectOperation__operation ${operation === op.name ? 'selected-operation' : ''}`} value={op.name} key={`li_${op.name}`} onClick={() => { this.selectOperationStep2(op.name); }}>
                      <strong>{changeCase.titleCase(op.name)}</strong>
                      <span className="operation-description"><FormattedMessage id={`${op.name}_description`} /></span>
                      {operation === op.name ? <Icon type="check" /> : null}
                    </li>
                  )}
                </ul>
              </div>
            </Form.Item>
            {fields.map((field) => {
              const isRequired = this.isRequiredField(field);
              return (
                <Form.Item label={`${changeCase.titleCase(field)}${isRequired ? '*' : ''}`} key={`f_${field}`}>
                  {getFieldDecorator(field, {
                    rules: [{
                      required: isRequired, message: `${changeCase.titleCase(field)} ${intl.formatMessage({ id: 'is_required' })}`,
                    }],
                  })(
                    <Input id={field} />
                  )}
                </Form.Item>
              );
            })}
            <Form.Item>
              <Button className="generate-link" type="primary" htmlType="submit" loading={this.state.submitting}><FormattedMessage id="generate_link" /></Button>
            </Form.Item>
            <Form.Item>
              <Button htmlType="button" className="back" onClick={() => (this.setState({ step: 'select', stepNumber: 0, filter: '' }))}><FormattedMessage id="go_back" /></Button>
            </Form.Item>
          </Form>
        </div>}
        {this.state.step === 'link' && <div className="FormGenerateLinkResult-container">
          <div className="FormGenerateLinkResult-bg">
            <Form className="FormGenerateLinkResult">
              <object data="/img/sign/link-icon.svg" type="image/svg+xml" id="link-icon" />
              <h1><FormattedMessage id="copy_link" /></h1>
              <h2><FormattedMessage id="copy_link_subtitle" /></h2>
              <Form.Item>
                <div className="link-result">
                  <div><p>{domainLink + this.state.link}</p></div>
                  <button type="button" className="copy-link-btn" onClick={() => { this.copyToClipboard(domainLink + this.state.link); }}><FormattedMessage id="copy_link" /></button>
                </div>
              </Form.Item>
              <Form.Item>
                <Link to={this.state.link} className="try-link"><FormattedMessage id="try_link" /></Link>
              </Form.Item>
            </Form>
          </div>
          <Button className="generate-link" type="primary" htmlType="button" onClick={() => (this.setState({ step: 'select', stepNumber: 0, operation: null }))}><FormattedMessage id="generate__new_link" /></Button>
        </div>}
      </div>
    );
  }
}

export default Form.create()(
  injectIntl(Index)
);
