import React, { Component, PropTypes } from 'react';
import steem from 'steem';
import changeCase from 'change-case';
import SignForm from './Form/Sign';
import SignSuccess from './Sign/Success';
import SignError from './Sign/Error';
import SignValidationErrors from './Sign/ValidationErrors';
import { getOperation, parseQuery, validate, normalize } from '../../helpers/operation';
import customOperations from '../../helpers/operations/custom-operations';
import SignPlaceholderDefault from './Sign/Placeholder/Default';
import SignPlaceholderComment from './Sign/Placeholder/Comment';
import SignPlaceholderNonFiltered from './Sign/Placeholder/NonFiltered';
import Loading from '../widgets/Loading';
import './Sign.less';

export default class Sign extends Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    location: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object,
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
    this.setState({ step: 'loading' });

    const { type, query } = this.state;
    const parsedQuery = await parseQuery(type, query, auth.username);
    /* Parse params */
    const params = {};
    Object.keys(parsedQuery).forEach((key) => {
      if (isNaN(parsedQuery[key]) || parsedQuery[key] === '') {
        params[key] = parsedQuery[key];
      } else {
        params[key] = parseInt(parsedQuery[key], 10);
      }
    });

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
    return (
      <div className={`Sign ${step === 'signin' ? 'Sign__signin-top-wrapper' : ''}`}>
        <div className={`Sign__content ${step === 'signin' ? 'Sign__signin-wrapper' : ''}`}>
          {step === 'signin' &&
          <div className="Sign__signin-warning">Confirm that you are on steemconnect.com before entering your password</div>}
          {step === 'form' && <div className="Sign__header">
            <object data="/img/logo.svg" type="image/svg+xml" id="logo" />
            <object data="/img/sign/header-bg.svg" type="image/svg+xml" id="header-bg" />
          </div>}
          <div className="Sign__wrapper">
            {step === 'validationErrors' && <SignValidationErrors errors={validationErrors} />}
            {step === 'form' &&
            <div className="Placeholder">
              <h2>Do you want to confirm this operation?</h2>
              <div className="Placeholder__operation-container">
                <h5 className="Placeholder__operation-title">{ changeCase.titleCase(type) }</h5>
                <Placeholder query={normalizedQuery} params={op.params} />
              </div>
              <button onClick={() => this.setState({ step: 'signin' })} className="Placeholder__button">
                Continue
              </button>
            </div>
            }
            {step === 'signin' && <SignForm roles={op.roles} sign={this.sign} title="Log in to confirm the operation" />}
            {step === 'signin' && <button className="Sign__button-link Sign__button-cancel" onClick={() => this.setState({ step: 'form' })}>Cancel</button>}
            {step === 'loading' && <div className="Sign__centered-loading"><Loading /></div>}
            {step === 'result' && success && <SignSuccess result={success} cb={normalizedQuery.cb} />}
            {step === 'result' && error && <SignError error={error} resetForm={this.resetForm} />}
          </div>
          {['signin', 'form'].includes(step) && <div className="Sign__footer">
            <a href="http://v2.steemconnect.com" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
            <span className="separator">|</span>
            <a href="http://v2.steemconnect.com" target="_blank" rel="noopener noreferrer">About SteemConnect</a>
          </div>}
        </div>
      </div>
    );
  }
}
