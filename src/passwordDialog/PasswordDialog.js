import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AccountCard from '../auth/AccountCard';
import { hidePasswordDialog } from './actions';
import Modal from '../widgets/Modal';

class PasswordDialog extends Component {
  onEnter = (event) => {
    event.preventDefault();
    if (this.props.passwordDialog.isSuccess) {
      this.cancel();
    } else if (this.props.passwordDialog.onEnter) {
      this.props.passwordDialog.onEnter(this.passwordOrWif.value);
    }
  }

  cancel = () => {
    this.props.hidePasswordDialog();
    if (this.props.passwordDialog.onCancel) this.props.passwordDialog.onCancel();
  }

  render() {
    const { passwordDialog: { btnName, inProgress, isSuccess, isError, message } } = this.props;
    const { name: username } = this.props.auth.user;

    return (
      <Modal overlay>
        <div className="dialog">
          <i className="icon icon-md material-icons dialog-close" onClick={this.cancel}>close</i>
          <AccountCard username={username} />
          <div className="form">
            {!isSuccess && <div className="input-group input-group-lg">
              <span className="input-group-addon"><i className="icon icon-md material-icons">lock_outline</i></span>
              <input autoFocus type="password" placeholder="Password or posting WIF" className="form-control" ref={(c) => { this.passwordOrWif = c; } } />
            </div>}
            {isSuccess && message && <div style={{ height: 50, color: 'green' }}>{message}</div>}
            {isError && message && <ul className="errorMessages pam">
              <li>{message}</li>
            </ul>}
            <fieldset className="form-group man">
              <button disabled={inProgress} className="btn btn-success form-submit" onClick={this.onEnter}>{btnName}</button>
            </fieldset>
          </div>
        </div>
        <div className="mtl phl">
          Your password or owner WIF are never saved by Steem Connect.
        </div>
      </Modal>
    );
  }
}

PasswordDialog.propTypes = {
  hidePasswordDialog: PropTypes.func,
  passwordDialog: PropTypes.shape({
    isSuccess: PropTypes.bool,
    onCancel: PropTypes.func,
    onEnter: PropTypes.func,
  }),
  auth: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};


const mapStateToProps = state => ({
  auth: state.auth,
  passwordDialog: state.passwordDialog,
});

const mapDispatchToProps = dispatch => (bindActionCreators({ hidePasswordDialog }, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(PasswordDialog);
