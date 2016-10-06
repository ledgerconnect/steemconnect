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
    let saveText = isUpdating === true ? 'Saving' : 'Save';
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
      <div className="password-dialog">
        <i className="icon icon-md material-icons password-close" onClick={this.props.onClose}>close</i>
        <fieldset className={"form-group"}>
          {!showSuccess && <label htmlFor="passwordInput" className="message">Enter your password to update.</label>}
          {!showSuccess && <input id="passwordInput" autoFocus type="password" placeholder="Password or owner WIF" className="form-control form-control-lg" ref={c => (this.passwordOrWif = c)} />}
          {message}
        </fieldset>
        <fieldset className="form-group"><button disabled={isUpdating} className="btn btn-primary" onClick={this.savePassword}>{saveText}</button></fieldset>
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
