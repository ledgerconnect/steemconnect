import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import { hasAuthority } from '../../utils/auth';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/Avatar';

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
          <div>
            <Avatar icon={app.icon} size="80" className="float-left mr-3" />
            <h2 className="d-inline">{clientId}</h2>
            <span className="float-right">
              {isLoaded && app.owner === this.props.auth.user.name &&
                <Link to={`/apps/@${clientId}/edit`} className="btn btn-secondary btn-sm ml-2">
                  <FormattedMessage id="edit" />
                </Link>
              }
              {this.props.auth.isAuthenticated && hasAuthority(this.props.auth.user, clientId) &&
                <Link to={`/revoke/@${clientId}`} className="btn btn-danger btn-sm ml-2">
                  <FormattedMessage id="revoke" />
                </Link>
              }
            </span>
            <p>@{clientId}</p>
            <div className="pt-4">
              <p><FormattedMessage id="app_secured_by" /></p>
              <div className="list-group">
                <div className="list-group-item">
                  <b className="mr-1"><FormattedMessage id="client_id" />:</b> {app.client_id}
                </div>
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
              </div>
            </div>
          </div>
        }
        {isLoading && <Loading />}
      </div>
    );
  }
}
