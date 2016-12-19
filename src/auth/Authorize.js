import React, { Component } from 'react';
import steem from 'steem';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const username = this.state.username.value;
    const password = this.state.password.value;
    const wif = steem.auth.isWif(password)
      ? password
      : steem.auth.toWif(username, password, 'active');
    console.log(username, password, wif);

    steem.api.getAccounts([username], (err, result) => {
      const posting = result[0].posting;
      const jsonMetadata = JSON.parse(result[0].json_metadata) || '';
      steem.broadcast.accountUpdate(
        wif,
        result[0].name,
        undefined,
        undefined,
        posting,
        result[0].memo_key,
        jsonMetadata,
        (err, result) => {
          console.log(err, result);
      })
    });
  };

  render() {
    const { username } = this.props.params;
    return (
      <div className="Signer container my-3">
        <h2>Authorize @{ username }</h2>
        <form className="Signer__form" onSubmit={this.handleSubmit}>
          <p>This operation require a password or active WIF</p>
          <div className="form-group">
            <input
              ref={(c) => { this.state.username = c; }}
              placeholder="Username"
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              ref={(c) => { this.state.password = c; }}
              name="password"
              placeholder={`Password or active WIF`}
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-success">Confirm</button>
          </div>
        </form>
      </div>
    );
  }
}

