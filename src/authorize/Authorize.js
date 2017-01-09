import React, { Component } from 'react';
import steem from 'steem';
import SignForm from '../sign/SignForm';
import Loading from '../widgets/Loading';

export default class Sign extends Component {
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
    this.setState({ step: 2 });

    steem.api.getAccounts([auth.username], (err, result) => {
      const { owner, active, posting, memo_key, json_metadata } = result[0];
      let hasAuth = false;
      let postingNew = posting;

      posting.account_auths.map((account) => {
        if (account[0] === username) {
          hasAuth = true;
        }
      });
      !hasAuth && postingNew.account_auths.push([username, 1]);

      steem.broadcast.accountUpdate(
        auth.wif,
        auth.username,
        owner,
        active,
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
    const { params: { username } } = this.props;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          { step === 0 &&
            <div>
              <h1>Authorize</h1>
              <p>Do you want to authorize the Steem account <b>@{ username }</b> to use your <b>posting</b> role?</p>
              <div className="form-group my-2">
                <button type="submit" onClick={() => this.setState({ step: 1 })} className="btn btn-success">Continue</button>
              </div>
            </div>
          }

          { step === 1 &&
            <SignForm
              roles={['owner', 'active']}
              sign={this.authorize}
            />
          }

          { step === 2 && <Loading /> }

          {
            step === 3 && success &&
            <div>
              <h1 className="text-success">Success</h1>
              <p>The operation has been successfully broadcasted.</p>
              <p>
                Ref Block Num:<b> { success.ref_block_num }</b>
                , Ref Block Prefix:<b> { success.ref_block_prefix }</b>
              </p>
            </div>
          }

          {
            step === 3 && error &&
            <div>
              <h3 className="text-danger">
                Oops, something goes wrong!
              </h3>
              <h5>
                <strong>Error code: { error.code }</strong> { error.data.message }
              </h5>
              <p>Do you want to <a href="#" onClick={this.resetForm}>try again</a>?</p>
            </div>
          }
        </div>
      </div>
    );
  }
}
