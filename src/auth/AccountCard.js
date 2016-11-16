import React, { Component, PropTypes } from 'react';
import cookie from '../../lib/cookie';
import Avatar from '../widgets/Avatar';

class AccountCard extends Component {
  render() {
    return (<div className="account-card">
      <Avatar xl username={this.props.username} />
      <h2 className="mts">
        @{this.props.username} <a
        title="Remove Account"
        className="hide icon icon-sm material-icons"
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
