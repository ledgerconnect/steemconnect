import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import fetch from 'isomorphic-fetch';
import Loading from '../../widgets/Loading';
import AppPreview from './AppPreview';

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
    fetch('/api/apps')
      .then(res => res.json())
      .then((apps) => {
        this.setState({
          apps,
          isLoading: false,
          isLoaded: true,
        });
      });
  }

  render() {
    const { apps, isLoading, isLoaded } = this.state;
    return (
      <div className="container my-5">
        <h2><FormattedMessage id="apps" /></h2>
        {isLoading && <Loading />}
        {isLoaded &&
          <div>
            {apps.map((app, key) =>
              <AppPreview app={app} key={key} />
            )}
          </div>
        }
      </div>
    );
  }
}
