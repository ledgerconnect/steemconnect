import React, { Component, PropTypes } from 'react';
import cookie from '../../lib/cookie';
import Avatar from '../widgets/Avatar';

class AccountCard extends Component {
  render() {
    return (<div className="account-card">
      <Avatar xl username={this.props.username} />
      <h2 className="mts">@{this.props.username}</h2>
    </div>);
  }
}

AccountCard.propTypes = {
  username: PropTypes.string.isRequired
};

export default AccountCard;
