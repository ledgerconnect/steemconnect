import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { login } from './actions';
import Sidebar from './app/Sidebar';
import Login from './auth/Login';
import Loading from './widgets/Loading';
import Modal from './widgets/Modal';
import Header from './app/Header';
import PasswordDialog from './passwordDialog/PasswordDialog';

class Wrapper extends Component {
  componentWillMount() {
    this.props.login();
  }

  render() {
    const {
      auth: { isAuthenticated, isReadingCookies },
      app: { sidebarIsVisible },
      passwordDialog: { showDialog: showPasswordDialog },
    } = this.props;

    if (isReadingCookies) {
      return (
        <Modal>
          <Loading />
        </Modal>
      );
    }

    return (!isAuthenticated ?
      <Login {...this.props} /> :
      <div className={sidebarIsVisible ? 'app-wrapper' : 'app-wrapper full-width'}>
        {showPasswordDialog && <PasswordDialog />}
        <Sidebar />
        <div className="main-panel">
          <Header />
          {this.props.children}
        </div>
      </div>);
  }
}

Wrapper.propTypes = {
  auth: PropTypes.shape({}),
  app: PropTypes.shape({}),
  passwordDialog: PropTypes.shape({}),
  children: PropTypes.element,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  app: state.app,
  passwordDialog: state.passwordDialog,
});

const mapDispatchToProps = dispatch => ({
  login() { dispatch(login()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
