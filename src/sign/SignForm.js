import React, { Component } from 'react';
import steem from 'steem';
import Icon from '../widgets/Icon';
import './Sign.scss';

export default class SignForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      wif: '',
      role: '',
      account: {},
      usernameIsValid: '',
      passwordIsValid: '',
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { username, wif, role } = this.state;
    this.props.sign({ username, wif, role });
  };

  validateUsername = () => {
    const username = this.username.value;
    this.setState({ username });
    if (username && username.length > 2) {
      steem.api.getAccounts([username], (err, result) => {
          const usernameIsValid = (!err && result[0]);
          this.setState({
            account: result[0],
            usernameIsValid ,
          });
          this.onChangePassword();
        }
      );
    } else {
      this.setState({ usernameIsValid: '' });
    }
  };

  onChangePassword = () => {
    const { password } = this;
    setTimeout(() => {
      if (
        this.state.usernameIsValid
        && password.value !== this.state.lastPassword
      ) {
        this.validatePassword();
      }
    }, 1000);
  };

  validatePassword = () => {
    const { username, password } = this;
    const { account } = this.state;
    const { roles } = this.props;

    const wif = steem.auth.isWif(password.value)
      ? password.value
      : steem.auth.toWif(username.value, password.value, roles[0]);

    let wifIsValid = false;
    const publicWif = steem.auth.wifToPublic(wif);

    roles.map(role => {
      if (account[role].key_auths[0][0] === publicWif) {
        this.setState({ role: role });
        wifIsValid = true;
      }
    });

    const passwordIsValid = password.value ? wifIsValid : '';

    this.setState({
      lastPassword: password.value,
      wif,
      wifIsValid,
      passwordIsValid,
    });
  };

  render() {
    const { usernameIsValid, passwordIsValid } = this.state;
    const { roles } = this.props;
    const usernameClass = usernameIsValid
      ? 'form-group has-success'
      : usernameIsValid === ''
        ? 'form-group'
        : 'form-group has-danger';
    const passwordClass = passwordIsValid
      ? 'form-group has-success'
      : passwordIsValid === ''
        ? 'form-group'
        : 'form-group has-danger';

    return (
      <div>
        <h2><Icon name="gesture" lg /> Sign</h2>
        <p>This operation require a password or WIF ({ roles.join(', ') }).</p>
        <form
          className="Sign__form"
          onSubmit={this.onSubmit}>
          <div className={usernameClass}>
            <div className="input-group">
              <span className="input-group-addon">
                <Icon name="perm_identity" sm />
              </span>
              <input
                ref={(i) => { this.username = i; }}
                onChange={() => this.validateUsername()}
                placeholder="Username"
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className={passwordClass}>
            <div className="input-group">
              <span className="input-group-addon">
                <Icon name="fingerprint" sm />
              </span>
              <input
                ref={(i) => { this.password = i; }}
                onChange={() => this.onChangePassword()}
                onBlur={() => this.onChangePassword()}
                placeholder={`Password or WIF`}
                type="password"
                className="form-control"
              />
            </div>
          </div>
          {/*
            roles[0] == 'posting' && !roles[1] &&
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input mr-1" />
                  Remember me
                </label>
              </div>
          */}
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-success"
              disabled={usernameIsValid && passwordIsValid ? '' : 'disabled'}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    );
  }
}

