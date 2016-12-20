import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderDefault = ({
  query,
  params,
}) => {
  return (
    <ul className="list-group text-xs-left">
      {
        params.map((param, key) =>
          <li className="list-group-item" key={key}>
            { changeCase.titleCase(param) }:
            <b> { query[param] }</b>
          </li>
        )
      }
    </ul>
  );
};

export default SignPlaceholderDefault;
