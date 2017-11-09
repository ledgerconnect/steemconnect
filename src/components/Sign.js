import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import steem from 'steem';
import changeCase from 'change-case';
import { Link } from 'react-router';
import { Button } from 'antd';
import union from 'lodash/union';
import SignForm from './Form/Sign';
import SignSuccess from './Sign/Success';
import SignError from './Sign/Error';
import SignValidationErrors from './Sign/ValidationErrors';
import { getOperation, parseQuery, validate, normalize } from '../../helpers/operation';
import customOperations from '../../helpers/operations/custom-operations';
import SignPlaceholderDefault from './Sign/Placeholder/Default';
import SignPlaceholderComment from './Sign/Placeholder/Comment';
import SignPlaceholderNonFiltered from './Sign/Placeholder/NonFiltered';
import SignPlaceholderTransferDelegate from './Sign/Placeholder/TransferDelegate';
import Loading from '../widgets/Loading';
import './Sign.less';

export default class Sign extends Component {
  static propTypes = {
    location: PropTypes.shape(),
    params: PropTypes.shape(),
  }

  constructor(props) {
    super(props);

    this.state = {
      type: this.props.params.type,
      base64: this.props.params.base64,
      query: this.props.location.query,
      normalizedQuery: null,
      normalizedQueries: null,
      step: 'loading',
      success: false,
      error: false,
    };
  }

  async componentWillMount() {
    document.body.style.backgroundColor = '#f0f2f4';
    const { type, query, base64 } = this.state;
    if (type === 'tx') {
      if (!base64) {
        this.setState({ validationErrors: [{ error: 'error_tx_base64_required' }], step: 'validationErrors' });
      } else {
        let operationsDecoded;
        let operationsParsed;
        try {
          operationsDecoded = atob(base64);
        } catch (err) {
          this.setState({ validationErrors: [{ error: 'error_base64_encode' }], step: 'validationErrors' });
          return;
        }
        try {
          operationsParsed = JSON.parse(operationsDecoded);
        } catch (err) {
          this.setState({ validationErrors: [{ error: 'error_base64_json' }], step: 'validationErrors' });
          return;
        }
        if (Array.isArray(operationsParsed)) {
          let validationErrors = [];
          for (let i = 0; i < operationsParsed.length; i += 1) {
            validationErrors = validationErrors.concat(
              await validate(
                operationsParsed[i].operation,
                operationsParsed[i].params || {}
                )
            );
          }
          if (validationErrors.length > 0) {
            this.setState({ validationErrors, step: 'validationErrors' });
          } else {
            const normalizedQueries = [];
            for (let i = 0; i < operationsParsed.length; i += 1) {
              normalizedQueries.push({
                operation: operationsParsed[i].operation,
                params: operationsParsed[i].params,
                normalizedQuery: await normalize(
                  operationsParsed[i].operation,
                  operationsParsed[i].params
                ),
              });
            }
            this.setState({ step: 'form', normalizedQueries });
          }
        } else {
          this.setState({ validationErrors: [{ error: 'error_base64_encode' }], step: 'validationErrors' });
        }
      }
    } else {
      if (getOperation(type) === '') {
        this.props.router.push('/404');
      }
      const validationErrors = await validate(type, query);
      if (validationErrors.length > 0) {
        this.setState({ validationErrors, step: 'validationErrors' });
      } else {
        const normalizedQuery = await normalize(type, query);
        this.setState({ step: 'form', normalizedQuery });
      }
    }
  }

  getPlaceholder = (type) => {
    let Placeholder = SignPlaceholderDefault;
    Placeholder = (type === 'comment') ? SignPlaceholderComment : Placeholder;
    Placeholder = (changeCase.snakeCase(type) === 'profile_update') ? SignPlaceholderNonFiltered : Placeholder;
    Placeholder = (['transfer', 'delegate_vesting_shares', 'undelegate_vesting_shares'].includes(changeCase.snakeCase(type))) ? SignPlaceholderTransferDelegate : Placeholder;
    return Placeholder;
  }

  resetForm = () => {
    this.setState({
      step: 'form',
      error: false,
      success: false,
    });
  };

  sign = async (auth) => {
    const { type, query } = this.state;
    const params = await parseQuery(type, query, auth.username);

    /* Broadcast */
    const customOp = customOperations.find(o => o.operation === changeCase.snakeCase(type));
    const mappedType = customOp ? customOp.type : type;
    steem.broadcast[`${changeCase.camelCase(mappedType)}With`](auth.wif, params, (err, result) => {
      if (!err) {
        this.setState({ success: result });
      } else {
        this.setState({ error: err });
      }
      this.setState({ step: 'result' });
    });
  };

  render() {
    const {
      step, success, error, validationErrors, normalizedQuery, normalizedQueries, type,
    } = this.state;
    let op;
    let roles = [];
    let Placeholder;
    if (normalizedQuery) {
      op = getOperation(type);
      roles = op.roles;
      Placeholder = this.getPlaceholder(type);
    } else if (normalizedQueries) {
      normalizedQueries.map(query => (roles = union(roles, getOperation(query.operation).roles)));
    }
    return (
      <div className="Sign">
        {step === 'loading' && <Loading />}
        {step !== 'loading' && <div className="Sign__content">
          <div className="Sign_frame">
            <div className="Sign__header">
              <object data="/img/logo.svg" type="image/svg+xml" id="logo" />
            </div>
            {step === 'signin' &&
            <div className="Sign__signin-warning"><FormattedMessage id="steemconnect_website_confirm" /></div>}
            <div className="Sign__wrapper">
              {step === 'validationErrors' && <SignValidationErrors errors={validationErrors} />}
              {step === 'form' && normalizedQuery &&
              <div className="Placeholder">
                <h5><FormattedMessage id="confirmation_operation" /></h5>
                <div className="Placeholder__operation-container">
                  <h5 className="Placeholder__operation-title">{ changeCase.titleCase(type) }</h5>
                  <Placeholder query={normalizedQuery} params={op.params} />
                </div>
                <Button onClick={() => this.setState({ step: 'signin' })} type="primary" htmlType="button" className="SignForm__button">
                  <FormattedMessage id="continue" />
                </Button>
              </div>
              }
              {step === 'form' && normalizedQueries &&
              <div className="Placeholder">
                <h5><FormattedMessage id="confirmation_operations" /></h5>
                {normalizedQueries.map((query, idx) => {
                  const opMulti = getOperation(query.operation);
                  Placeholder = this.getPlaceholder(query.operation);
                  return (
                    <div className="Placeholder__operation-container" key={`operation_${query.operation}_${idx}`}>
                      <h5 className="Placeholder__operation-title">{ changeCase.titleCase(query.operation) }</h5>
                      <Placeholder query={query.normalizedQuery} params={opMulti.params} />
                    </div>
                  );
                })}
                <Button onClick={() => this.setState({ step: 'signin' })} type="primary" htmlType="button" className="SignForm__button">
                  <FormattedMessage id="continue" />
                </Button>
              </div>}
              {step === 'signin' && <SignForm roles={roles} sign={this.sign} title={<FormattedMessage id="confirm_operation_log_in" />} />}
              {step === 'signin' && <Link className="cancel-link" onClick={() => this.setState({ step: 'form' })}><FormattedMessage id="cancel" /></Link>}
              {step === 'result' && success && <SignSuccess result={success} cb={normalizedQuery.cb || normalizedQuery.redirect_uri} />}
              {step === 'result' && error && <SignError error={error} resetForm={this.resetForm} />}
            </div>
            <div className="Sign__footer">
              <Link to="/" target="_blank" rel="noopener noreferrer"><FormattedMessage id="about_steemConnect" /></Link>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
