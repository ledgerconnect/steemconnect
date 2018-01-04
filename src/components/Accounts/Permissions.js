import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import steem from '@steemit/steem-js';
import numeral from 'numeral';
import changeCase from 'change-case';
import Loading from '../../widgets/Loading';

export default class Permissions extends Component {
  static propTypes = {
    params: PropTypes.shape({
      username: PropTypes.string,
    }),
  }

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
      <div className="container py-5">
        <h2><FormattedMessage id="permissions" /></h2>
        {isLoading && <Loading />}
        {account.posting &&
          <div>
            <p><FormattedMessage id="permissions_list" values={{ username: <b>@{this.props.params.username}</b> }} /></p>
            {['owner', 'active', 'posting'].map((role, idx) =>
              <div key={idx}>
                <p><b>{changeCase.titleCase(role)}</b></p>
                <ul className="list-group text-xs-left mb-3">
                  {account[role].account_auths.map((auth, idxA) =>
                    <li key={idxA} className="list-group-item">
                      <b>@{auth[0]}</b>
                      <span className="ml-1">
                        {numeral((100 / account[role].weight_threshold) * (auth[1] / 100)).format('0%')}
                      </span>
                      {role === 'posting' &&
                        <Link
                          to={`/revoke/@${auth[0]}`}
                          className="float-right btn btn-secondary btn-sm ml-1"
                        >
                          <FormattedMessage id="revoke" />
                        </Link>
                      }
                    </li>
                  )}
                  {account[role].key_auths.map((auth, idxA) =>
                    <li key={idxA} className="list-group-item">
                      {auth[0]}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        }
      </div>
    );
  }
}
