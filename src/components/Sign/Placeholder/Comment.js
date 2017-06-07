import React from 'react';
import changeCase from 'change-case';

const SignPlaceholderComment = ({
  type,
  query,
}) => {
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(query.json_metadata); }
  catch (e) { jsonMetadata = {}; }
  return (
    <div>
      <h2>{ changeCase.titleCase(type) }</h2>
      {query.parent_author && query.parent_permlink
        ? <p>Do you want to reply on <b>@{query.parent_author}</b>'s post?</p>
        : <p>Do you want to add new post?</p>
      }
      <table className="table text-left">
        <tbody>
          {query.title &&
            <tr>
              <td className="label"><b>Title</b></td>
              <td>{query.title}</td>
            </tr>
          }
          {query.body &&
            <tr>
              <td className="label"><b>Body</b></td>
              <td>{query.body}</td>
            </tr>
          }
          {query.json_metadata &&
            <tr>
              <td className="label"><b>Json Metadata</b></td>
              <td>
                <pre>{JSON.stringify(jsonMetadata, null, 2)}</pre>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default SignPlaceholderComment;
