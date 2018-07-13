/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import SteemitAvatar from '../../widgets/SteemitAvatar';
import { getAccounts } from '../../utils/localStorage';
import './ChooseAccount.less';

export default class ChooseAccount extends Component {
  static propTypes = {
    addAccount: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    const accounts = getAccounts();
    this.state = {
      accounts,
    };
  }
  changeAccount = (username) => {
    const { callback } = this.props;
    const accounts = getAccounts();
    if (accounts.length > 0) {
      const account = accounts.find(acc => acc.username === username);
      localStorage.setItem('token', account.token);
    }
    callback();
  }
  removeAccount = (username) => {
    let accounts = getAccounts();
    if (accounts.length > 0) {
      accounts = accounts.filter(acc => acc.username !== username);
      localStorage.setItem('accounts', JSON.stringify(accounts));
      this.setState({ accounts });
    }
    if (accounts.length === 1) {
      this.setState({ mode: 'select' });
    }
  }
  render() {
    const { addAccount } = this.props;
    const { accounts } = this.state;
    return (
      <div className="SignForm">
        <h6 className="choose-account-title">
          <FormattedMessage id="choose_account" />
        </h6>
        <ul className="accounts-list">
          {accounts.map(account =>
            <li key={`acc_${account.username}`}>
              <a href={undefined} onClick={() => this.changeAccount(account.username)}>
                <SteemitAvatar username={account.username} size="50" /><span className="username">{account.username}</span>
              </a>
              <Icon type="close" onClick={() => this.removeAccount(account.username)} />
            </li>
          )}
        </ul>
        <div>
          <h6 className="choice-or"><FormattedMessage id="or" /></h6>
          <Button type="primary" className="SignForm__button" onClick={addAccount}>
            <FormattedMessage id="use_another_account" />
          </Button>
        </div>
      </div>
    );
  }
}
