import React, { Component } from 'react';
import steem from 'steem';
import changeCase from 'change-case';

import { getOperation, isValid } from '../helpers/operationHelpers';
import SignPlaceholderDefault from './Placeholder/SignPlaceholderDefault';
import Loading from '../widgets/Loading';
import Icon from '../widgets/Icon';

import './Sign.scss';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      approved: false,
      success: false,
      error: false,
      isLoading: false,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { type } = this.props.params;
    const op = getOperation(type);
    const username = this.state.username.value;
    const password = this.state.password.value;

    /* Get wif */
    const wif = steem.auth.isWif(password)
      ? password
      : steem.auth.toWif(username, password, op['roles'][0]);
    console.log(username, password, wif, op['roles'][0]);

    /* Parse params */
    const query = this.props.location.query;
    const params = {};
    for (const key in query) {
      params[key] = isNaN(query[key])
        ? query[key]
        : parseInt(query[key]);
    }

    /* Broadcast */
    this.setState({ isLoading: true });
    steem.broadcast[`${type}With`](wif, params, (err, result) => {
      console.log(err, result);
      !err
        ? this.setState({ success: true })
        : this.setState({ error: true });
      this.setState({ isLoading: false });
    });
  };

  approve() {
    this.setState({ approved: true });
  }

  success() {
    this.setState({ success: true });
  }

  error() {
    this.setState({ error: true });
  }

  render() {
    const {
      approved,
      success,
      error,
      isLoading,
    } = this.state;
    const { type } = this.props.params;
    const query = this.props.location.query;
    const op = getOperation(type);
    const opIsValid = isValid(op, query);

    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          { !opIsValid &&
            <h2>Oops!</h2>
          }

          { isLoading &&
            <Loading />
          }

          {
            opIsValid && !approved &&
            <div>
              <h1>
                { changeCase.titleCase(type) }
              </h1>
              <div className="Sign__placeholder">
                <SignPlaceholderDefault
                  type={type}
                  query={query}
                  params={op.params}
                />
              </div>
              <div className="form-group my-2">
                <button onClick={() => this.approve()} className="btn btn-success">Continue</button>
              </div>
            </div>
          }

          {
            approved && !success && !error &&
              <div>
                <h1>
                  <Icon name="gesture" lg />
                  { ' ' }
                  Sign
                </h1>
                <p>
                  This operation require a password or WIF ({ op.roles.join(', ') }).
                </p>
                <form className="Sign__form" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-addon">
                        <Icon name="perm_identity" sm />
                      </span>
                      <input
                        ref={(c) => { this.state.username = c; }}
                        placeholder="Username"
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-addon">
                        <Icon name="fingerprint" sm />
                      </span>
                      <input
                        ref={(c) => { this.state.password = c; }}
                        name="password"
                        placeholder={`Password or WIF`}
                        type="password"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirm</button>
                  </div>
                </form>
              </div>
          }

          {
            success &&
              <div>
                <h1>
                  <Icon name="done" lg/>
                  { ' ' }
                  Success!
                </h1>
              </div>
          }

          {
            error &&
              <h1>Error!</h1>
          }
        </div>
      </div>
    );
  }
}

