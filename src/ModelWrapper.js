import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login } from './actions';
import Login from './auth/Login';
import Loading from './widgets/Loading';
import PasswordDialog from './passwordDialog/PasswordDialog';

class ModelWrapper extends Component {
  componentWillMount() {
    this.props.login();
  }

  render() {
    const {
      auth: { isAuthenticated, isReadingCookies },
      passwordDialog: { showDialog: showPasswordDialog },
    } = this.props;

    if (isReadingCookies) {
      return (<div className="login-section">
        <div className="login-center">
          <Loading />
        </div>
      </div>);
    }

    return (
      !isAuthenticated ? <Login {...this.props} /> : <div className="login-section">
        {showPasswordDialog && <PasswordDialog />}
        {this.props.children}
      </div>
    );
  }
}

ModelWrapper.propTypes = {
  auth: PropTypes.shape({}),
  passwordDialog: PropTypes.shape({}),
  children: PropTypes.element,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  passwordDialog: state.passwordDialog,
});

const mapDispatchToProps = dispatch => ({
  login() { dispatch(login()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModelWrapper);
