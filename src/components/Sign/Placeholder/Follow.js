import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderFollow = ({ type, query }) =>
  <div>
    <h2>{ changeCase.titleCase(type) }</h2>
    <table className="table text-left">
      <tbody>
        {query.json && JSON.parse(query.json)[1].follower &&
        <tr>
          <td className="label"><b>Follower</b></td>
          <td>{JSON.parse(query.json)[1].follower}</td>
        </tr>
        }
        {query.json && JSON.parse(query.json)[1].following &&
        <tr>
          <td className="label"><b>Following</b></td>
          <td>{JSON.parse(query.json)[1].following}</td>
        </tr>
        }
      </tbody>
    </table>
  </div>
;
export default SignPlaceholderFollow;
