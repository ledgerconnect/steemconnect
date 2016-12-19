import React, { Component } from 'react';

import { getOperation, isValid } from '../helpers/operationHelpers';

import './Sign.scss';

export default class Operation extends Component {
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

  render() {
    const { type } = this.props.params;
    const query = this.props.location.query;
    const op = getOperation(type);
    const opIsValid = isValid(op, query);

    return (
      <div className="container my-3">
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
      </div>
    );
  }
}

