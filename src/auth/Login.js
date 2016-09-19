import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link, withRouter } from 'react-router';
import EditImageHeader from './../header/EditImageHeader';
import Loading from './../widgets/Loading';
import cookie from '../../lib/cookie';
import actions from '../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    let lastUserList = cookie.get('last_users');
    if (!_.isArray(lastUserList)) {
      lastUserList = [];
    }
    const showSignWithDifferent = lastUserList.length !== 0;
    const selectedUser = location.state && location.state.username;
    this.state = { lastUserList, selectedUser, showSignWithDifferent };
  }

  componentWillMount() {
    const { lastUserList, selectedUser } = this.state;

    if (typeof selectedUser !== 'string' && lastUserList[0] !== undefined) {
      this.props.router.push({
        pathname: '/login',
        state: { username: lastUserList[0] },
      });
      this.setState({
        selectedUser: lastUserList[0],
      });
    }
  }

  login = (event) => {
    event.preventDefault();
    this.props.login(this.username.value, this.passwordOrWif.value);
  }

  demo = (event) => {
    event.preventDefault();
    this.props.login('guest123', '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg');
  }
  render() {
    const { selectedUser } = this.state;
    return (<section>
      <div className="block">
        {this.props.auth.isFetching && <Loading />}
        {!this.props.auth.isFetching && <div>
          <div>
            {selectedUser && <EditImageHeader username={selectedUser} />}
            <form className="form pvx mhl" onSubmit={this.handleSubmit}>
              <fieldset className="form-group">
                <input autoFocus type={selectedUser ? 'hidden' : 'text'} placeholder="Username" defaultValue={selectedUser} className="form-control form-control-lg" ref={(c) => { this.username = c; }} />
              </fieldset>
              <fieldset className="form-group">
                <input type="password" placeholder="Password or posting WIF" className="form-control form-control-lg" ref={(c) => { this.passwordOrWif = c; }} />
              </fieldset>
              {this.props.auth.errorMessage &&
                <ul className="errorMessages">
                  <li>{this.props.auth.errorMessage}</li>
                </ul>}
              <fieldset className="form-group"><button className="btn btn-primary" onClick={this.login}>Log In</button></fieldset>
              <fieldset className="form-group"><button className="btn btn-secondary" onClick={this.demo}>Demo</button></fieldset>
              {this.state.showSignWithDifferent && <Link to={{ pathname: '/loginlist', state: { redirect: false } }}>Sign in with a different account</Link>}
            </form>
          </div>
        </div>}
      </div>
      <div className="mvl">
        <p>New to Steem?<a href="https://steemit.com/create_account" rel="noopener noreferrer" target="_blank">Sign up now</a></p>
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
  }),
  login: PropTypes.func,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({}),
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({ login: bindActionCreators(actions.login, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
