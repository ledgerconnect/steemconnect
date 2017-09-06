import React, { PropTypes } from 'react';
import changeCase from 'change-case';

const SignPlaceholderDefault = ({
  type,
  query,
  params,
}) =>
  <div className="Signin__placeholder">
    <h2>Do you want to confirm this operation ?</h2>
    <div className="operation-container">
      <h5 className="operation-title">{ changeCase.titleCase(type) }</h5>
      <div className="operation-content">
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
    </div>
  </div>
;

SignPlaceholderDefault.propTypes = {
  type: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  query: PropTypes.object,
  params: PropTypes.arrayOf(PropTypes.string),
};

export default SignPlaceholderDefault;
