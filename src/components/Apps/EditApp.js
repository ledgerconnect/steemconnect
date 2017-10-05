import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import fetch from 'isomorphic-fetch';
import { notification } from 'antd';
import AppForm from './AppForm';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/Avatar';

class EditApp extends Component {
  static propTypes = {
    params: PropTypes.shape({
      clientId: PropTypes.string,
    }),
    auth: PropTypes.shape({
      token: PropTypes.string,
    }),
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      clientId: this.props.params.clientId,
      app: {},
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

  submit = (data) => {
    const { clientId } = this.state;
    const { intl } = this.props;
    this.setState({ isLoading: true });
    fetch(`/api/apps/@${clientId}`, {
      method: 'PUT',
      headers: new Headers({
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: this.props.auth.token,
      }),
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(() => {
        this.setState({ isLoading: false });
        notification.success({
          message: intl.formatMessage({ id: 'success' }),
          description: intl.formatMessage({ id: 'success_app_updated' }),
        });
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({ id: 'error' }),
          description: intl.formatMessage({ id: 'general_error' }),
        });
      });
  };

  render() {
    const { app, clientId, isLoading, isLoaded } = this.state;
    return (
      <div className="container my-5">
        {isLoading && <Loading />}
        {isLoaded &&
          <div>
            <div className="pb-3">
              <Avatar icon={app.icon} size="80" className="float-left mr-3" />
              <h2 className="d-inline">{clientId}</h2>
              <p>@{clientId}</p>
            </div>
            <AppForm
              data={app}
              isLoading={isLoading}
              submit={this.submit}
            />
          </div>
        }
      </div>
    );
  }
}

export default injectIntl(EditApp);
