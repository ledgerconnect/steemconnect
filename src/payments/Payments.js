import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import _ from 'lodash';
import { transfer } from './actions';
import PasswordDialog from '../widgets/PasswordDialog';

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = { error: {}, showPasswordDialog: false, transferType: 'STEEM' };
    this.formFields = {};
    this.formData = {};
  }

  validate = (refs) => {
    const value = this.formFields[refs] && this.formFields[refs].value;
    switch (refs) {
      case 'transferTo':
        if (validator.trim(value).length === 0) {
          this.state.error[refs] = 'This field cannot be empty';
          this.setState({ error: this.state.error });
        } else {
          this.formData[refs] = value.trim();
          this.state.error[refs] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
      case 'amount': {
        if (!value) {
          break;
        }
        const floatValue = validator.toFloat(value, 10);
        if (floatValue < 0 || isNaN(floatValue)) {
          this.state.error[refs] = 'Please enter valid amount';
          this.setState({ error: this.state.error });
        } else {
          this.formData[refs] = value.trim();
          this.state.error[refs] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
      }
      default:
        this.formData[refs] = value.trim();
        break;
    }
  };

  transfer = (event) => {
    event.preventDefault();
    let missingData = false;

    _.each(this.formFields, (v, k) => {
      if (this.state.error[k]) {
        missingData = true;
      }

      if (v.value) {
        this.formData[k] = v.value.trim();
        if (k === 'amount') {
          this.formData[k] = parseFloat(v.value.trim()).toFixed(3);
        }
      } else if (k === 'amount') {
        missingData = true;
      }
    });

    if (missingData || !this.formData.amount) {
      this.state.error.transfer = 'Please fill all fields';
      this.setState({ error: this.state.error });
    } else {
      const { auth: { user } } = this.props;
      const balance = this.state.transferType === 'STEEM' ? `${this.formData.amount} STEEM` : `${this.formData.amount} SBD`;

      this.state.error.transfer = undefined;
      this.setState({
        error: this.state.error,
        showPasswordDialog: true,
        passwordCallback: (passwordOrWif) => {
          this.props.transfer({
            passwordOrWif,
            from: user.name,
            balance,
            to: this.formData.transferTo,
            memo: this.formData.memo,
          });
        },
      });
    }
  }

  closePasswordDialog = () => {
    this.setState({ showPasswordDialog: false, passwordCallback: undefined });
  }
  savePassword = (passwordOrWif) => {
    this.state.passwordCallback(passwordOrWif);
  }

  changeTransferType = (event) => {
    this.setState({ transferType: event.target.value });
  }

  render() {
    const { auth: { user }, payments: { isFetching, errorMessage } } = this.props;
    const currentBalance = this.state.transferType === 'STEEM' ? user.balance : user.sbd_balance;
    return (
      <div className="container">
        <div className="block block-profile mtl mbs">
          <h1 className="mvl">Payments</h1>
          <form className="form form-payments">
            <div className="pam">
              <fieldset className="form-group">
                <label htmlFor="transferType">Transfer Steem/Steem Dollar</label>
                <select className="form-control form-control-lg" value={this.state.transferType} onChange={this.changeTransferType}>
                  <option>STEEM</option>
                  <option>SBD</option>
                </select>
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="transferTo">Transfer to</label>
                <input className="form-control form-control-lg" placeholder="Send to account" onBlur={() => this.validate('transferTo')} ref={c => (this.formFields.transferTo = c)} />
                <div className="form-control-feedback">{this.state.error.transferTo}</div>
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="steem-dollar">Current balance {currentBalance}</label>
                <input className="form-control form-control-lg" placeholder="How many SteemDollar to send?" onBlur={() => this.validate('amount')} ref={c => (this.formFields.amount = c)} />
                <div className="form-control-feedback">{this.state.error.amount}</div>
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="memo">Memo</label>
                <input className="form-control form-control-lg" placeholder="add a note to transaction." ref={c => (this.formFields.memo = c)} />
              </fieldset>
            </div>
            <fieldset className="form-group man">
              <div className="form-control-feedback man phm">{this.state.error.transfer}</div>
              <button className="btn btn-primary form-submit" onClick={this.transfer}>Transfer</button>
            </fieldset>
          </form>
        </div>
        {this.state.showPasswordDialog &&
          <PasswordDialog
            isUpdating={isFetching}
            error={errorMessage}
            onClose={this.closePasswordDialog}
            onSave={this.savePassword}
          />}
      </div>
    );
  }
}


Payments.propTypes = {
  auth: PropTypes.shape({}),
  payments: PropTypes.shape({
    // isFetching: PropTypes.bool,
  }),
  transfer: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth, payments: state.payments });
const mapDispatchToProps = dispatch => (bindActionCreators({
  transfer,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
