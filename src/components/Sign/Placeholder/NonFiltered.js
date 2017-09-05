import React, { PropTypes } from 'react';
import changeCase from 'change-case';

const SignPlaceholderNonFilterer = ({
  type,
  query,
}) =>
  <div className="Signin__placeholder">
    <h2>Do you want to confirm this operation ?</h2>
    <div className="operation-container">
      <h5 className="operation-title">{ changeCase.titleCase(type) }</h5>
      <div className="operation-content">
        <table className="table text-left">
          <tbody>
            {Object.keys(query).map(key =>
              query[key] &&
              <tr key={key}>
                <td className="label">
                  <b>{changeCase.titleCase(key)}</b>
                </td>
                <td>
                  {query[key]}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
;

SignPlaceholderNonFilterer.propTypes = {
  type: PropTypes.string,
  query: PropTypes.shape(),
};

export default SignPlaceholderNonFilterer;
