import React from 'react';
import steem from 'steem';
import { notification, Modal } from 'antd';
import { browserHistory } from 'react-router';
import CreateAppForm from '../Form/CreateApp';
import SignForm from '../Form/Sign';
import config from '../../../config.json';
import { getAccountCreationFee } from '../../utils/auth';
import { getErrorMessage } from '../../utils/operation';
import Loading from '../../widgets/Loading';

class CreateApp extends React.Component {
  state = {
    visible: false,
    isLoading: false,
    values: {},
    accountCreationFee: '',
  };

  componentWillMount = async () => {
    const accountCreationFee = await getAccountCreationFee();
    this.setState({ accountCreationFee });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  handleFormSubmit = (values) => {
    this.setState({ values });
    this.showModal();
  };

  handleSignFormSubmit = async (auth) => {
    this.hideModal();
    this.setState({ isLoading: true });
    const clientId = this.state.values.username;

    /** Calculate required STEEM to create new account */
    const accountCreationFee = await getAccountCreationFee();

    /** Generate account authorities */
    const publicKeys = config.offline_generated_public_keys;
    const owner = { weight_threshold: 1, account_auths: [['steemconnect', 1]], key_auths: [[publicKeys.owner, 1]] };
    const active = { weight_threshold: 1, account_auths: [['steemconnect', 1]], key_auths: [[publicKeys.active, 1]] };
    const posting = { weight_threshold: 1, account_auths: [['steemconnect', 1]], key_auths: [[publicKeys.posting, 1]] };

    /** Create proxy account */
    await steem.broadcast.accountCreateWithDelegationAsync(
      auth.wif,
      accountCreationFee,
      '0.000000 VESTS',
      auth.username,
      clientId,
      owner,
      active,
      posting,
      publicKeys.memo,
      { owner: this.props.auth.user.name },
      []
    ).then((result) => {
      /** Send request to server for create app */
      fetch(`/api/apps/@${clientId}`, {
        headers: new Headers({
          Authorization: this.props.auth.token,
        }),
        method: 'POST',
      })
        .then(res => res.json())
        .then((data) => {
          if (!data.error) {
            /** Redirect to edit app */
            browserHistory.push(`/apps/@${clientId}/edit`);
            notification.success({
              message: 'Success',
              description: `The proxy account @${clientId} has been successfully created`,
            });
          } else {
            this.setState({ isLoading: false });
            console.log(data.error);
            notification.error({
              message: 'Error',
              description: data.error || 'Oops! Something goes wrong, open your console to see the error details.',
            });
          }
        });
      }).catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
        notification.error({
          message: 'Error',
          description: getErrorMessage(err) || 'Oops! Something goes wrong, open your console to see the error details.',
        });
      }
    );
  };

  render() {
    return (
      <div className="container py-5">
        <h1>Create App</h1>
        <div className="block py-4">
          {this.state.isLoading || !this.state.accountCreationFee
            ? <center><Loading /></center>
            : <div>
              <p>
                You need to create a new Steem account for setup your application on SteemConnect.
                The current fee for create a new account is <b>{this.state.accountCreationFee}</b>.
                Make sure you have enough funds on your account before proceed.
              </p>
              <CreateAppForm onSubmit={this.handleFormSubmit} />
            </div>
          }
        </div>
        <Modal
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={false}
        >
          <SignForm
            roles={['active']}
            onSubmit={this.handleSignFormSubmit}
          />
        </Modal>
      </div>
    );
  }
}

export default CreateApp;
