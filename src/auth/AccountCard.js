import React, { PropTypes } from 'react';
import Avatar from '../widgets/Avatar';

const AccountCard = props =>
  (<div className="my-2" onClick={props.onClick}>
    <Avatar xl username={props.username} />
    <h2 className="mts">@{props.username}</h2>
  </div>);

AccountCard.propTypes = {
  username: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default AccountCard;
