import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loading from './../widgets/Loading';
import AccountCard from './AccountCard';
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

  selectUser = (username) => {
    const { lastUserList } = this.state;
    const index = lastUserList.indexOf(username);
    if (index >= 0) {
      this.props.selectLoginWithUserName(username);
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
      {lastUserList.map((username, index) => (
        <AccountCard
          key={index}
          onClick={() => { this.selectUser(username); }}
          username={username} onDelete={this.onDelete}
        />
      ))}
      {_.isEmpty(lastUserList) && <h2 className="mal">Log in with your Steem account</h2>}
      {!_.isEmpty(lastUserList) && <h2 className="mal">Add new Steem account</h2>}
      <form className="form form-login" onSubmit={this.handleSubmit}>
        <div className="input-group input-group-lg">
          <span className="input-group-addon"><i className="icon icon-md material-icons">perm_identity</i></span>
          <input autoFocus type="text" placeholder="Enter your username" className="form-control" ref={(c) => { this.username = c; }} />
        </div>
        {this.props.auth.errorMessage &&
          <ul className="errorMessages pam">
            <li>{this.props.auth.errorMessage}</li>
          </ul>}
        <fieldset className="form-group man">
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
  demoLogin: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  selectLoginWithUserName: bindActionCreators(selectLoginWithUserName, dispatch),
  demoLogin: bindActionCreators(demoLogin, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LastUserSelector);
