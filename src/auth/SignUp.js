import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import Loading from './../widgets/Loading';
import { signup } from './authAction';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  signUp = (event) => {
    console.log('signUp', this);
    event.preventDefault();
    this.props.signup(this.username.value, this.passwordOrWif.value);
  };

  render() {
    return (<div className="login-section">
      <div className="login-center">
        <Link to="/"><img alt="Steem Connect" className="dialog-logo mbm" src="/img/logo.svg" /></Link>
        <div className="block block-login">
          <div className="dialog">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="input-group input-group-lg">
                <span className="input-group-addon"><i className="icon icon-md material-icons">lock_outline</i></span>
                <input type="text" placeholder="Username" className="form-control" ref={(c) => { this.username = c; }} />
              </div>
              <div className="input-group input-group-lg">
                <span className="input-group-addon"><i className="icon icon-md material-icons">lock_outline</i></span>
                <input autoFocus type="password" placeholder="Password or posting WIF" className="form-control" ref={(c) => { this.passwordOrWif = c; }} />
              </div>
              {this.props.auth.errorMessage &&
                <ul className="errorMessages pam">
                  <li>{this.props.auth.errorMessage}</li>
                </ul>}
              <fieldset className="form-group man">
                <button className="btn btn-success form-submit" onClick={this.signUp}>
                  {this.props.auth.isFetching ? <Loading color="white" /> : 'Sign Up'}</button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

SignUp.propTypes = {
  auth: PropTypes.shape({
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
  }),
  signup: PropTypes.func,
  location: PropTypes.shape({}),
};

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  signup: bindActionCreators(signup, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
