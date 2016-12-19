import React, { Component } from 'react';
import steem from 'steem';

import { getOperation, isValid } from '../helpers/operationHelpers';

import './Operation.scss';

export default class Header extends Component {
  constructor(props) {
    super(props);
    const query = props.location.query;
    const username = query.voter || query.from || null;
    this.state = {
      username,
      password: '',
      errors: [],
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { type } = this.props.params;
    const op = getOperation(type);
    const username = this.state.username.value;
    const password = this.state.password.value;
    const wif = steem.auth.isWif(password)
      ? password
      : steem.auth.toWif(username, password, op['roles'][0]);
    //console.log(username, password, wif, op['roles'][0]);

    let query = this.props.location.query;
    query.wif = wif;

    console.log(steem.broadcast.vote);
    console.log(steem.broadcast.voteWith);
    console.log(steem.broadcast.voteAsync);
    console.log(steem.broadcast.voteWithAsync);

    steem.broadcast[`${type}With`](query, (err, result) => {
      console.log(err, result);
    });
  };

  render() {
    const { type } = this.props.params;
    const query = this.props.location.query;
    const op = getOperation(type);
    const opIsValid = isValid(op, query);

    return (
      <div className="Signer container my-3">
        { op
          ? <h2>{type}</h2>
          : <h4>The operation <b>"{type}"</b> is not available.</h4>
        }

        { op && !opIsValid &&
          <p>Some operation parameters are missing.</p>
        }

        { op &&
          <pre>
            {
              op.params.map((param, key) => {
                return <span key={key}>
                  <b>{param}: </b>
                  { query[param] === undefined
                    ? <span className="alert-danger">?</span>
                    : query[param]
                  }
                  <br/>
                </span>;
              })
            }
          </pre>
        }

        { op && opIsValid &&
          <form className="Signer__form" onSubmit={this.handleSubmit}>
            <p>This operation require a password or WIF</p>
            <div className="form-group">
              <input
                ref={(c) => { this.state.username = c; }}
                placeholder="Username"
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                ref={(c) => { this.state.password = c; }}
                name="password"
                placeholder={`Password or WIF`}
                type="password"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-success">Confirm</button>
            </div>
          </form>
        }
      </div>
    );
  }
}

