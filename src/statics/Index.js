import React from 'react';
import changeCase from 'change-case';
import methods from 'steem/lib/methods.json';
import operations from 'steem/lib/broadcast/operations.json';

const Method = ({ method }) => {
  const inlineParams = method.params
    ? method.params.join(', ') + ', ' :
    '';
  return (
    <div className="mb-4">
      <h5>{changeCase.titleCase(method.method)}</h5>
      <pre>
        {`steem.api.${changeCase.camelCase(method.method)}(${inlineParams}function(err, result) {
  console.log(err, result);
});`}
      </pre>
    </div>
  );
};

const Operation = ({ operation }) => {
  const inlineParams = operation.params
    ? operation.params.map((param) => changeCase.camelCase(param)).join(', ') + ', '
    : '';
  return (
    <div className="mb-4">
      <h5>{changeCase.titleCase(operation.operation)}</h5>
      <pre>
        {`steem.broadcast.${changeCase.camelCase(operation.operation)}(wif, ${inlineParams}function(err, result) {
  console.log(err, result);
});`}
      </pre>
    </div>
  )
};

const Index = () => {
  return (
    <div className="container my-5">
      <h2>API</h2>
      {methods.map((method, key) =>
        <Method key={key} method={method} />
      )}
      <h2>Broadcast</h2>
      {operations.map((operation, key) =>
        <Operation key={key} operation={operation} />
      )}
    </div>
  );
};

export default Index;
