import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import steem from 'steem';
import changeCase from 'change-case';
import { Link } from 'react-router';
import { Button } from 'antd';
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
      query: this.props.location.query,
      normalizedQuery: null,
      step: 'loading',
      success: false,
      error: false,
    };
  }

  async componentWillMount() {
    document.body.style.backgroundColor = '#f0f2f4';
    const { type, query } = this.state;
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
    const { step, success, error, validationErrors, normalizedQuery, type } = this.state;
    const op = getOperation(type);
    let Placeholder = SignPlaceholderDefault;
    Placeholder = (type === 'comment') ? SignPlaceholderComment : Placeholder;
    Placeholder = (changeCase.snakeCase(type) === 'profile_update') ? SignPlaceholderNonFiltered : Placeholder;
    Placeholder = (['transfer', 'delegate_vesting_shares'].includes(changeCase.snakeCase(type))) ? SignPlaceholderTransferDelegate : Placeholder;
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
              {step === 'form' &&
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
              {step === 'signin' && <SignForm roles={op.roles} sign={this.sign} title="Log in to confirm the operation" />}
              {step === 'signin' && <Link className="cancel-link" onClick={() => this.setState({ step: 'form' })}>Cancel</Link>}
              {step === 'result' && success && <SignSuccess result={success} cb={normalizedQuery.cb} />}
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
