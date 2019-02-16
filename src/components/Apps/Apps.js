import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Loading from '../../widgets/Loading';
import { getApps } from '../../utils/app';
import AppPreview from './AppPreview';

export default class Apps extends Component {
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
    getApps().then((apps) => {
      this.setState({
        apps,
        isLoading: false,
        isLoaded: true,
      });
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Failed to load the list of apps', e);
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
              <AppPreview username={app} key={key} />
            )}
          </div>
        }
      </div>
    );
  }
}
