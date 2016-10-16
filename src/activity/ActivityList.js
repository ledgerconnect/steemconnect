import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';

const Activity = ({ id, transaction }) => {
  const { op, timestamp } = transaction;
  const [name, details] = op;
  const label = name.replace('account_update', 'Account Update').replace('vote', 'Vote');
  if (name === 'vote') {
    return (
        <li className="list-element pas" key={id}>
          <div className="list-container">
            <h3 className="list-title man">{label}</h3>
            <span className="list-description">
              for <a href="#" rel="noopener noreferrer" target="_blank">@{details.author}/{details.permlink}</a>
            </span>
          </div>
          <span className="list-date">
            {moment(timestamp).fromNow() }
          </span>
        </li>
      );
  } else if (_.includes(['account_update', 'vote'], name)) {
    return (
      <li className="list-element pas" key={id}>
        <div className="list-container">
          <h3 className="list-title man">{label}</h3>
          <span className="list-description">
          </span>
        </div>
        <span className="list-date">
          {moment(timestamp).fromNow() }
        </span>
      </li>
    );
  }
  return (
    <li className="list-element pas" key={id}>
      <div className="list-container">
        <h3 className="list-title man">{label}</h3>
        <span className="list-description">
        </span>
      </div>
      <span className="list-date">
        {moment(timestamp).fromNow() }
      </span>
    </li>
  );
};

Activity.propTypes = {
  transaction: PropTypes.shape({}),
  id: PropTypes.number.isRequired,
};

export default Activity;
