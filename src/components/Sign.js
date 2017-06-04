import React, { Component } from 'react';
import steem from 'steem';
import SignForm from './Sign/SignForm';
import SignSuccess from './Sign/SignSuccess';
import SignError from './Sign/SignError';
import { getOperation, parseQuery } from '../utils/operation';
import SignPlaceholderDefault from './Sign/Placeholder/SignPlaceholderDefault';
import SignPlaceholderComment from './Sign/Placeholder/SignPlaceholderComment';
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
    console.log(parsedQuery);

    /* Parse params */
    const params = {};
    for (const key in query) {
      params[key] = isNaN(query[key]) || query[key] == ''
        ? query[key]
        : parseInt(query[key]);
    }

    /* Broadcast */
    this.setState({ step: 2 });
    steem.broadcast[`${type}With`](auth.wif, params, (err, result) => {
      if (!err) {
        this.setState({ success: result });
      } else {
        console.log(err);
        this.setState({ error: err.payload.error });
      }
      this.setState({ step: 3 });
    });
  };

  render() {
    const { step, success, error, query, type } = this.state;
    const op = getOperation(type);
    let Placeholder = SignPlaceholderDefault;
    Placeholder = (type === 'comment') ? SignPlaceholderComment : Placeholder;
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
          {step === 3 && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}
