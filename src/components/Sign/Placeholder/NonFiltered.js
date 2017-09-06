import React, { PropTypes } from 'react';
import changeCase from 'change-case';

const SignPlaceholderNonFilterer = ({
  query,
}) =>
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
;

SignPlaceholderNonFilterer.propTypes = {
  query: PropTypes.shape(),
};

export default SignPlaceholderNonFilterer;
