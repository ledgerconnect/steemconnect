/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import SteemitAvatar from '../../widgets/SteemitAvatar';
import './ChooseAccount.less';

export default class ChooseAccount extends Component {
  static propTypes = {
    addAccount: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    let accounts = [];
    if (localStorage && localStorage.getItem('accounts')) {
      accounts = JSON.parse(localStorage.getItem('accounts'));
    }
    this.state = {
      mode: 'select',
      accounts,
    };
  }
  changeAccount = (username) => {
    if (localStorage && localStorage.getItem('accounts')) {
      const { callback } = this.props;
      const accounts = JSON.parse(localStorage.getItem('accounts'));
      const account = accounts.find(acc => acc.username === username);
      localStorage.setItem('token', account.token);
      callback();
    }
  }
  removeAccount = (username) => {
    if (localStorage && localStorage.getItem('accounts')) {
      let accounts = JSON.parse(localStorage.getItem('accounts'));
      accounts = accounts.filter(acc => acc.username !== username);
      localStorage.setItem('accounts', JSON.stringify(accounts));
      this.setState({ accounts });
      if (accounts.length === 1) {
        this.setState({ mode: 'select' });
      }
    }
  }
  render() {
    const { addAccount } = this.props;
    const { mode, accounts } = this.state;
    return (
      <div className="SignForm">
        <h5>
          {mode === 'select' && <FormattedMessage id="choose_account" />}
          {mode === 'delete' && <FormattedMessage id="delete_account" />}
        </h5>
        <ul className="accounts-list">
          {accounts.map(account =>
            <li key={`acc_${account.username}`}>
              <a href={undefined} onClick={() => this.changeAccount(account.username)}>
                <SteemitAvatar username={account.username} size="60" /><span className="username">{account.username}</span>
              </a>
              {mode === 'delete' &&
              <Icon type="close" onClick={() => this.removeAccount(account.username)} />}
            </li>
          )}
        </ul>
        {mode === 'select' &&
        <div>
          <h5 className="choice-or"><FormattedMessage id="or" /></h5>
          <Button type="primary" className="SignForm__button" onClick={addAccount}>
            <FormattedMessage id="add_account" />
          </Button>
          <br />
          {accounts.length > 1 && <a onClick={() => this.setState({ mode: 'delete' })}><FormattedMessage id="delete_account" /></a>}
        </div>}
        {mode === 'delete' &&
        <div>
          <h5 className="choice-or"><FormattedMessage id="or" /></h5>
          <Button type="primary" className="SignForm__button" onClick={() => this.setState({ mode: 'select' })}>
            <FormattedMessage id="choose_account" />
          </Button>
        </div>}
      </div>
    );
  }
}
