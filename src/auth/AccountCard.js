import React, { Component, PropTypes } from 'react';
import cookie from '../../lib/cookie';

class AccountCard extends Component {
  render() {
    return (<div className="account-card" style={{ backgroundImage: `url(https://img.busy6.com/@${this.props.username}/cover` }}>
      <a><img className="profile-image" alt={`@${this.props.username}`} src={`https://img.busy6.com/@${this.props.username}`} /></a>
      <h2 className="mts">
        @{this.props.username} <a
        title="Remove Account"
        className="icon icon-sm material-icons"
        onClick={(event) => {
          event.preventDefault();
          cookie.deleteUser(this.props.username);
          return false;
        }}
      >remove</a>
      </h2>
    </div>);
  }
}

AccountCard.propTypes = {
  username: PropTypes.string.isRequired
};

export default AccountCard;
