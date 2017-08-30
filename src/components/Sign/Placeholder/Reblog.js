import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderReblog = ({ type, query }) =>
  <div>
    <h2>{ changeCase.titleCase(type) }</h2>
    <table className="table text-left">
      <tbody>
        <tr>
          <td className="label">
            <b>Author</b>
          </td>
          <td>
            {query.author}
          </td>
        </tr>
        <tr>
          <td className="label">
            <b>Permlink</b>
          </td>
          <td>
            {query.permlink}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
;

export default SignPlaceholderReblog;
