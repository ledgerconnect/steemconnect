import React, { Component, PropTypes } from 'react';

class PasswordDialog extends Component {
  savePassword = () => {
    const { isUpdating, error } = this.props;
    if (isUpdating === false && error === false) {
      this.props.onClose();
    } else {
      this.props.onSave(this.passwordOrWif.value);
    }
  }
  render() {
    const { isUpdating, error } = this.props;
    let saveText = isUpdating === true ? 'Confirming' : 'Confirm';
    let message;
    let showSuccess;
    if (isUpdating === false && error === false) {
      message = <div>Success</div>;
      showSuccess = true;
      saveText = 'Close';
    } else if (error === true) {
      message = <div>Incorrect Password</div>;
    }
    return (
      <div className="dialog dialog-password">
        <div className="dialog-content man maxl-ns">
          <i className="icon icon-md material-icons dialog-close" onClick={this.props.onClose}>close</i>
          <i className="icon icon-md material-icons dialog-lock-icon">lock</i>
          <div className="dialog-header pvs mts">
            <img className="profile-image dialog-logo" alt={`@${this.props.username}`} src={`https://img.busy6.com/@${this.props.username}`} />
            <p className="man">@{this.props.username}</p>
          </div>
            <div className="form form-login dialog-form mbs">
              <div className="input-group input-group-lg"> 
                <span className="input-group-addon">
                  <i className="icon icon-md material-icons">lock_outline</i>
                </span>          
                {!showSuccess && <input id="passwordInput" autoFocus type="password" placeholder="Password or owner WIF" className="form-control" ref={c => (this.passwordOrWif = c)} />}
                {message}
              </div>
              <fieldset className="form-group man"><button disabled={isUpdating} className="btn btn-success form-submit" onClick={this.savePassword}>{saveText}</button></fieldset>
            </div>
          <p className="phl">
            Your password or owner WIF are never saved by Steem Connect. <a href="#">Learn more</a>
          </p>
        </div>
      </div>
    );
  }
}
PasswordDialog.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
  error: PropTypes.bool,
};

export default PasswordDialog;