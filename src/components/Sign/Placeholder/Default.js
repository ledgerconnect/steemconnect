import React, { PropTypes } from 'react';
import changeCase from 'change-case';

const SignPlaceholderDefault = ({
  type,
  query,
  params,
}) =>
  <div>
    <h2>{ changeCase.titleCase(type) }</h2>
    <table className="table text-left">
      <tbody>
        {params.map((param, key) =>
          query[param] &&
            <tr key={key}>
              <td className="label">
                <b>{changeCase.titleCase(param)}</b>
              </td>
              <td>
                {query[param]}
              </td>
            </tr>
        )}
      </tbody>
    </table>
  </div>
;

SignPlaceholderDefault.propTypes = {
  type: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  query: PropTypes.object,
  params: PropTypes.arrayOf(PropTypes.string),
};

export default SignPlaceholderDefault;
