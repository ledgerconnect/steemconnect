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
      background: `radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.0980392), rgba(0, 0, 0, 0.6)), url("https://img.busy6.com/@guest123/cover")`,
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
        <div className="login-section">
          <div className="login-center">
            <Link to="/"><img alt="Steem Connect" className="dialog-logo mbm" src="/img/logo.svg" /></Link>
            <div className="block block-login">
              <div className="dialog">
                <div className="account-card" style={userBackground}>
                  <a><img className="profile-image" alt={`@guest123`} src={`https://img.busy6.com/@guest123`} /></a>
                  <h2 className="mts">
                    @guest213
                  </h2>
                </div>
                <form className="form" onSubmit={this.handleSubmit}>
                  <div className="input-group input-group-lg">
                    <span className="input-group-addon"><i className="icon icon-md material-icons">lock_outline</i></span>
                    <input autoFocus type="password" placeholder="Password or posting WIF" className="form-control" ref={(c) => { this.passwordOrWif = c; }} />
                  </div>
                  <fieldset className="form-group man">
                    <button disabled={isUpdating} className="btn btn-success form-submit" onClick={this.savePassword}>{saveText}</button>
                  </fieldset>
                </form>
              </div>
            </div>
            <div className="mvl phl">
              Your password or owner WIF are never saved by Steem Connect. <a href="#">Learn more</a>
            </div>
          </div>
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