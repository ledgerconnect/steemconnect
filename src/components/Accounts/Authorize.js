import React, { Component } from 'react';
import steem from 'steem';
import SignForm from '../Form/Sign';
import SignSuccess from '../Sign/Success';
import SignError from '../Sign/Error';
import Loading from '../../widgets/Loading';

export default class Authorize extends Component {
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

  authorize = (auth) => {
    const { username } = this.props.params;
    const weight = this.props.location.query.weight || 1;
    this.setState({ step: 2 });

    steem.api.getAccounts([auth.username], (err, result) => {
      const { posting, memo_key, json_metadata } = result[0];
      let hasAuth = false;
      let postingNew = posting;

      posting.account_auths.map((account) => {
        if (account[0] === username) {
          hasAuth = true;
        }
      });
      !hasAuth && postingNew.account_auths.push([username, parseInt(weight)]);

      steem.broadcast.accountUpdate(
        auth.wif,
        auth.username,
        undefined,
        undefined,
        postingNew,
        memo_key,
        json_metadata,
        (err, result) => {

        console.log(err, result);

        if (!err) {
          this.setState({ success: result });
        } else {
          console.log(err);
          this.setState({ error: err.payload.error });
        }
        this.setState({ step: 3 });
      });
    });
  };

  render() {
    const { step, success, error } = this.state;
    const { params: { username }, location: { query } } = this.props;
    const weight = query.weight;
    const redirectUri = query.cb || query.redirect_uri;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 0 &&
            <div>
              <h2>Authorize</h2>
              <p>
                Do you want to authorize the Steem account
                <b> @{ username }</b> to use your <b>posting</b> role
                {weight && <span> with a weight of <b>{weight}</b></span>}
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
          {step === 1 && <SignForm roles={['owner', 'active']} sign={this.authorize} />}
          {step === 2 && <Loading />}
          {step === 3 && success && <SignSuccess result={success} cb={redirectUri} />}
          {step === 3 && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}
