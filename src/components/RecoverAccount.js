import React from 'react';
import { Card, notification } from 'antd';
import steem from 'steem';
import RecoverAccountForm from './Form/RecoverAccount';
import Loading from '../widgets/Loading';
import SignForm from '../sign/SignForm';
import { createSuggestedPassword } from '../helpers/authHelper';

class RecoverAccount extends React.Component {
  state = {
    step: 0,
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

  handleFormSubmit = (values) => {
    this.setState({
      step: 1,
      values
    });
  };

  sign = (auth) => {
    this.setState({ isLoading: true });
    const values = this.state.values;

    const recentPublicKey = steem.auth.toWif(values.account_to_recover, values.recent_password, 'owner');
    const recentAuthority = { weight_threshold: 1, account_auths: [], key_auths: [[steem.auth.wifToPublic(recentPublicKey), 1]] };

    const newPublicKey = steem.auth.toWif(values.account_to_recover, values.new_password, 'owner');
    const newAuthority = { weight_threshold: 1, account_auths: [], key_auths: [[steem.auth.wifToPublic(newPublicKey), 1]] };

    steem.broadcast.recoverAccount(auth.wif, values.account_to_recover, recentAuthority, newAuthority, (err, result) => {
      if (err) {
        console.log(err);
        notification.error({
          message: 'Error',
          description: 'Oops! Something goes wrong, open your console to see the error details.',
        });
      } else {
        notification.success({
          message: 'Success',
          description: `The account @${values.account_to_recover} has been recovered`,
        });
      }

      this.setState({
        step: 0,
        isLoading: false,
      });
    });
  };

  render() {
    const { fields, step, isLoading } = this.state;
    return (
      <div className="container py-5">
        <Card>
          {isLoading && <div className="text-center my-4"><Loading/></div>}
          {!isLoading && step === 0 &&
            <div>
              <h2 className="text-center my-4">Recover account</h2>
              <RecoverAccountForm
                {...fields}
                onSubmit={this.handleFormSubmit}
                onChange={this.handleFormChange}
                hideRequiredMark="true"
              />
            </div>
          }
          {!isLoading && step === 1 &&
            <div className="text-center mt-4">
              <SignForm
                roles={['owner']}
                onSubmit={this.handleFormSubmit}
                sign={this.sign}
              />
            </div>
          }
        </Card>
      </div>
    );
  }
}

export default RecoverAccount;
