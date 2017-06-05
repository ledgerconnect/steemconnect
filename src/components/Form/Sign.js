import React, { Component } from 'react';
import steem from 'steem';
import { clear, hasAuth, getAuth, addAuth, setLastUsername } from '../../utils/localStorage';
import Icon from '../../widgets/Icon';
import '../Sign.less';

export default class SignForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      remember: false,
      isAuth: false,
      wif: '',
      role: '',
      account: {},
      usernameIsValid: '',
      passwordIsValid: '',
    };
  }

  componentWillMount = () => {
    const auth = getAuth();
    if (this.props.roles[0] == 'posting' && !this.props.roles[1] && auth) {
      this.setState({
        isAuth: true,
        username: auth.username,
        wif: auth.wif,
        usernameIsValid: true,
        passwordIsValid: true,
      });
    }
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { username, remember, wif, role } = this.state;
    if (remember) { addAuth(username, role, wif); }
    if (hasAuth()) { setLastUsername(username); }
    this.props.sign({ username, wif, role });
  };

  handleUsernameChange = () => {
    const username = this.username.value;
    this.setState({ username });
    if (username && username.length > 2) {
      steem.api.getAccounts([username], (err, result) => {
          const usernameIsValid = (!err && result[0]);
          this.setState({
            account: result[0],
            usernameIsValid ,
          });
          this.handlePasswordChange();
        }
      );
    } else {
      this.setState({ usernameIsValid: '' });
    }
  };

  handlePasswordChange = () => {
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

  handleRememberChange = () => {
    this.setState({ remember: !this.state.remember })
  };

  resetAuth = () => {
    clear();
    this.setState({
      isAuth: false,
      username: '',
      wif: '',
      usernameIsValid: '',
      passwordIsValid: '',
    })
  };

  render() {
    const { isAuth, username, remember, usernameIsValid, passwordIsValid } = this.state;
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
    const title = this.props.title || 'Sign';
    return (
      <div>
        <h2><Icon name="gesture" lg /> {title}</h2>
        {isAuth
          ? <p>
            Do you want to confirm this operation using the Steem account <b>@{username}</b>?
            {' '}Or <a href="#" onClick={() => this.resetAuth()}>change account</a>.
          </p>
          : <p>This operation require a password or WIF ({ roles.join(', ') }).</p>
        }
        <form className="Sign__form" onSubmit={this.onSubmit}>
          {!isAuth &&
            <div>
              <div className={usernameClass}>
                <div className="input-group">
                  <span className="input-group-addon">
                    <Icon name="perm_identity" sm />
                  </span>
                  <input
                    ref={(i) => { this.username = i; }}
                    onChange={() => this.handleUsernameChange()}
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
                    onChange={() => this.handlePasswordChange()}
                    onBlur={() => this.handlePasswordChange()}
                    placeholder={`Password or WIF`}
                    type="password"
                    className="form-control"
                  />
                </div>
              </div>
              {roles[0] == 'posting' && !roles[1] &&
                <div className="form-check">
                  <label className="form-check-label">
                    <input
                      onChange={this.handleRememberChange}
                      checked={remember}
                      type="checkbox"
                      className="form-check-input mr-2"
                    />
                    Remember me
                  </label>
                </div>
              }
            </div>
          }
          <div className="form-group py-3">
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

