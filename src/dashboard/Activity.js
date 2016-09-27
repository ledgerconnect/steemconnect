import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';

const Activity = ({ id, transaction }) => {
  const { op, timestamp } = transaction;
  const [name, details] = op;
  const label = name.replace('account_update', 'Account Update').replace('vote', 'Vote');
  if (name === 'vote') {
    return <p key={id}>{label} for <a href="#" rel="noopener noreferrer" target="_blank"> @{details.author}/{details.permlink}</a> {moment(timestamp).fromNow() }</p>;
  } else if (_.includes(['account_update', 'vote'], name)) {
    return <p key={id}>{label} {moment(timestamp).fromNow() }</p>;
  }
  return <p key={id}>{label} {moment(timestamp).fromNow() }</p>;
};

Activity.propTypes = {
  transaction: PropTypes.shape({}),
  id: PropTypes.number.isRequired,
};

export default Activity;
