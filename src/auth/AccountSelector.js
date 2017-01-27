import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loading from './../widgets/Loading';
import AccountCard from './AccountCard';
import cookie from '../../lib/cookie';
import { selectLoginWithUserName, setSelectedUser, demoLogin } from './authAction';

class LastUserSelector extends Component {
  constructor(props) {
    super(props);
    let lastUserList = cookie.get('lastUsers');
    if (!_.isArray(lastUserList)) {
      lastUserList = [];
    }
    this.state = { lastUserList };
  }

  selectUser = (username) => {
    const { lastUserList } = this.state;
    const index = lastUserList.indexOf(username);
    if (index >= 0) {
      this.props.setSelectedUser(username);
    }
  };

  addUser = (event) => {
    event.preventDefault();
    if (this.username.value) {
      this.props.selectLoginWithUserName(this.username.value);
    }
  };

  demo = (event) => {
    event.preventDefault();
    this.props.demoLogin();
  };

  render() {
    const { lastUserList } = this.state;

    return (<div>
      {/* lastUserList.map((username, index) => (
        <AccountCard
          key={index}
          onClick={() => { this.selectUser(username); }}
          username={username} onDelete={this.onDelete}
        />
      )) */}
      {_.isEmpty(lastUserList) && <h3 className="m-5">Log in with your Steem account</h3>}
      {!_.isEmpty(lastUserList) && <h3 className="m-5">Add a Steem account</h3>}
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="input-group input-group-lg">
          <span className="input-group-addon"><i className="icon icon-md material-icons">perm_identity</i></span>
          <input autoFocus type="text" placeholder="Enter your username" className="form-control" ref={(c) => { this.username = c; }} />
        </div>
        {this.props.auth.errorMessage &&
          <ul className="errorMessages p-3">
            <li>{this.props.auth.errorMessage}</li>
          </ul>}
        <fieldset className="form-group m-0">
          <button className="btn btn-primary form-submit" onClick={this.addUser}>
            {this.props.auth.isFetching ? <Loading color="white" /> : 'Next'}</button>
        </fieldset>
      </form>
    </div>);
  }
}

LastUserSelector.propTypes = {
  auth: PropTypes.shape({
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
  }),
  location: PropTypes.shape({}),
  selectLoginWithUserName: PropTypes.func,
  setSelectedUser: PropTypes.func,
  demoLogin: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch =>
  (bindActionCreators({ selectLoginWithUserName, demoLogin, setSelectedUser }, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(LastUserSelector);
