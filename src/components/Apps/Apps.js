import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Input, Icon } from 'antd';
import fetch from 'isomorphic-fetch';
import Loading from '../../widgets/Loading';
import AppPreview from './AppPreview';
import './Apps.less';

export default class MyApps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      apps: [],
      filter: '',
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

  filterApps = (e) => {
    this.setState({ filter: e.target.value });
  }

  render() {
    const { apps, isLoading, isLoaded, filter } = this.state;

    return (
      <div className="container my-5">
        <div className="apps-header">
          <h2><FormattedMessage id="apps_title" /></h2>
          <p><FormattedMessage id="apps_subtitle" /></p>
          <Input
            placeholder="Search Apps"
            prefix={<Icon type="search" />}
            onChange={this.filterApps}
          />
        </div>
        {isLoading && <Loading />}
        {isLoaded &&
          <ul className="steemconnect-apps">
            {apps.filter(app => filter === '' || !filter || app.client_id.includes(filter)).map((app, key) =>
              <AppPreview app={app} key={key} />
            )}
          </ul>
        }
      </div>
    );
  }
}
