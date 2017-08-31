import React, { Component } from 'react';
import steem from 'steem';
import { notification } from 'antd';
import AccountForm from '../Form/AccountForm';
import SignForm from '../Form/Sign';
import Loading from '../../widgets/Loading';
import { getErrorMessage } from '../../../helpers/operation';

export default class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      error: false,
      account: {},
    };
  }

  submit = (data) => {
    this.setState({
      step: 1,
      account: data,
    });
  };

  sign = (auth) => {
    const { account } = this.state;
    const publicKeys = steem.auth.generateKeys(account.name, account.password, ['owner', 'active', 'posting', 'memo']);
    const owner = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.owner, 1]] };
    const active = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.active, 1]] };
    const posting = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[publicKeys.posting, 1]],
    };
    steem.broadcast.accountCreateWithDelegation(
      auth.wif,
      account.steem,
      account.vests,
      auth.username,
      account.name,
      owner,
      active,
      posting,
      publicKeys.memo,
      JSON.stringify({}),
      [],
      (err) => {
        this.setState({ step: 0 });
        if (err) {
          notification.error({
            message: 'Error',
            description: getErrorMessage(err) || 'Oops! Something goes wrong, open your console to see the error details.',
          });
        } else {
          notification.success({
            message: 'Success',
            description: `The account @${account.name} has been successfully created`,
          });
        }
      }
    );
    this.setState({ step: 2 });
  };

  render() {
    const { step } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container text-left my-2">
          {step === 0 &&
            <div>
              <h2 className="text-center">Create Account</h2>
              <AccountForm submit={this.submit} />
            </div>
          }
          {step === 1 &&
            <div className="text-center">
              <SignForm roles={['active']} sign={this.sign} />
            </div>
          }
          {step === 2 &&
            <div className="text-center">
              <Loading />
            </div>
          }
        </div>
      </div>
    );
  }
}
