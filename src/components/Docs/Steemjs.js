import React from 'react';
import { Link } from 'react-router';
import changeCase from 'change-case';
import methods from 'steem/lib/api/methods.json';
import operations from 'steem/lib/broadcast/operations.json';

const Method = ({ method }) => {
  const inlineParams = method.params
    ? method.params.join(', ') + ', ' :
    '';
  return (
    <div className="mb-5">
      <h4>
        <a href={`#api/${method.method}`} name={`api/${method.method}`}>
          {changeCase.titleCase(method.method)}
        </a>
      </h4>
      <pre>
        <code>
          {`steem.api.${changeCase.camelCase(method.method)}(${inlineParams}function(err, result) {
    console.log(err, result);
  });`}
        </code>
      </pre>
    </div>
  );
};

const Operation = ({ operation }) => {
  const inlineParams = operation.params
    ? operation.params.map((param) => changeCase.camelCase(param)).join(', ') + ', '
    : '';
  let signLink = `/sign/${operation.operation}`;
  if (operation.params) {
    signLink += '?' + operation.params.map((param) => param).join('=value&') + '=value';
  }
  const inlineRoles = operation.roles.join(', ');
  return (
    <div className="mb-5">
      <h4>
        <a href={`#broadcast/${operation.operation}`} name={`broadcast/${operation.operation}`}>
          {changeCase.titleCase(operation.operation)}
        </a>
      </h4>
      <p><b>Required authority:</b> {inlineRoles}. <Link to={signLink}>Try it</Link></p>
      <pre>
        <code>
          {`steem.broadcast.${changeCase.camelCase(operation.operation)}(wif, ${inlineParams}function(err, result) {
    console.log(err, result);
  });`}
        </code>
      </pre>
    </div>
  )
};

const Steemjs = () => {
  return (
    <div className="container my-5">
      <h2><a href="#api" name="api">API</a></h2>
      {methods.map((method, key) =>
        <Method key={key} method={method} />
      )}
      <h2><a href="#broadcast" name="broadcast">Broadcast</a></h2>
      {operations.map((operation, key) =>
        <Operation key={key} operation={operation} />
      )}
    </div>
  );
};

export default Steemjs;
