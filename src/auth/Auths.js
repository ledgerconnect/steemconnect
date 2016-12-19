import React, { Component } from 'react';
import steem from 'steem';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: {},
    };
  }

  componentDidMount() {
    steem.api.getAccounts(['greymass'], (err, result) =>
      this.setState({ account: result[0] })
    );
  }

  render() {
    const account = this.state.account;
    return (
      <div className="container my-3">
        <h2>Auths</h2>
        { account.name &&
          <div>
            <h2>@{ account.name }</h2>
            <h3>Posting</h3>
            {
              account.posting.account_auths.map(auth =>
                <p>@{ auth[0] }</p>
              )
            }
          </div>
        }
      </div>
    );
  }
}

