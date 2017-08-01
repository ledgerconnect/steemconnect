import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderFollow = ({ type, query }) =>
  <div>
    <h2>{ changeCase.titleCase(type) }</h2>
    <table className="table text-left">
      <tbody>
        {query.following &&
        <tr>
          <td className="label"><b>Following</b></td>
          <td>{query.following}</td>
        </tr>
        }
      </tbody>
    </table>
  </div>
;
export default SignPlaceholderFollow;
