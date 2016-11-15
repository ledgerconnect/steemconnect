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
    this.state = { error: {}, showPasswordDialog: false };
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
      case 'steem':
      case 'sbd': {
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
        if (k === 'sbd' || k === 'steem') {
          this.formData[k] = parseFloat(v.value.trim()).toFixed(3);
        }
      } else if (k !== 'sbd' && k !== 'steem') {
        missingData = true;
      }
    });

    if (missingData || (!this.formData.sbd && !this.formData.steem)) {
      this.state.error.transfer = 'Please fill all fields';
      this.setState({ error: this.state.error });
    } else {
      this.state.error.transfer = undefined;
      this.setState({ error: this.state.error });

      console.log(this.formData);
      const { auth: { user } } = this.props;

      if (this.formData.steem || this.formData.sbd) {
        this.setState({
          showPasswordDialog: true,
          passwordCallback: (passwordOrWif) => {
            if (this.formData.steem) {
              console.log('Transfering steem');
              this.props.transfer({
                passwordOrWif,
                from: user.name,
                balance: `${this.formData.steem} STEEM`,
                to: this.formData.transferTo,
                memo: this.formData.memo,
              });
            }

            if (this.formData.sbd) {
              console.log('Transfering sbd');
              this.props.transfer({
                passwordOrWif,
                from: user.name,
                balance: `${this.formData.sbd} SBD`,
                to: this.formData.transferTo,
                memo: this.formData.memo,
              });
            }
          },
        });
      }
    }
  }

  closePasswordDialog = () => {
    this.setState({ showPasswordDialog: false, passwordCallback: undefined });
  }
  savePassword = (passwordOrWif) => {
    this.state.passwordCallback(passwordOrWif);
  }

  render() {
    console.log(this.props.payments);
    const { auth: { user } } = this.props;

    return (
      <div>
        <h1 className="mvl">Payments</h1>
        <form className="form form-payments">
          <div className="pam">
            <fieldset className="form-group">
              <label htmlFor="transferTo">Transfer to</label>
              <input className="form-control form-control-lg" placeholder="Send to account" onBlur={() => this.validate('transferTo')} ref={c => (this.formFields.transferTo = c)} />
              <div className="form-control-feedback">{this.state.error.transferTo}</div>
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="Steem">Send Steem (has {user.balance})</label>
              <input className="form-control form-control-lg" placeholder="How many steem to send?" onBlur={() => this.validate('steem')} ref={c => (this.formFields.steem = c)} />
              <div className="form-control-feedback">{this.state.error.steem}</div>
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="steem-dollar">Send SteemDollar (has {user.sbd_balance})</label>
              <input className="form-control form-control-lg" placeholder="How many SteemDollar to send?" onBlur={() => this.validate('sbd')} ref={c => (this.formFields.sbd = c)} />
              <div className="form-control-feedback">{this.state.error.sbd}</div>
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="memo">Memo</label>
              <input className="form-control form-control-lg" ref={c => (this.formFields.memo = c)} />
            </fieldset>
          </div>
          <fieldset className="form-group man">
            <div className="form-control-feedback man phm">{this.state.error.transfer}</div>
            <button className="btn btn-primary form-submit" onClick={this.transfer}>Transfer</button>
          </fieldset>
        </form>
        {this.state.showPasswordDialog &&
          <PasswordDialog
            isUpdating={user.isUpdatingProfile}
            error={user.isUpdatingProfileError}
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
