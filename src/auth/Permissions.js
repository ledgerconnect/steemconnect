import React, { Component } from 'react';
import steem from 'steem';
import changeCase from 'change-case';
import Loading from '../widgets/Loading';

export default class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      account: {},
    };
  }

  componentDidMount = () => {
    this.setState({ isLoading: true });
    steem.api.getAccounts([this.props.params.username], (err, result) => {
      this.setState({
        error: err,
        account: result[0],
        isLoading: false,
        isLoaded: true,
      });
    });
  };

  render() {
    const { account, isLoading } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          <h2>Permissions</h2>
          {isLoading && <Loading/>}
          {account.posting &&
            <div>
              <p>Here is a list of <b>@{this.props.params.username}</b>'s account permissions.</p>
              {['owner', 'active', 'posting'].map((role, idx) =>
                <div key={idx}>
                  <p><b>{changeCase.titleCase(role)}</b></p>
                  <ul className="list-group text-xs-left mb-3">
                    {account[role].account_auths.map((auth, idx) =>
                      <li key={idx} className="list-group-item">
                        <b>@{auth[0]}</b>
                      </li>
                    )}
                    {account[role].key_auths.map((auth, idx) =>
                      <li key={idx} className="list-group-item">
                        {auth[0]}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    );
  }
}
