import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderReblog = ({ type, query }) =>
  <div>
    <h2>{ changeCase.titleCase(type) }</h2>
    <table className="table text-left">
      <tbody>
        {query.json && JSON.parse(query.json)[1].author &&
        <tr>
          <td className="label"><b>Author</b></td>
          <td>{JSON.parse(query.json)[1].author}</td>
        </tr>
        }
        {query.json && JSON.parse(query.json)[1].permlink &&
        <tr>
          <td className="label"><b>Permlink</b></td>
          <td>{JSON.parse(query.json)[1].permlink}</td>
        </tr>
        }
      </tbody>
    </table>
  </div>
;
export default SignPlaceholderReblog;
