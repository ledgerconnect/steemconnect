import React, { Component } from 'react';
import steem from 'steem';
import changeCase from 'change-case';
import SignForm from './Form/Sign';
import SignSuccess from './Sign/Success';
import SignError from './Sign/Error';
import SignError404 from './Error404';
import SignValidationError from './Sign/ValidationError';
import { getOperation, normalize, validate, setDefaultAuthor } from '../../helpers/operation';
import SignPlaceholderDefault from './Sign/Placeholder/Default';
import SignPlaceholderComment from './Sign/Placeholder/Comment';
import SignPlaceholderCustomJson from './Sign/Placeholder/CustomJson';
import SignPlaceholderFollow from './Sign/Placeholder/Follow';
import SignPlaceholderReblog from './Sign/Placeholder/Reblog';
import SignPlaceholderDelegateVestingShares from './Sign/Placeholder/DelegateVestingShares';
import Loading from '../widgets/Loading';
import './Sign.less';

export default class Sign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.params.type,
      query: this.props.location.query,
      step: 2,
      success: false,
      error: false,
      validationErrors: null
    };
  }

  async componentWillMount() {
    const { type, query } = this.state;
    const validationErrors = await validate(type, query);
    if (validationErrors && validationErrors.errors && validationErrors.errors.length > 0) {
      this.setState({ validationErrors: validationErrors.errors, step: 3 });
    } else {
      const normalizedQuery = await normalize(type, query);
      this.setState({ query: normalizedQuery.query, type: normalizedQuery.type, step: 0 });
    }
  }

  resetForm = () => {
    this.setState({
      step: 0,
      error: false,
      success: false,
    });
  };

  sign = (auth) => {
    const { type, query } = this.state;
    const pType = this.props.params.type;
    const _query = setDefaultAuthor(pType, query, auth.username);

    /* Parse params */
    const params = {};
    Object.keys(_query).forEach((key) => {
      if (isNaN(_query[key]) || _query[key] === '' || typeof _query[key] === 'object') {
        params[key] = _query[key];
      } else {
        params[key] = parseInt(_query[key]);
      }
    });

    /* Broadcast */
    this.setState({ step: 2 });
    steem.broadcast[`${changeCase.camelCase(type)}With`](auth.wif, params, (err, result) => {
      if (!err) {
        this.setState({ success: result });
      } else {
        console.log(err);
        this.setState({ error: err });
      }
      this.setState({ step: 3 });
    });
  };

  render() {
    const { step, success, error, validationErrors, query } = this.state;
    let { type } = this.state;
    const pType = this.props.params.type;
    const op = getOperation(type);
    let Placeholder = SignPlaceholderDefault;
    if (type === 'comment') Placeholder = SignPlaceholderComment;
    else if (pType === 'follow' || pType === 'unfollow' || pType === 'mute' || pType === 'unmute') {
      Placeholder = SignPlaceholderFollow;
      type = pType;
    } else if (pType === 'reblog') {
      Placeholder = SignPlaceholderReblog;
      type = pType;
    } else if (type === 'custom_json') Placeholder = SignPlaceholderCustomJson;
    else if (type === 'delegate_vesting_shares') Placeholder = SignPlaceholderDelegateVestingShares;

    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 0 && !op && <SignError404 />}
          {step === 0 && op &&
            <div>
              <Placeholder type={type} query={query} params={op.params} />
              <div className="form-group my-4">
                <button
                  onClick={() => this.setState({ step: 1 })}
                  className="btn btn-success"
                >
                  Continue
                </button>
              </div>
            </div>
          }
          {step === 1 && <SignForm roles={op.roles} sign={this.sign} />}
          {step === 2 && <Loading />}
          {step === 3 && success && <SignSuccess result={success} cb={query.cb} />}
          {step === 3 && !validationErrors && error && <SignError error={error} resetForm={this.resetForm} />}
          {step === 3 && validationErrors && !error && <SignValidationError errors={validationErrors} />}
        </div>
      </div>
    );
  }
}
