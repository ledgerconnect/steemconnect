import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import cookie from '../../lib/cookie';

class AccountCard extends Component {
  constructor(props) {
    super(props);
    let lastUserList = cookie.get('last_users');
    if (!_.isArray(lastUserList)) {
      lastUserList = [];
    }
    this.state = { lastUserList };
  }

  onDelete = (username) => {
    const { lastUserList } = this.state;
    const index = lastUserList.indexOf(username);
    if (index >= 0) {
      lastUserList.splice(index, 1);
      this.updateUser(lastUserList);
    }
  }

  updateUser = (lastUserList) => {
    this.setState({ lastUserList });
    cookie.save(lastUserList, 'last_users');
  }

  render() {
    return (<div className="account-card" style={{ backgroundImage: `url(https://img.busy6.com/@${this.props.username}/cover` }}>
      <a><img className="profile-image" alt={`@${this.props.username}`} src={`https://img.busy6.com/@${this.props.username}`} /></a>
      <h2 className="mts">
        @{this.props.username} <a
        title="Remove Account"
        className="icon icon-sm material-icons"
        onClick={(event) => {
          event.preventDefault();
          this.props.onDelete(this.props.username);
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
