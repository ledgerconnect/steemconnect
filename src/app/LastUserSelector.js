import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';
import EditImageHeader from './../header/EditImageHeader';
import cookie from '../../lib/cookie';

class LastUserSelector extends Component {
  constructor(props) {
    super(props);
    let lastUserList = cookie.get('last_users');
    if (!_.isArray(lastUserList)) {
      lastUserList = [];
    }
    this.state = { lastUserList };
  }
  componentWillMount() {
    const { lastUserList } = this.state;
    const { location } = this.props;
    if (location.state && location.state.redirect === false) {
      return;
    }

    if (lastUserList[0] === undefined) {
      this.props.router.push('/login');
    } else if (lastUserList[0]) {
      this.props.router.push({ path: '/login', state: { username: lastUserList[0] } });
    }
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

  selectUser = (username) => {
    const { lastUserList } = this.state;
    const index = lastUserList.indexOf(username);
    if (index >= 0) {
      this.props.router.push({ path: '/login', state: { username } });
    }
  }
  addUser = (event) => {
    event.preventDefault();
    const { lastUserList } = this.state;
    if (this.username.value) {
      lastUserList.push(this.username.value);
      this.username.value = '';
      this.updateUser(lastUserList);
    }
    return false;
  }
  render() {
    const { lastUserList } = this.state;
    return (<div className="block">
      {lastUserList.map((username, index) => (
        <EditImageHeader
          key={index}
          onClick={() => { this.selectUser(username); }}
          username={username} onDelete={this.onDelete}
        />
      )) }
      <form className="form pvx mhl" onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <input autoFocus type="text" placeholder="Username" className="form-control form-control-lg" ref={(c) => { this.username = c; }} />
        </fieldset>
        <fieldset className="form-group">
          <button className="btn btn-secondary" onClick={this.addUser}>Add Account</button>
        </fieldset>
      </form>
    </div>);
  }
}

LastUserSelector.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({}),
};

export default withRouter(LastUserSelector);
