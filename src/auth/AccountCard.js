import React, { Component, PropTypes } from 'react';
import cookie from './../../lib/cookie';

class AccountCard extends Component {
  render() {
    var userBackground = {
      background: `radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.0980392), rgba(0, 0, 0, 0.6)), url("https://img.busy.org/@${this.props.username}/cover")`,
      backgroundSize: `cover`,
      backgroundPosition: `center`,
    };
    return (<div className="account-card" style={userBackground}>
      <a><img className="profile-image" alt={`@${this.props.username}`} src={`https://img.busy.org/@${this.props.username}`} /></a>
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
