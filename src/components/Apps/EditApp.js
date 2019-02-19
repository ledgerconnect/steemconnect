import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import steem from '@steemit/steem-js';
import SignForm from '../Form/Sign';
import SignSuccess from '../Sign/Success';
import SignError from '../Sign/Error';
import Loading from '../../widgets/Loading';
import AppForm from './AppForm';
import { getAccountProfile } from '../../utils/app';
import Avatar from '../../widgets/SteemitAvatar';

class EditApp extends Component {
  static propTypes = {
    params: PropTypes.shape({
      clientId: PropTypes.string,
    }),
    auth: PropTypes.shape(),
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      success: false,
      error: false,
      isLoading: false,
      isLoaded: false,
      clientId: this.props.params.clientId,
      metadata: {},
      app: {},
    };
  }

  componentWillMount() {
    const { clientId } = this.state;
    this.setState({ isLoading: true });

    getAccountProfile(clientId).then((app) => {
      this.setState({
        app,
        isLoading: false,
        isLoaded: true,
      });
    });
  }

  onContinue = (data) => {
    this.setState({
      step: 1,
      profile: data,
    });
  };

  onSubmit = (auth) => {
    const { clientId, profile } = this.state;
    this.setState({ step: 2 });

    steem.api.getAccountsAsync([clientId]).then((accounts) => {
      const memoKey = accounts[0].memo_key;
      let metadata = {};
      try {
        metadata = JSON.parse(accounts[0].json_metadata);
      } catch (e) {
        // console.log(e);
      }
      const newProfile = { ...metadata.profile, ...profile };
      const newMetadata = metadata;
      newMetadata.profile = newProfile;
      const jsonMetadata = JSON.stringify(newMetadata);

      if (jsonMetadata !== accounts[0].json_metadata) {
        /** Update account json_metadata */
        steem.broadcast.accountUpdate(
          auth.wif,
          clientId,
          undefined,
          undefined,
          undefined,
          memoKey,
          jsonMetadata,
        (errBc, result) => {
          if (!errBc) {
            this.setState({ success: result, step: 3 });
          } else {
            this.setState({ error: errBc, step: 3 });
          }
        });
      } else {
        this.setState({
          success: { isValid: true },
          step: 3,
        });
      }
    }).catch((e) => {
      console.log(e);
      this.setState({
        error: true,
        step: 3,
      });
    });
  };

  resetForm = () => {
    this.setState({
      step: 0,
      error: false,
      success: false,
    });
  };

  render() {
    const { app, clientId, isLoading, step, success, error } = this.state;
    const { auth } = this.props;
    return (
      <div className="container my-5">
        {isLoading && <Loading />}
        {!isLoading && step === 0 &&
          <div>
            <div className="pb-3">
              <Avatar username={clientId} size="80" className="float-left mr-3" />
              <h2 className="d-inline">{clientId}</h2>
              <p>@{clientId}</p>
            </div>
            <AppForm
              username={clientId}
              data={app}
              auth={auth}
              isLoading={isLoading}
              submit={this.onContinue}
            />
          </div>
        }
        <div className="text-center">
          {step === 1 && <SignForm roles={['owner', 'active']} onSubmit={this.onSubmit} />}
          {step === 2 && <Loading />}
          {step === 3 && success && <SignSuccess result={success} />}
          {step === 3 && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}

export default injectIntl(EditApp);
