import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderCustomJSON = ({ type, query }) =>
  <div>
    <h2>{ changeCase.titleCase(type) }</h2>
    <table className="table text-left">
      <tbody>
        {query.id &&
        <tr>
          <td className="label"><b>Id</b></td>
          <td>{query.id}</td>
        </tr>
        }
        {query.required_auths &&
        <tr>
          <td className="label"><b>Required Auths</b></td>
          <td>{query.required_auths}</td>
        </tr>
        }
        {query.required_posting_auths && query.required_posting_auths[0] &&
        <tr>
          <td className="label"><b>Required Posting Auths</b></td>
          <td>{query.required_posting_auths[0]}</td>
        </tr>
        }
        {query.json &&
        <tr>
          <td className="label"><b>JSON</b></td>
          <td>{query.json}</td>
        </tr>
        }
      </tbody>
    </table>
  </div>
;
export default SignPlaceholderCustomJSON;
