import React from 'react';
import { Link } from 'react-router';

import methods from 'steem/lib/methods.json';
import operations from '../helpers/operations.json';

const Index = () => {
  return (
    <div className="container my-3">
      <h2>Methods</h2>
      {
        methods.map((method, key) =>
          <span key={key}>
            <Link to={`/method/${method.method}`}>
              {method.method}
            </Link>
            <br/>
          </span>
        )
      }
      <hr/>
      <h2>Operations</h2>
      {
        operations.map((operation, key) =>
          <span key={key}>
            <Link to={`/operation/${operation.operation}`}>
              {operation.operation}
            </Link>
            <br/>
          </span>
        )
      }
    </div>
  );
};

export default Index;
