import React, { Component } from 'react';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import Icon from '../widgets/Icon';
import Loading from '../widgets/Loading';

export default class MyApps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      apps: [],
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });

    fetch(`/api/apps/me`, {
      headers: new Headers({
        Authorization: this.props.app.token,
      })
    })
      .then(res => res.json())
      .then(apps => {
        this.setState({
          apps,
          isLoading: false,
          isLoaded: true,
        });
      });
  };

  render() {
    const { apps, isLoading, isLoaded } = this.state;
    return (
      <div className="container my-5">
        <h2>My Apps</h2>
        <p>These are your apps.</p>
        {isLoading && <Loading/>}
        {isLoaded &&
          <div>
            {apps.map((app, key) =>
              <p key={key}>{app.client_id}</p>
            )}
            <p>
              <Link to="/developers/apps/create">
                <Icon name="add"/> New App
              </Link>
            </p>
          </div>
        }
      </div>
    );
  }
};
