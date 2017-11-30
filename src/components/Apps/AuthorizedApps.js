import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import numeral from 'numeral';
import fetch from 'isomorphic-fetch';
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
      apps: [],
    };
  }

  async componentWillMount() {
    const result = await fetch('/api/apps/authorized', {
      headers: new Headers({
        Authorization: this.props.auth.token,
      }),
    })
    .then(res => res.json());

    this.setState({ apps: result.apps });
  }

  render() {
    const { isLoading, apps } = this.state;
    const { user } = this.props.auth;
    return (
      <div className="container py-5">
        <h2><FormattedMessage id="authorized_apps" /></h2>
        {isLoading && <Loading />}
        {user.posting &&
          <div>
            <p><FormattedMessage id="authorized_apps_list" /></p>
            <ul className="list-group text-xs-left mb-3">
              {apps.map((app, idx) =>
                <li key={idx} className="list-group-item">
                  <b><Link to={`/apps/@${app[0]}`}>{app[0]}</Link></b>
                  <span className="ml-1">
                    {numeral((100 / user.posting.weight_threshold) * (app[1] / 100)).format('0%')}
                  </span>
                  <Link
                    to={`/revoke/@${app.client_id}`}
                    className="float-right btn btn-secondary btn-sm ml-1"
                  >
                    <FormattedMessage id="revoke" />
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
