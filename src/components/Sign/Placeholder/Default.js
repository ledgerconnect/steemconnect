import React, { PropTypes } from 'react';
import changeCase from 'change-case';

const SignPlaceholderDefault = ({
  query,
  params,
}) =>
  <div className="Placeholder__operation-content">
    <ul className="Placeholder__operation-params">
      {params.map((param, key) =>
        query[param] &&
        <li key={key}>
          <strong>{changeCase.titleCase(param)}</strong>
          <span>{query[param]}</span>
        </li>
      )}
    </ul>
  </div>
;

SignPlaceholderDefault.propTypes = {
  query: PropTypes.shape(),
  params: PropTypes.arrayOf(PropTypes.string),
};

export default SignPlaceholderDefault;
