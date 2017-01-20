import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderDefault = ({
  type,
  query,
  params,
}) => {
  return (
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
  );
};

export default SignPlaceholderDefault;
