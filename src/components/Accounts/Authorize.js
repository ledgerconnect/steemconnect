import React, { Component } from 'react';
import steem from 'steem';
import SignForm from '../Form/Sign';
import SignSuccess from '../Sign/Success';
import SignError from '../Sign/Error';
import Loading from '../../widgets/Loading';
import { hasAuthority } from '../../utils/auth';

export default class Authorize extends Component {
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
    const { username, role, weight } = this.state;
    this.setState({ step: 2 });

    steem.api.getAccounts([auth.username], (err, accounts) => {

      if (!hasAuthority(accounts[0], username, role)) {
        let updatedAuthority = accounts[0][role];
        updatedAuthority.account_auths.push([username, parseInt(weight)]);

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
          (err, result) => {
            console.log(err, result);
            if (!err) {
              this.setState({ success: result });
            } else {
              this.setState({ error: err.payload.error });
            }
            this.setState({ step: 3 });
          });
      } else {
        this.setState({
          step: 3,
          success: true
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
        <div className="Sign__content container my-2">
          {step === 0 &&
            <div>
              <h2>Authorize</h2>
              <p>
                Do you want to authorize the Steem account
                <b> @{username}</b> to use your <b>{role}</b> role
                {weight !== 1 && <span> with a weight of <b>{weight}</b></span>}
                ?
              </p>
              <div className="form-group my-4">
                <button
                  type="submit"
                  onClick={() => this.setState({ step: 1 })}
                  className="btn btn-success"
                >
                  Continue
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
