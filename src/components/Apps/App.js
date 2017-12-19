import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import { hasAuthority } from '../../utils/auth';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/Avatar';
import './App.less';

export default class MyApps extends Component {
  static propTypes = {
    params: PropTypes.shape({
      clientId: PropTypes.string,
    }),
    auth: PropTypes.shape({
      isAuthenticated: PropTypes.bool,
      token: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      revealSecret: false,
      clientId: this.props.params.clientId,
      app: [],
    };
  }

  componentWillMount() {
    const { clientId } = this.state;
    this.setState({ isLoading: true });

    fetch(`/api/apps/@${clientId}`, {
      headers: new Headers({
        Authorization: this.props.auth.token,
      }),
    })
      .then(res => res.json())
      .then((app) => {
        this.setState({
          app,
          isLoading: false,
          isLoaded: true,
        });
      });
  }

  render() {
    const { app, clientId, isLoading, isLoaded, revealSecret } = this.state;
    return (
      <div className="container my-5">
        {isLoaded &&
          <div className="AppView">
            <div className="AppView__app-header">
              <div className="AppView__Avatar">
                <Avatar icon={app.icon} size="140" className="float-left mr-3" />
              </div>
              <div className="AppView__information">
                <h2>@{clientId}</h2>
                {app.secret &&
                <div className="list-group-item">
                  <b className="mr-1"><FormattedMessage id="client_secret" />:</b>
                  {revealSecret
                    ? <div>
                      {`${app.secret} `}
                      <button className="button-link" onClick={() => this.setState({ revealSecret: false })}>
                        <FormattedMessage id="hide" />
                      </button>
                    </div>
                    : <button className="button-link" onClick={() => this.setState({ revealSecret: true })}>
                      <FormattedMessage id="click_to_reveal" />
                    </button>
                  }
                </div>
                }
                <div className="app-footer">
                  {isLoaded && app.owner === this.props.auth.user.name &&
                  <Link to={`/apps/@${clientId}/edit`} className="btn btn-secondary btn-sm ml-2">
                    <FormattedMessage id="edit" />
                  </Link>}
                  {this.props.auth.isAuthenticated &&
                  hasAuthority(this.props.auth.user, clientId) &&
                  <Link to={`/revoke/@${clientId}`} className="btn btn-danger btn-sm ml-2">
                    <FormattedMessage id="revoke" />
                  </Link>}
                  <span className="users-stats">
                    <strong>{app.users}</strong> <FormattedMessage id="active_users" />
                  </span>
                </div>
              </div>
            </div>
            <div className="AppView__app-content">
              <h2><FormattedMessage id="description" /></h2>
              <p>
                {app.description}
              </p>
              {app.website &&
              <p>
                <FormattedMessage id="visit_us" />: <a href={app.website} target="_blank" rel="noopener noreferrer">{app.website}</a>
              </p>}
              <p className="secured-by"><FormattedMessage id="app_secured_by" /></p>
            </div>
          </div>
        }
        {isLoading && <div className="centered-loading"><Loading /></div>}
      </div>
    );
  }
}
