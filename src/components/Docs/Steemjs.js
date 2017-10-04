import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
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
  method: PropTypes.shape(),
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
      <p><b><FormattedMessage id="required_authority" />:</b> {inlineRoles}. <a href={signLink} target="_blank" rel="noopener noreferrer"><FormattedMessage id="try_it" /></a></p>
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
  operation: PropTypes.shape(),
};

const Steemjs = () =>
  <div className="container my-5">
    <h1><FormattedMessage id="steemjs" /></h1>
    <p>
      <FormattedMessage
        id="steemjs_doc"
        values={{
          version: pkg.version,
          source: <a href="https://github.com/steemit/steem-js"><FormattedMessage id="source_code" /></a>,
          api: <a href="#api"><FormattedMessage id="api_methods" /></a>,
          operations: <a href="#broadcast"><FormattedMessage id="api_methods" /></a>,
        }}
      />
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
