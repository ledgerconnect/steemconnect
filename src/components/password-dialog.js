import React, {Component} from 'react';

class PasswordDialog extends Component {
	savePassword = () => {
		this.props.onSave(this.refs.passwordOrWif.value);
		this.props.onClose();
	}
	render() {
		return (
			<div className='password-dialog'>
				<i className="icon icon-md material-icons password-close" onClick={this.props.onClose}>close</i>
				<fieldset className={"form-group"}>
					<label className="message">Enter your password to update.</label>
					<input autoFocus type="password" placeholder="Password or Owner WIF" className="form-control form-control-lg" ref="passwordOrWif" />
				</fieldset>
				<fieldset className="form-group"><button className="btn btn-primary" onClick={this.savePassword}>Save</button></fieldset>
			</div>
		);
	}
}

module.exports = PasswordDialog;