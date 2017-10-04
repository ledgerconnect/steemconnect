import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, notification } from 'antd';
import steem from 'steem';
import RequestAccountRecoveryForm from '../Form/RequestAccountRecovery';
import Loading from '../../widgets/Loading';
import SignForm from '../Form/Sign';
import { createSuggestedPassword } from '../../utils/auth';
import { getErrorMessage } from '../../../helpers/operation';

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

  handleFormSubmitStep1 = async (values) => {
    this.setState({ values, step: 1 });
  };

  handleFormSubmitStep2 = async (auth) => {
    const { intl } = this.props;
    this.setState({ isLoading: true });
    const values = this.state.values;

    const onError = (error) => {
      notification.error({
        message: intl.formatMessage({ id: 'error' }),
        description: getErrorMessage(error) || intl.formatMessage({ id: 'general_error' }),
      });
    };

    const onSuccess = () => {
      notification.success({
        message: intl.formatMessage({ id: 'success' }),
        description: intl.formatMessage({ id: 'success_account_recovery_request' }),
      });
    };

    await this.requestAccountRecovery(
      auth.wif,
      values.recovery_account,
      values.account_to_recover,
      values.new_password,
      onError,
      onSuccess);
    this.setState({ step: 0, isLoading: false });
  };

  requestAccountRecovery =
    async (creatorOwnerPrivate,
           recoveryAccount,
           accountToRecover,
           newPassword,
           onError,
           onSuccess) => {
      const newOwnerPrivate = steem.auth.toWif(accountToRecover, newPassword.trim(), 'owner');
      const newOwner = steem.auth.wifToPublic(newOwnerPrivate);
      const newOwnerAuthority = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[newOwner, 1]],
      };

      try {
        await steem.broadcast.requestAccountRecoveryAsync(
          creatorOwnerPrivate,
          recoveryAccount,
          accountToRecover,
          newOwnerAuthority,
          []
        );
        onSuccess();
      } catch (error) {
        onError(error);
      }
    };

  render() {
    const { step, fields, isLoading } = this.state;
    return (
      <div className="container py-5">
        <Card>
          {isLoading && <div className="text-center my-4"><Loading /></div>}
          {!isLoading && step === 0 &&
            <div>
              <div className="my-4 text-center">
                <h2><FormattedMessage id="request_account_recovery" /></h2>
                <p><FormattedMessage id="operation_require_signature" /></p>
              </div>
              <hr className="mb-5" />
              <RequestAccountRecoveryForm
                {...fields}
                onSubmit={this.handleFormSubmitStep1}
                onChange={this.handleFormChange}
              />
            </div>
          }
          {!isLoading && step === 1 &&
            <div className="text-center mt-4">
              <SignForm
                roles={['owner']}
                sign={this.handleFormSubmitStep2}
              />
            </div>
          }
        </Card>
      </div>
    );
  }
}

export default injectIntl(RecoverAccount);
