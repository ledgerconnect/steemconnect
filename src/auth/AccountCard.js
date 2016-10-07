import React, { PropTypes } from 'react';

const AccountCard = (props) => {
  return (<div className="account-card" style={{ backgroundImage: `url(https://img.busy6.com/@${props.username}/cover` }}>
  <span className="change-user">
    <a onClick={props.showUserList}>Not you?</a>
  </span>
 <a><img className="profile-image" alt={`@${props.username}`} src={`https://img.busy6.com/@${props.username}`} /></a>
    <h2 className="mts">
      @{props.username} <a
        title="Remove Account"
        className="icon icon-sm material-icons"
        onClick={(event) => {
          event.preventDefault();
          props.onDelete(props.username);
          return false;
        }}
      >remove</a>
    </h2>
  </div>);
};

AccountCard.propTypes = {
  username: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default AccountCard;
