import React, { Component } from 'react';
import steem from 'steem';
import changeCase from 'change-case';
import SignForm from './Form/Sign';
import SignSuccess from './Sign/Success';
import SignError from './Sign/Error';
import SignValidationErrors from './Sign/ValidationErrors';
import { getOperation, parseQuery, validate } from '../../helpers/operation';
import SignPlaceholderDefault from './Sign/Placeholder/Default';
import SignPlaceholderComment from './Sign/Placeholder/Comment';
import Loading from '../widgets/Loading';
import './Sign.less';

export default class Sign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.params.type,
      query: this.props.location.query,
      step: 'loading',
      success: false,
      error: false,
    };
  }

  async componentWillMount() {
    const { type, query } = this.state;
    const validationErrors = await validate(type, query);
    if (validationErrors.length > 0) {
      this.setState({ validationErrors, step: 'validationErrors' });
    } else {
      this.setState({ step: 'form' });
    }
  }

  resetForm = () => {
    this.setState({
      step: 'form',
      error: false,
      success: false,
    });
  };

  sign = (auth) => {
    this.setState({ step: 'loading' });

    const { type, query } = this.state;
    const parsedQuery = parseQuery(type, query, auth.username);

    /* Parse params */
    const params = {};
    Object.keys(parsedQuery).forEach((key) => {
      if (isNaN(parsedQuery[key]) || parsedQuery[key] === '') {
        params[key] = parsedQuery[key];
      } else {
        params[key] = parseInt(parsedQuery[key]);
      }
    });

    /* Broadcast */
    steem.broadcast[`${changeCase.camelCase(type)}With`](auth.wif, params, (err, result) => {
      if (!err) {
        this.setState({ success: result });
      } else {
        console.log(err);
        this.setState({ error: err });
      }
      this.setState({ step: 'result' });
    });
  };

  render() {
    const { step, success, error, validationErrors, query, type } = this.state;
    const op = getOperation(type);
    let Placeholder = SignPlaceholderDefault;
    Placeholder = (type === 'comment') ? SignPlaceholderComment : Placeholder;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 'validationErrors' && <SignValidationErrors errors={validationErrors} />}
          {step === 'form' &&
            <div>
              <Placeholder type={type} query={query} params={op.params} />
              <div className="form-group my-4">
                <button
                  onClick={() => this.setState({ step: 'signin' })}
                  className="btn btn-success"
                >
                  Continue
                </button>
              </div>
            </div>
          }
          {step === 'signin' && <SignForm roles={op.roles} sign={this.sign} />}
          {step === 'loading' && <Loading />}
          {step === 'result' && success && <SignSuccess result={success} cb={query.cb} />}
          {step === 'result' && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}
