import React, { PropTypes } from 'react';
import changeCase from 'change-case';
import pkg from 'steem/package.json';
import methods from 'steem/lib/api/methods';
import operations from 'steem/lib/broadcast/operations';

const Method = ({ method }) => {
  const inlineParams = method.params
    ? `${method.params.join(', ')}, ` :
    '';
  let apiLink = `https://api.steemjs.com/${method.method}`;
  if (method.params) {
    apiLink += `?${method.params.map(param => param).join('=value&')}=value`;
  }
  return (
    <div className="mb-5">
      <h4>
        <a href={`#api/${method.method}`} name={`api/${method.method}`}>
          {changeCase.titleCase(method.method)}
        </a>
      </h4>
      <p><a href={apiLink} target="_blank" rel="noopener noreferrer">Try it</a></p>
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

Method.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  method: PropTypes.object,
};

const Operation = ({ operation }) => {
  const inlineParams = operation.params
    ? `${operation.params.map(param => changeCase.camelCase(param)).join(', ')}, `
    : '';
  let signLink = `/sign/${operation.operation}`;
  if (operation.params) {
    signLink += `?${operation.params.map(param => param).join('=value&')}=value`;
  }
  const inlineRoles = operation.roles.join(', ');
  return (
    <div className="mb-5">
      <h4>
        <a href={`#broadcast/${operation.operation}`} name={`broadcast/${operation.operation}`}>
          {changeCase.titleCase(operation.operation)}
        </a>
      </h4>
      <p><b>Required authority:</b> {inlineRoles}. <a href={signLink} target="_blank" rel="noopener noreferrer">Try it</a></p>
      <pre>
        <code>
          {`steem.broadcast.${changeCase.camelCase(operation.operation)}(wif, ${inlineParams}function(err, result) {
  console.log(err, result);
});`}
        </code>
      </pre>
    </div>
  );
};

Operation.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  operation: PropTypes.object,
};

const Steemjs = () =>
  <div className="container my-5">
    <h1>Steem.js</h1>
    <p>
        This documentation is generated from Steem.js v{pkg.version} <a href="https://github.com/steemit/steem-js">source code</a>.
        It include every <a href="#api">API methods</a> and every <a href="#broadcast">operations</a>.
        You can click on "Try it" link and change default values
        with appropriate parameters to test them.
      </p>
    <h2><a href="#api" name="api">API</a></h2>
    {methods.map((method, key) =>
      <Method key={key} method={method} />
      )}
    <h2><a href="#broadcast" name="broadcast">Broadcast</a></h2>
    {operations.map((operation, key) =>
      <Operation key={key} operation={operation} />
      )}
  </div>
;

export default Steemjs;
