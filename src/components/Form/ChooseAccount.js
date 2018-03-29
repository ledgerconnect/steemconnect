/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import SteemitAvatar from '../../widgets/SteemitAvatar';
import './ChooseAccount.less';

export default class ChooseAccount extends Component {
  static propTypes = {
    addAccount: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
  };

  changeAccount = (username) => {
    if (localStorage && localStorage.getItem('accounts')) {
      const { callback } = this.props;
      const accounts = JSON.parse(localStorage.getItem('accounts'));
      const account = accounts.find(acc => acc.username === username);
      localStorage.setItem('token', account.token);
      callback();
    }
  }

  render() {
    const { addAccount } = this.props;
    let accounts = [];
    if (localStorage && localStorage.getItem('accounts')) {
      accounts = JSON.parse(localStorage.getItem('accounts'));
    }
    return (
      <div className="SignForm">
        <h5><FormattedMessage id="choose_account" /></h5>
        <ul className="accounts-list">
          {accounts.map(account =>
            <li>
              <a href={undefined} onClick={() => this.changeAccount(account.username)}>
                <SteemitAvatar username={account.username} size="60" /><span className="username">{account.username}</span>
              </a>
            </li>
          )}
        </ul>
        <h5 className="choice-or"><FormattedMessage id="or" /></h5>
        <Button type="primary" className="SignForm__button" onClick={addAccount}>
          <FormattedMessage id="add_account" />
        </Button>
      </div>
    );
  }
}
