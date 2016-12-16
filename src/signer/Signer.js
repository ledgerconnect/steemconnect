import React from 'react';
import decamelize from 'decamelize';

import operations from './operations.json';

const Signer = (props) => {
  const { type } = props.params || props.params;
  const query = props.location.query;

  const ops = operations.filter(op =>
    op.operation === decamelize(type)
  );

  let isValid = false;
  const missingParams = [];
  let roles = '';
  if (ops[0]) {
    isValid = true;
    ops[0].params.forEach((param) => {
      if (!query[param]) {
        isValid = false;
        missingParams.push(param);
      }
    });
    roles = ops[0].roles.map(role =>
      ` or ${role}`
    );
  }

  const username = query.voter || query.from;

  console.log(isValid);
  console.log(missingParams);

  return (
    <div className="container my-3 text-xs-left">
      { ops[0] && <h3>Type: {type}</h3> }
      { ops[0] && isValid
        ? <div>
          <h3>Parameters</h3>
          <pre>
            <code>
              { JSON.stringify(query, null, '  ') }
            </code>
          </pre>
        </div>
        : <h3>Some params is missing</h3>
      }
      { roles.length &&
        <div>
          <h3>This operation require a password{ roles } WIF</h3>
          <input className="form-control form-control-lg" defaultValue={username} placeholder="Username" type="text" />
          <input className="form-control form-control-lg" placeholder={`Password${roles} WIF`} type="password" />
        </div>
      }
      <button type="submit" className="btn btn-success">Confirm</button>
    </div>
  );
};

export default Signer;
