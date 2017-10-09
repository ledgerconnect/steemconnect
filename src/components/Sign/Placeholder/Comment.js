import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

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
        ? <p><FormattedMessage id="reply_post" values={{ author: <b>@{query.parent_author}</b> }} /></p>
        : <p><FormattedMessage id="add_new_post" /></p>
      }
      <ul className="Placeholder__operation-params">
        {query.title &&
        <li>
          <strong><FormattedMessage id="title" /></strong>
          <span>{query.title}</span>
        </li>
        }
        {query.body &&
        <li>
          <strong><FormattedMessage id="body" /></strong>
          <span>{query.body}</span>
        </li>
        }
        {query.json_metadata &&
        <li>
          <strong><FormattedMessage id="json_metadata" /></strong>
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
