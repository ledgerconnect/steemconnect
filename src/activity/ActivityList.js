import React, { PropTypes } from 'react';
import moment from 'moment';

const Activity = ({ id, transaction }) => {
  const { op, timestamp } = transaction;
  const [name, details] = op;
  const label = name
    .replace('account_update', 'Account Update')
    .replace('vote', 'Vote')
    .replace('comment', 'Comment')
    .replace('reblog', 'Reblog')
    .replace('follow', 'Follow')
    .replace('transfer_to_vesting', 'Power Up')
    .replace('curation_reward', 'Curation Reward');
  if (name === 'vote') {
    return (
        <li className="list-element pam" key={id}>
          <div className="list-container">
            <h3 className="list-title man">{label}</h3>
            <span className="list-description">
              for <a target="_blank">
                @{details.author}/{details.permlink}
              </a>
            </span>
          </div>
          <span className="list-date">
            {moment(timestamp).fromNow() }
          </span>
        </li>
      );
  }
  if (name === 'comment') {
    return (
      <li className="list-element pam" key={id}>
        <div className="list-container">
          <h3 className="list-title man">{label}</h3>
          <span className="list-description">
              on <a target="_blank">
                @{details.parent_author}/{details.parent_permlink}
              </a>
            </span>
        </div>
        <span className="list-date">
            {moment(timestamp).fromNow() }
          </span>
      </li>
    );
  }
  return (
    <li className="list-element pam" key={id}>
      <div className="list-container">
        <h3 className="list-title man">{label}</h3>
      </div>
      <span className="list-date">{moment(timestamp).fromNow() }</span>
    </li>
  );
};

Activity.propTypes = {
  transaction: PropTypes.shape({}),
  id: PropTypes.number.isRequired,
};

export default Activity;
