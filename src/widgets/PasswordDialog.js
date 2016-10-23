import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

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
    let userBackground = {
      background: `radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.0980392), rgba(0, 0, 0, 0.6)), url("https://img.busy6.com/@${this.props.username}/cover")`,
      backgroundSize: `cover`,
      backgroundPosition: `center`,
    };
    if (isUpdating === false && error === false) {
      message = <div>Success</div>;
      showSuccess = true;
      saveText = 'Close';
    } else if (error === true) {
      message = <div>Incorrect Password</div>;
    }
    return (
      <div className="dialog dialog-password">
        <div className="dialog-body man maxl-ns">
          <i className="icon icon-md material-icons dialog-close" onClick={this.props.onClose}>close</i>
          <Link to="/"><img alt="Steem Connect" className="dialog-logo mbm" src="/img/logo.svg" /></Link>
          <div className="dialog-content mbs">
            <div className="dialog-header pvs" style={userBackground}>
              <img className="profile-image" alt={`@${this.props.username}`} src={`https://img.busy6.com/@${this.props.username}`} />
              <p className="man">@{this.props.username}</p>
            </div>
            <div className="form form-login dialog-form">
              <div className="input-group input-group-lg"> 
                <span className="input-group-addon">
                  <i className="icon icon-md material-icons">lock_outline</i>
                </span>          
                {!showSuccess && <input id="passwordInput" autoFocus type="password" placeholder="Password or owner WIF" className="form-control" ref={c => (this.passwordOrWif = c)} />}
                {message}
              </div>
              <fieldset className="form-group man"><button disabled={isUpdating} className="btn btn-success form-submit" onClick={this.savePassword}>{saveText}</button></fieldset>
            </div>
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