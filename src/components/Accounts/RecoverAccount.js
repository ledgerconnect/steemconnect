import React from 'react';
import { Card, notification } from 'antd';
import steem from 'steem';
import { Link } from 'react-router';
import RecoverAccountForm from '../Form/RecoverAccount';
import Loading from '../../widgets/Loading';
import { getErrorMessage } from '../../../helpers/operation';
import { createSuggestedPassword } from '../../utils/auth';

class RecoverAccount extends React.Component {
  state = {
    isLoading: false,
    values: {},
    fields: {
      new_password: {
        value: createSuggestedPassword(),
      },
    },
  };

  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  };

  handleFormSubmit = async (values) => {
    this.setState({ values, isLoading: true });

    const onError = (error) => {
      notification.error({
        message: 'Error',
        description: getErrorMessage(error) || 'Oops! Something goes wrong, open your console to see the error details.',
      });
    };

    const onSuccess = () => {
      notification.success({
        message: 'Success',
        description: `The account @${values.account_to_recover} has been recovered`,
      });
    };

    await this.recoverAccount(values.account_to_recover, values.old_password, values.new_password, onError, onSuccess);
    this.setState({ isLoading: false });
  };

  // https://github.com/steemit/condenser/blob/0b3af70996c08423a770db2ef23189cd4e7d12be/app/redux/TransactionSaga.js#L481
  recoverAccount = async (accountToRecover, oldPassword, newPassword, onError, onSuccess) => {
    const oldOwnerPrivate = steem.auth.isWif(oldPassword) ? oldPassword :
      steem.auth.toWif(accountToRecover, oldPassword, 'owner');

    const oldOwner = steem.auth.wifToPublic(oldOwnerPrivate);

    const newOwnerPrivate = steem.auth.toWif(accountToRecover, newPassword.trim(), 'owner');
    const newOwner = steem.auth.wifToPublic(newOwnerPrivate);
    const pwPubkey = (name, pw, role) => steem.auth.wifToPublic(steem.auth.toWif(name, pw.trim(), role));
    const newActive = pwPubkey(accountToRecover, newPassword.trim(), 'active');
    const newPosting = pwPubkey(accountToRecover, newPassword.trim(), 'posting');
    const newMemo = pwPubkey(accountToRecover, newPassword.trim(), 'memo');

    const newOwnerAuthority = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[newOwner, 1]],
    };

    const recentOwnerAuthority = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[oldOwner, 1]],
    };

    try {
      await steem.broadcast.sendAsync({ extensions: [],
        operations: [
          ['recover_account', {
            account_to_recover: accountToRecover,
            new_owner_authority: newOwnerAuthority,
            recent_owner_authority: recentOwnerAuthority,
          }],
        ] }, [oldOwnerPrivate, newOwnerPrivate]);

      // change password
      // change password probably requires a separate transaction (single trx has not been tested)
      await steem.broadcast.sendAsync({ extensions: [],
        operations: [
          ['account_update', {
            account: accountToRecover,
            active: { weight_threshold: 1, account_auths: [], key_auths: [[newActive, 1]] },
            posting: { weight_threshold: 1, account_auths: [], key_auths: [[newPosting, 1]] },
            memo_key: newMemo,
            json_metadata: '',
          }],
        ] }, [newOwnerPrivate]);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  render() {
    const { fields, isLoading } = this.state;
    return (
      <div className="container py-5">
        <Card>
          {isLoading && <div className="text-center my-4"><Loading /></div>}
          {!isLoading &&
            <div>
              <div className="text-center my-4">
                <h2>Recover account</h2>
                <p>It's required to <Link to="/accounts/request-recovery">request account recovery</Link> before going further.</p>
              </div>
              <hr className="mb-5" />
              <RecoverAccountForm
                {...fields}
                onSubmit={this.handleFormSubmit}
                onChange={this.handleFormChange}
              />
            </div>
          }
        </Card>
      </div>
    );
  }
}

export default RecoverAccount;
