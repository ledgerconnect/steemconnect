import React, { Component } from 'react';
import decamelize from 'decamelize';
import steem from 'steem';
import qs from 'query-string';

import methods from 'steem/lib/methods.json';

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { query } = this.props.location;
    const { type } = this.props.params;

    const filterMethods = methods.filter(m =>
      m.method === decamelize(type)
    );
    const method = filterMethods[0] ? filterMethods[0] : '';

    const queryString = qs.stringify(query);
    const url = queryString
      ? `https://api.steemjs.com/${type}?${queryString}`
      : `https://api.steemjs.com/${type}`;

    return (
      <div className="container my-3">
        { method
          ? <h2>{type}</h2>
          : <h4>The method <b>"{type}"</b> is not available.</h4>
        }

        { method &&
          <pre>
            {
              method.params && method.params.map((param, key) => {
                return <span key={key}>
                  <b>{param}: </b>
                  <br/>
                </span>;
              })
            }
          </pre>
        }

        <p>
          <a href={url}>
            { url }
          </a>
        </p>
      </div>
    );
  }
}

