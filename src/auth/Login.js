import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import AccountCard from '../auth/AccountCard';
import Loading from './../widgets/Loading';
import cookie from '../../lib/cookie';
import LastUserSelector from './AccountSelector';
import { ShowLastUserList, login, demoLogin } from './authAction';

class Login extends Component {
  constructor(props) {
    super(props);
    let lastUserList = cookie.get('last_users');
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
    return (<div>
      <Link to="/"><img alt="Steem Connect" className="dialog-logo mbm" src="/img/logo.svg" /></Link>
      <div className="block block-login">
        {(typeof selectedUser !== 'string' || this.props.auth.lastUserList.show === true) ?
          <LastUserSelector /> :
          <div className="dialog">
            {selectedUser && <AccountCard username={selectedUser} />}
            <form className="form" onSubmit={this.handleSubmit}>
              <input type="hidden" placeholder="Username" defaultValue={selectedUser} className="form-control form-control-lg" ref={(c) => { this.username = c; }} />
              <fieldset className="form-group man mhs">
                <input autoFocus type="password" placeholder="Password or posting WIF" className="form-control form-control-lg" ref={(c) => { this.passwordOrWif = c; }} />
              </fieldset>
              {this.props.auth.errorMessage &&
              <ul className="errorMessages">
                <li>{this.props.auth.errorMessage}</li>
              </ul>}
              <fieldset className="form-group man">
                <button disabled={this.props.auth.isFetching} className="btn btn-success form-submit" onClick={this.login}>
                  {this.props.auth.isFetching ? <Loading /> : 'Log In'}</button>
              </fieldset>
            </form>
          </div>}
      </div>
      <div className="mvl">
        {selectedUser &&
          <p><a onClick={this.props.showUserList}>Sign in with a different account</a></p>}
        {selectedUser && <p><a href="https://steemit.com/recover_account_step_1" rel="noopener noreferrer" target="_blank">Forgot password?</a></p>}
        {!selectedUser &&
          <p>New to Steem?&nbsp;
            <a href="https://steemit.com/create_account" rel="noopener noreferrer" target="_blank">Sign up now</a>
          </p>}
        {!selectedUser &&
          <p>Try Steem Connect with a <a onClick={this.demo}>demo account</a></p>}
      </div>
    </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.shape({
    errorMessage: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUserList: PropTypes.object,
  }),
  login: PropTypes.func,
  showUserList: PropTypes.func,
  demoLogin: PropTypes.func,
  location: PropTypes.shape({}),
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch),
  demoLogin: bindActionCreators(demoLogin, dispatch),
  showUserList: bindActionCreators(ShowLastUserList, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
