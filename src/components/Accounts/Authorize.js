import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import steem from '@steemit/steem-js';
import SignForm from '../Form/Sign';
import SignSuccess from '../Sign/Success';
import SignError from '../Sign/Error';
import Loading from '../../widgets/Loading';
import { hasAuthority } from '../../utils/auth';

export default class Authorize extends Component {
  static propTypes = {
    params: PropTypes.shape({
      username: PropTypes.string,
      role: PropTypes.string,
    }),
    location: PropTypes.shape(),
  }

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      success: false,
      error: false,
      username: props.params.username,
      role: props.params.role || 'posting',
      weight: props.location.query.weight || 1,
      redirectUri: props.location.query.redirect_uri,
    };
  }

  onSubmit = (auth) => {
    const {
      location: {
          query: {
            auto_return: autoReturn,
            redirect_uri: redirectUri,
          },
      },
    } = this.props;
    const { username, role, weight } = this.state;
    this.setState({ step: 2 });

    steem.api.getAccounts([auth.username], (err, accounts) => {
      if (!hasAuthority(accounts[0], username, role)) {
        const updatedAuthority = accounts[0][role];
        updatedAuthority.account_auths.push([username, parseInt(weight, 10)]);

        const owner = role === 'owner' ? updatedAuthority : undefined;
        const active = role === 'active' ? updatedAuthority : undefined;
        const posting = role === 'posting' ? updatedAuthority : undefined;

        /** Add authority on user account */
        steem.broadcast.accountUpdate(
          auth.wif,
          auth.username,
          owner,
          active,
          posting,
          accounts[0].memo_key,
          accounts[0].json_metadata,
          (errBc, result) => {
            if (!errBc) {
              if (redirectUri && autoReturn) {
                window.location.href = redirectUri;
              } else {
                this.setState({ success: result, step: 3 });
              }
            } else {
              this.setState({ error: errBc, step: 3 });
            }
          });
      } else if (redirectUri && autoReturn) {
        window.location.href = redirectUri;
      } else {
        this.setState({
          step: 3,
          success: true,
        });
      }
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
    const { step, success, error, username, role, weight, redirectUri } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2 Sign__authorize">
          {step === 0 &&
            <div>
              <h2><FormattedMessage id="authorize" /></h2>
              <p>
                {weight !== 1 && <FormattedMessage
                  id="authorize_question_weight"
                  values={{
                    username: <b> @{username}</b>,
                    role: <b>{role}</b>,
                    weight: <b>{weight}</b>,
                  }}
                />}
                {weight === 1 && <FormattedMessage
                  id="authorize_question"
                  values={{
                    username: <b> @{username}</b>,
                    role: <b>{role}</b>,
                  }}
                />}
              </p>
              <div className="form-group my-4">
                <button
                  type="submit"
                  onClick={() => this.setState({ step: 1 })}
                  className="btn btn-success"
                >
                  <FormattedMessage id="continue" />
                </button>
              </div>
            </div>
          }
          {step === 1 && <SignForm roles={['owner', 'active']} onSubmit={this.onSubmit} />}
          {step === 2 && <Loading />}
          {step === 3 && success && <SignSuccess result={success} cb={redirectUri} />}
          {step === 3 && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}
