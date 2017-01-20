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
      <h1>{ changeCase.titleCase(type) }</h1>
      {query.parent_author && query.parent_permlink
        ? <p>Do you want to reply on <b>@{query.parent_author}</b>'s post?</p>
        : <p>Do you want to add new post?</p>
      }
      <ul className="list-group">
        {query.title &&
          <li className="list-group-item">
            <span className="mr-2">Title:</span>
            <b>{query.title}</b>
          </li>
        }
        {query.body &&
          <li className="list-group-item">
            <b>{query.body}</b>
          </li>
        }
        {query.json_metadata &&
          <li className="list-group-item">
            <div>
              <p>Metadata: </p>
              <pre>{JSON.stringify(jsonMetadata, null, 2)}</pre>
            </div>
          </li>
        }
      </ul>
    </div>
  );
};

export default SignPlaceholderComment;
