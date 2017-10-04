import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import changeCase from 'change-case';

const SignPlaceholderComment = ({
  type,
  query,
}) => {
  let jsonMetadata = {};
  try {
    jsonMetadata = JSON.parse(query.json_metadata);
  } catch (e) {
    jsonMetadata = {};
  }
  return (
    <div>
      <h2>{ changeCase.titleCase(type) }</h2>
      {query.parent_author && query.parent_permlink
        ? <p><FormattedMessage id="reply_post" values={{ author: <b>@{query.parent_author}</b> }} /></p>
        : <p><FormattedMessage id="add_new_post" /></p>
      }
      <table className="table text-left">
        <tbody>
          {query.title &&
            <tr>
              <td className="label"><b><FormattedMessage id="title" /></b></td>
              <td>{query.title}</td>
            </tr>
          }
          {query.body &&
            <tr>
              <td className="label"><b><FormattedMessage id="body" /></b></td>
              <td>{query.body}</td>
            </tr>
          }
          {query.json_metadata &&
            <tr>
              <td className="label"><b><FormattedMessage id="json_metadata" /></b></td>
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

SignPlaceholderComment.propTypes = {
  type: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  query: PropTypes.object,
};

export default SignPlaceholderComment;
