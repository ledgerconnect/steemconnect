import React, { Component } from 'react';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import { hasAuthority } from '../../utils/auth';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/Avatar';

export default class MyApps extends Component {
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
      })
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
                  Edit
                </Link>
              }
              {this.props.auth.isAuthenticated && hasAuthority(this.props.auth.user, clientId) &&
                <Link to={`/revoke/@${clientId}`} className="btn btn-danger btn-sm ml-2">
                  Revoke
                </Link>
              }
            </span>
            <p>@{clientId}</p>
            <div className="pt-4">
              <p>This application is secured by SteemConnect.</p>
              <div className="list-group">
                <div className="list-group-item">
                  <b className="mr-1">Client Id:</b> {app.client_id}
                </div>
                {app.secret &&
                  <div className="list-group-item">
                    <b className="mr-1">Client Secret:</b>
                    {revealSecret
                      ? <div>
                        {`${app.secret} `}
                        <a href="#" onClick={() => this.setState({ revealSecret: false })}>
                          hide
                        </a>
                      </div>
                      : <a href="#" onClick={() => this.setState({ revealSecret: true })}>
                        click to reveal
                      </a>
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
