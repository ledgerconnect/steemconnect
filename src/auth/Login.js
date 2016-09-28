import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import EditImageHeader from './../header/EditImageHeader';
import Loading from './../widgets/Loading';
import cookie from '../../lib/cookie';
import LastUserSelector from './LastUserSelector';
import { ShowLastUserList, login } from './authAction';

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
    this.props.login('guest123', '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg');
  };
  render() {
    const { lastUserList } = this.state;
    const selectedUser = this.props.auth.lastUserList.selected || lastUserList[0];
    let view;
    if (typeof selectedUser !== 'string' || this.props.auth.lastUserList.show === true) {
      view = <LastUserSelector />;
    } else if (this.props.auth.isFetching) {
      view = <Loading />;
    } else {
      view = (<div>
        <div>
          {selectedUser && <EditImageHeader username={selectedUser} />}
          <form className="form" onSubmit={this.handleSubmit}>
            <fieldset className="form-group">
              <input type={selectedUser ? 'hidden' : 'text'} placeholder="Username" defaultValue={selectedUser} className="form-control form-control-lg lowercase-input" ref={(c) => { this.username = c; }} />
            </fieldset>
            <fieldset className="form-group">
              <input autoFocus type="password" placeholder="Password or posting WIF" className="form-control form-control-lg" ref={(c) => { this.passwordOrWif = c; }} />
            </fieldset>
            {this.props.auth.errorMessage &&
              <ul className="errorMessages">
                <li>{this.props.auth.errorMessage}</li>
              </ul>}
            <fieldset className="form-group"><button className="btn btn-primary" onClick={this.login}>Log In</button></fieldset>
            <fieldset className="form-group"><button className="btn btn-secondary" onClick={this.demo}>Demo</button></fieldset>
            <a onClick={this.props.showUserList}>Sign in with a different account</a>
          </form>
        </div>
      </div>);
    }
    return (<section>
      <Link to="/"><img alt="logo" className="logo mbm" src="/img/logo.svg" width="100" /></Link>
      <div className="block block-login">
        {view}
      </div>
      <div className="mvl">
        <p>New to Steem?&nbsp; <a href="https://steemit.com/create_account" rel="noopener noreferrer" target="_blank">Sign up now</a></p>
        <p><a href="https://steemit.com/recover_account_step_1" rel="noopener noreferrer" target="_blank">Forgot password?</a></p>
      </div>
    </section>
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
  location: PropTypes.shape({}),
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch),
  showUserList: bindActionCreators(ShowLastUserList, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
