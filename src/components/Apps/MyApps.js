import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import Icon from '../../widgets/Icon';
import Loading from '../../widgets/Loading';
import AppPreview from './AppPreview';

export default class MyApps extends Component {
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
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });

    fetch('/api/apps/me', {
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

  render() {
    const { apps, isLoading, isLoaded } = this.state;
    return (
      <div className="container my-5">
        <h2><FormattedMessage id="my_apps" /></h2>
        <p><FormattedMessage id="your_apps" /></p>
        {isLoading && <Loading />}
        {isLoaded &&
          <div>
            {apps.map((app, key) =>
              <AppPreview app={app} key={key} />
            )}
            <div className="list-group-item">
              <Link to="/apps/create">
                <Icon name="add" /> <FormattedMessage id="new_apps" />
              </Link>
            </div>
          </div>
        }
      </div>
    );
  }
}
