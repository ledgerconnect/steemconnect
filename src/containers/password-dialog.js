import React, {Component} from 'react';

class PasswordDialog extends Component {
	savePassword = () => {
		let {isUpdatingProfile, isUpdatingProfileError} = this.props;
		if (isUpdatingProfile === false && isUpdatingProfileError == false) {
			this.props.onClose();
		} else {
			this.props.onSave(this.refs.passwordOrWif.value);
		}
	}
	render() {
		let {isUpdatingProfile, isUpdatingProfileError} = this.props;
		let saveText = isUpdatingProfile === true ? 'Saving' : 'Save';
		let message, showSuccess;
		if (isUpdatingProfile === false && isUpdatingProfileError == false) {
			message = <div>Success</div>;
			showSuccess = true;
			saveText = 'Close';
		} else if (isUpdatingProfileError === true) {
			message = <div>Incorrect Password</div>;
		}
		return (
			<div className='password-dialog'>
				<i className="icon icon-md material-icons password-close" onClick={this.props.onClose}>close</i>
				<fieldset className={"form-group"}>
					{!showSuccess && <label className="message">Enter your password to update.</label>}
					{!showSuccess && <input autoFocus type="password" placeholder="Password or owner WIF" className="form-control form-control-lg" ref="passwordOrWif" />}
					{message}
				</fieldset>
				<fieldset className="form-group"><button disabled={isUpdatingProfile} className="btn btn-primary" onClick={this.savePassword}>{saveText}</button></fieldset>
			</div>
		);
	}
}

module.exports = PasswordDialog;