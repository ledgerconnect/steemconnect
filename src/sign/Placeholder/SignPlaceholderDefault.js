import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderDefault = ({
  type,
  query,
  params,
}) => {
  return (
    <div>
      <h1>{ changeCase.titleCase(type) }</h1>
      <ul className="list-group text-xs-left">
        {
          params.map((param, key) =>
            <li className="list-group-item" key={key}>
              <span className="mr-1">
                { changeCase.titleCase(param) }:
              </span>
              <b>{ query[param] }</b>
            </li>
          )
        }
      </ul>
    </div>
  );
};

export default SignPlaceholderDefault;
