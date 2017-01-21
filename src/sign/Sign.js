import React, { Component } from 'react';
import steem from 'steem';
import SignForm from './SignForm';
import SignSuccess from '../sign/SignSuccess';
import SignError from '../sign/SignError';
import { getOperation, parseQuery } from '../helpers/operationHelpers';
import SignPlaceholderDefault from './Placeholder/SignPlaceholderDefault';
import SignPlaceholderComment from './Placeholder/SignPlaceholderComment';
import Loading from '../widgets/Loading';
import './Sign.scss';

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
          {step === 3 && success && <SignSuccess result={success} />}
          {step === 3 && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}
