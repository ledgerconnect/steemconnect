import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import Avatar from '../../widgets/Avatar';
import Loading from '../../widgets/Loading';

import './AuthorizedApps.less';

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
        {isLoading && <Loading />}
        {user.posting &&
          <div>
            <ul className="authorized-apps-list">
              {user.posting.account_auths.map((auth, idx) =>
                <li key={idx} className="authorized-apps-list-item">
                  <div className="app-item-name">
                    <Link to={`/apps/@${auth[0]}`} className="AppAvatar"><Avatar username={auth[0]} size="60" /></Link>
                    <Link to={`/apps/@${auth[0]}`}>{auth[0]}</Link>
                  </div>
                  <div className="app-item-action">
                    <Link
                      to={`/revoke/@${auth[0]}`}
                      className="float-right btn btn-secondary btn-sm ml-1"
                    >
                      <FormattedMessage id="revoke" />
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </div>
        }
      </div>
    );
  }
}
