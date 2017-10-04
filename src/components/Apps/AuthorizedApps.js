import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import numeral from 'numeral';
import Loading from '../../widgets/Loading';

export default class AuthorizedApps extends Component {
  static propTypes = {
    auth: PropTypes.shape(),
  }

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
    };
  }

  render() {
    const { isLoading } = this.state;
    const { user } = this.props.auth;
    return (
      <div className="container py-5">
        <h2>Authorized Apps</h2>
        {isLoading && <Loading />}
        {user.posting &&
          <div>
            <p>Here is a list of authorized application to use your account.</p>
            <ul className="list-group text-xs-left mb-3">
              {user.posting.account_auths.map((auth, idx) =>
                <li key={idx} className="list-group-item">
                  <b><Link to={`/apps/@${auth[0]}`}>{auth[0]}</Link></b>
                  <span className="ml-1">
                    {numeral((100 / user.posting.weight_threshold) * (auth[1] / 100)).format('0%')}
                  </span>
                  <Link
                    to={`/revoke/@${auth[0]}`}
                    className="float-right btn btn-secondary btn-sm ml-1"
                  >
                    Revoke
                  </Link>
                </li>
              )}
            </ul>
          </div>
        }
      </div>
    );
  }
}
