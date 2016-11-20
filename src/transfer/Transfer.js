import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import _ from 'lodash';
import { transfer } from './actions';
import { showPasswordDialog, updatePasswordDialog } from '../passwordDialog/actions';

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = { error: {}, transferType: 'STEEM' };
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
      this.props.showPasswordDialog({
        btnName: 'Confirm transfer',
        onEnter: (passwordOrWif) => {
          this.props.updatePasswordDialog({ btnName: 'Transfering', inProgress: true });
          this.props.transfer({
            passwordOrWif,
            from: user.name,
            balance,
            to: this.formData.transferTo,
            memo: this.formData.memo,
          }).then(() => {
            this.props.updatePasswordDialog({ btnName: 'Close', isSuccess: true, message: 'Transfer Done' });
          }).catch(({ message }) => {
            this.props.updatePasswordDialog({ btnName: 'Retry', isError: true, message });
          });
        },
      });

      this.setState({ error: this.state.error });
    }
  }

  changeTransferType = (event) => {
    this.setState({ transferType: event.target.value });
  }

  render() {
    const { auth: { user } } = this.props;
    const currentBalance = this.state.transferType === 'STEEM' ? user.balance : user.sbd_balance;
    return (
      <div className="block block-login">
        <h1 className="mvl">Transfer</h1>
        <form className="form form-payments">
          <div className="pam">
            <input className="form-control form-control-lg" placeholder="To" defaultValue={this.props.params.to} onBlur={() => this.validate('transferTo')} ref={c => (this.formFields.transferTo = c)} />
            <div className="form-control-feedback">{this.state.error.transferTo}</div>
            <input className="form-control form-control-lg" placeholder="0.000" defaultValue={this.props.params.amount} onBlur={() => this.validate('amount')} ref={c => (this.formFields.amount = c)} />
            <div className="form-control-feedback">{this.state.error.amount}</div>
            <select className="form-control form-control-lg" defaultValue={this.props.params.currency} onChange={this.changeTransferType}>
              <option>STEEM</option>
              <option>SBD</option>
            </select>
            <input className="form-control form-control-lg" placeholder="Memo" defaultValue={this.props.params.memo} ref={c => (this.formFields.memo = c)} />
            <p>Current balance {currentBalance}</p>
          </div>
          <div className="form-control-feedback man phm">{this.state.error.transfer}</div>
          <button className="btn btn-primary form-submit" onClick={this.transfer}>Transfer</button>
        </form>
      </div>
    );
  }
}


Payments.propTypes = {
  auth: PropTypes.shape({}),
  payments: PropTypes.shape({
    // isFetching: PropTypes.bool,
  }),
  showPasswordDialog: PropTypes.func,
  updatePasswordDialog: PropTypes.func,
  transfer: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth, payments: state.payments });
const mapDispatchToProps = dispatch => (bindActionCreators({
  transfer, showPasswordDialog, updatePasswordDialog,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
