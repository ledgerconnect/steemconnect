import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Input, Icon } from 'antd';
import fetch from 'isomorphic-fetch';
import Loading from '../../widgets/Loading';
import AppPreview from './AppPreview';
import './Apps.less';

export default class Apps extends Component {
  static propTypes = {
    auth: PropTypes.shape({
      token: PropTypes.string,
    }),
  }

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
    fetch('/api/apps', {
      headers: new Headers({
        Authorization: this.props.auth.token,
      }),
    })
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
        {isLoading && <div className="centered-loading"><Loading /></div>}
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
