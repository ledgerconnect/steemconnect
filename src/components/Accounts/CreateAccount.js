import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import steem from '@steemit/steem-js';
import { notification } from 'antd';
import AccountForm from '../Form/AccountForm';
import SignForm from '../Form/Sign';
import Loading from '../../widgets/Loading';
import { getErrorMessage } from '../../../helpers/operation';
import { getAccountCreationFee } from '../../utils/auth';

class CreateAccount extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      error: false,
      account: {},
      accountCreationFee: '0.000 STEEM',
    };
  }

  componentWillMount = async () => {
    const accountCreationFee = await getAccountCreationFee();
    this.setState({ accountCreationFee });
  };

  submit = (data) => {
    this.setState({
      step: 1,
      account: data,
    });
  };

  sign = (auth) => {
    const { account, accountCreationFee } = this.state;
    const { intl } = this.props;
    const publicKeys = steem.auth.generateKeys(account.name, account.password, ['owner', 'active', 'posting', 'memo']);
    const owner = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.owner, 1]] };
    const active = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.active, 1]] };
    const posting = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[publicKeys.posting, 1]],
    };

    const operations = [[
      'account_create', {
        fee: accountCreationFee,
        creator: auth.username,
        new_account_name: account.name,
        owner,
        active,
        posting,
        memo_key: publicKeys.memo,
        json_metadata: JSON.stringify({}),
      },
    ]];

    steem.broadcast.send(
      { operations, extensions: [] },
      { active: auth.wif },
      async (err) => {
        this.setState({ step: 0 });
        if (err) {
          notification.error({
            message: intl.formatMessage({ id: 'error' }),
            description: getErrorMessage(err) || intl.formatMessage({ id: 'general_error' }),
          });
        } else {
          notification.success({
            message: intl.formatMessage({ id: 'success' }),
            description: intl.formatMessage({ id: 'success_account_create' }, { account: account.name }),
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
        <div className="Sign__content container text-left my-2 Sign__authorize">
          {!this.state.accountCreationFee && <center><Loading /></center>}
          {this.state.accountCreationFee && step === 0 &&
            <div>
              <h2 className="text-center"><FormattedMessage id="create_account" /></h2>
              <AccountForm
                accountCreationFee={this.state.accountCreationFee}
                submit={this.submit}
              />
            </div>
          }
          {this.state.accountCreationFee && step === 1 &&
            <div className="text-center">
              <SignForm roles={['active']} sign={this.sign} />
            </div>
          }
          {this.state.accountCreationFee && step === 2 &&
            <div className="text-center">
              <Loading />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default injectIntl(CreateAccount);
