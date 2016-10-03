import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditImageHeader from './../header/EditImageHeader';
import cookie from '../../lib/cookie';
import { selectLoginWithUserName, demoLogin } from './authAction';

class LastUserSelector extends Component {
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

  selectUser = (username) => {
    const { lastUserList } = this.state;
    const index = lastUserList.indexOf(username);
    if (index >= 0) {
      this.props.selectLoginWithUserName(username);
    }
  }
  addUser = (event) => {
    event.preventDefault();
    if (this.username.value) {
      this.props.selectLoginWithUserName(this.username.value);
    }
  }

  demo = (event) => {
    event.preventDefault();
    this.props.demoLogin();
  }

  render() {
    const { lastUserList } = this.state;
    return (<div>
      {lastUserList.map((username, index) => (
        <EditImageHeader
          key={index}
          onClick={() => { this.selectUser(username); }}
          username={username} onDelete={this.onDelete}
        />
      )) }
      <span className="form-span">Log In with your Steem<br /> account</span>
      <form className="form" onSubmit={this.handleSubmit}>
        <fieldset className="form-group man mhs">
          <i className="icon icon-md material-icons form-icon">account_box</i>
          <input autoFocus type="text" placeholder="enter your username" className="form-control form-control-lg lowercase-input text-xs-left form-input" ref={(c) => { this.username = c; }} />
        </fieldset>
        <fieldset className="form-group man">
          <button className="btn btn-primary form-submit" onClick={this.addUser}>Next</button>
        </fieldset>
      </form>
    </div>);
  }
}

LastUserSelector.propTypes = {
  location: PropTypes.shape({}),
  selectLoginWithUserName: PropTypes.func,
  demoLogin: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  selectLoginWithUserName: bindActionCreators(selectLoginWithUserName, dispatch),
  demoLogin: bindActionCreators(demoLogin, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LastUserSelector);
