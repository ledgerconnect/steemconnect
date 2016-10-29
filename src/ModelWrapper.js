import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login } from './actions';
import Login from './auth/Login';
import Loading from './widgets/Loading';

class ModelWrapper extends Component {
  componentWillMount() {
    this.props.login();
  }

  render() {
    if (this.props.auth.isReadingCookies) {
      return (<div className="login-section">
        <div className="login-center">
          <Loading />
        </div>
      </div>);
    }

    return (
      !this.props.auth.isAuthenticated ? <Login {...this.props} /> : <div className="login-section">
        {this.props.children}
      </div>
    );
  }
}

ModelWrapper.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    isReadingCookies: PropTypes.bool.isRequired,
  }),
  children: PropTypes.element,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  login() { dispatch(login()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModelWrapper);
