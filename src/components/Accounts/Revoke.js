import React, { Component } from 'react';
import steem from 'steem';
import SignForm from '../Form/Sign';
import SignSuccess from '../Sign/Success';
import SignError from '../Sign/Error';
import Loading from '../../widgets/Loading';

export default class Revoke extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      success: false,
      error: false,
    };
  }

  resetForm = () => {
    this.setState({
      step: 0,
      error: false,
      success: false,
    });
  };

  revoke = (auth) => {
    const { username } = this.props.params;
    this.setState({ step: 2 });

    steem.api.getAccounts([auth.username], (err, result) => {
      const { posting, memo_key, json_metadata } = result[0];
      const postingNew = posting;

      posting.account_auths.map((account, idx) => (
          account[0] === username ? postingNew.account_auths.splice(idx, 1) : null
        )
      );

      steem.broadcast.accountUpdate(
        auth.wif,
        auth.username,
        undefined,
        undefined,
        postingNew,
        memo_key,
        json_metadata,
        (errBc, resultBc) => {
          if (!errBc) {
            this.setState({ success: resultBc });
          } else {
            this.setState({ error: errBc });
          }
          this.setState({ step: 3 });
        });
    });
  };

  render() {
    const { step, success, error } = this.state;
    const { params: { username } } = this.props;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 0 &&
            <div>
              <h2>Revoke</h2>
              <p>Do you want to revoke the Steem account <b>@{ username }</b> to use your <b>posting</b> role?</p>
              <div className="form-group my-4">
                <button type="submit" onClick={() => this.setState({ step: 1 })} className="btn btn-success">Continue</button>
              </div>
            </div>
          }
          {step === 1 && <SignForm roles={['owner', 'active']} sign={this.revoke} />}
          {step === 2 && <Loading />}
          {step === 3 && success && <SignSuccess result={success} cb={this.props.location.query.cb} />}
          {step === 3 && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}
