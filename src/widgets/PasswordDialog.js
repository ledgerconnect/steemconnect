import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Avatar from '../widgets/Avatar';

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
    const { name: username } = this.props.auth.user;
    if (isUpdating === false && error === false) {
      message = <div>Success</div>;
      showSuccess = true;
      saveText = 'Close';
    } else if (error === true) {
      message = <div>Incorrect Password</div>;
    } else {
      message = <div>{error}</div>;
    }
    return (
      <div className="dialog dialog-password">
        <div className="login-section">
          <div className="login-center">
            <Link to="/"><img alt="Steem Connect" className="dialog-logo mbm" src="/img/logo.svg" /></Link>
            <div className="block block-login">
              <div className="dialog">
                <i className="icon icon-md material-icons dialog-close" onClick={this.props.onClose}>close</i>
                <div className="account-card">
                  <Avatar xl username={username} />
                  <h2 className="mts">@{username}</h2>
                </div>
                <div className="form">
                  <div className="input-group input-group-lg">
                    <span className="input-group-addon"><i className="icon icon-md material-icons">lock_outline</i></span>
                    <input autoFocus type="password" placeholder="Password or posting WIF" className="form-control" ref={(c) => { this.passwordOrWif = c; } } />
                  </div>
                  {error && <ul className="errorMessages pam">
                    <li>{message}</li>
                  </ul>}
                  <fieldset className="form-group man">
                    <button disabled={isUpdating} className="btn btn-success form-submit" onClick={this.savePassword}>{saveText}</button>
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="mtl phl">
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
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  auth: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};


const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PasswordDialog);
