import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Popconfirm, notification } from 'antd';
import fetch from 'isomorphic-fetch';
import Loading from '../../widgets/Loading';
import AppPreview from './AppPreview';

class Apps extends Component {

  static propTypes = {
    auth: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }).isRequired,
    intl: intlShape.isRequired,
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

  confirm = () => {
    const { intl } = this.props;
    fetch('/api/token/revoke', {
      headers: new Headers({
        Authorization: this.props.auth.token,
      }),
    })
      .then(res => res.json())
      .then((result) => {
        if (result.success) {
          notification.success({
            message: intl.formatMessage({ id: 'success' }),
            description: intl.formatMessage({ id: 'success_revoke_app_tokens' }),
          });
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'error' }),
            description: intl.formatMessage({ id: 'general_error_short' }),
          });
        }
      });
  }

  render() {
    const { apps, isLoading, isLoaded } = this.state;
    const { intl } = this.props;
    return (
      <div className="container my-5">
        <h2><FormattedMessage id="apps" /></h2>
        {isLoading && <Loading />}
        {isLoaded &&
          <div>
            {apps.map((app, key) =>
              <AppPreview app={app} key={key} />
            )}
            <br />
            {apps.length > 0 &&
            <div className="block py-4">
              <h2><FormattedMessage id="revoke_all_oauth_token" /></h2>
              <p>
                <FormattedMessage id="revoke_all_oauth_token_text" />
              </p>
              <Popconfirm
                title={intl.formatMessage({ id: 'are_you_sure' })}
                onConfirm={this.confirm}
                okText={intl.formatMessage({ id: 'yes' })}
                cancelText={intl.formatMessage({ id: 'no' })}
              >
                <button type="button" className="btn btn-danger btn-sm ml-2">
                  <FormattedMessage id="revoke_access_tokens" />
                </button>
              </Popconfirm>
            </div>}
          </div>
        }
      </div>
    );
  }
}

export default injectIntl(Apps);
