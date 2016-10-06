import React, { PropTypes } from 'react';

const AccountCard = (props) => {
  return (<div style={{ backgroundImage: `url(https://img.busy6.com/@${props.username}/cover` }}>
    <a><img className="profile-image" alt={`@${props.username}`} src={`https://img.busy6.com/@${props.username}`} /></a>
    <h2>
      @{props.username} <a className="icon icon-sm material-icons"
        onClick={(event) => { event.preventDefault(); props.onDelete(props.username); return false; }}
      >remove_circle</a>
    </h2>
  </div>);
};

AccountCard.propTypes = {
  username: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default AccountCard;
