import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderDefault = ({
  query,
  params,
}) => {
  return (
    <div>
      {
        params.map((param, key) =>
          <h5 key={key}>
            <small>{ changeCase.titleCase(param) }: </small>
            <br/>
            <b>{ query[param] }</b>
          </h5>
        )
      }
    </div>
  );
};

export default SignPlaceholderDefault;
