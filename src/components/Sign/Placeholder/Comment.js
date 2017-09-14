import React, { PropTypes } from 'react';

const SignPlaceholderComment = ({
  query,
}) => {
  let jsonMetadata = {};
  try {
    jsonMetadata = JSON.parse(query.json_metadata);
  } catch (e) {
    jsonMetadata = {};
  }
  return (
    <div className="Placeholder__operation-content">
      {query.parent_author && query.parent_permlink
        ? <p>Do you want to reply on <b>@{query.parent_author}</b>'s post?</p>
        : <p>Do you want to add new post?</p>
      }
      <ul className="Placeholder__operation-params">
        {query.title &&
        <li>
          <strong>Title</strong>
          <span>{query.title}</span>
        </li>
        }
        {query.body &&
        <li>
          <strong>Body</strong>
          <span>{query.body}</span>
        </li>
        }
        {query.json_metadata &&
        <li>
          <strong>Json Metadata</strong>
          <span>
            <pre>{JSON.stringify(jsonMetadata, null, 2)}</pre>
          </span>
        </li>
        }
      </ul>
    </div>
  );
};

SignPlaceholderComment.propTypes = {
  query: PropTypes.shape(),
};

export default SignPlaceholderComment;
