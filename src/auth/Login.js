import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import AccountCard from '../auth/AccountCard';
import Loading from '../widgets/Loading';
import Modal from '../widgets/Modal';
import cookie from '../../lib/cookie';
import LastUserSelector from './AccountSelector';
import { ShowLastUserList, login, demoLogin } from './authAction';

class Login extends Component {
  constructor(props) {
    super(props);
    let lastUserList = cookie.get('lastUsers');
    if (!_.isArray(lastUserList)) {
      lastUserList = [];
    }
    this.state = { lastUserList };
  }

  login = (event) => {
    event.preventDefault();
    this.props.login(this.username.value, this.passwordOrWif.value);
  };

  demo = (event) => {
    event.preventDefault();
    this.props.demoLogin();
  };
  render() {
    const { lastUserList } = this.state;
    const selectedUser = this.props.auth.lastUserList.selected || lastUserList[0];
    return (
      <Modal>
        <div className="dialog">
          {(typeof selectedUser !== 'string' || this.props.auth.lastUserList.show === true) ?
            <LastUserSelector /> :
            <div>
              <span className="change-user">
                <a onClick={this.props.ShowLastUserList}>Not you?</a>
              </span>
              {selectedUser && <AccountCard username={selectedUser} />}
              <form className="form" onSubmit={this.handleSubmit}>
                <input type="hidden" placeholder="Username" defaultValue={selectedUser} ref={(c) => { this.username = c; } } />
                <div className="input-group input-group-lg">
                  <span className="input-group-addon"><i className="icon icon-md material-icons">lock_outline</i></span>
                  <input autoFocus type="password" placeholder="Password or posting WIF" className="form-control" ref={(c) => { this.passwordOrWif = c; } } />
                </div>
                {this.props.auth.errorMessage &&
                  <ul className="errorMessages pam">
                    <li>{this.props.auth.errorMessage}</li>
                  </ul>}
                <fieldset className="form-group man">
                  <button className="btn btn-success form-submit" onClick={this.login}>
                    {this.props.auth.isFetching ? <Loading color="white" /> : 'Log In'}</button>
                </fieldset>
              </form>
            </div>}
        </div>
        <div className="mvl">
          {selectedUser && <p><a href="https://steemit.com/recover_account_step_1" target="_blank" rel="noopener noreferrer">Forgot password?</a></p>}
          {!selectedUser &&
            <p>New to Steem?&nbsp;
              <a href="https://steemit.com/create_account" target="_blank" rel="noopener noreferrer">Sign up now</a>
            </p>}
          {(typeof selectedUser !== 'string' || this.props.auth.lastUserList.show === true) &&
            <p>Try Steem Connect with a <a onClick={this.demo}>demo account</a></p>}
        </div>
      </Modal>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.shape({
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    lastUserList: PropTypes.object,
  }),
  login: PropTypes.func,
  ShowLastUserList: PropTypes.func,
  demoLogin: PropTypes.func,
  location: PropTypes.shape({}),
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch =>
  (bindActionCreators({ login, demoLogin, ShowLastUserList }, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Login);
