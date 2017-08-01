import React, { Component } from 'react';
import steem from 'steem';
import changeCase from 'change-case';
import SignForm from './Form/Sign';
import SignSuccess from './Sign/Success';
import SignError from './Sign/Error';
import SignValidationError from './Sign/ValidationError';
import { getOperation, parseQuery } from '../../helpers/operation';
import SignPlaceholderDefault from './Sign/Placeholder/Default';
import SignPlaceholderComment from './Sign/Placeholder/Comment';
import SignPlaceholderFollow from './Sign/Placeholder/Follow';
import Loading from '../widgets/Loading';
import './Sign.less';

export default class Sign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.params.type,
      query: this.props.location.query,
      step: 0,
      success: false,
      error: false,
      validationErrors: null
    };
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
    const parsedQuery = parseQuery(type, query, auth.username);
    const _query = parsedQuery.query;
    const _type = parsedQuery.type;
    const validationErrors = parsedQuery.errors;
    console.log(parsedQuery);
    if (validationErrors && validationErrors.length > 0) {
      this.setState({ validationErrors, step: 3 });
    } else {
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
      steem.broadcast[`${changeCase.camelCase(_type)}With`](auth.wif, params, (err, result) => {
        if (!err) {
          this.setState({ success: result });
        } else {
          console.log(err);
          this.setState({ error: err });
        }
        this.setState({ step: 3 });
      });
    }
  };

  render() {
    const { step, success, error, validationErrors, query, type } = this.state;
    const op = getOperation(type);
    let Placeholder = SignPlaceholderDefault;
    Placeholder = (type === 'comment') ? SignPlaceholderComment : Placeholder;
    Placeholder = (type === 'follow') ? SignPlaceholderFollow : Placeholder;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 0 &&
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
