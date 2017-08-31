import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { notification } from 'antd';
import AppForm from './AppForm';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/Avatar';

export default class EditApp extends Component {
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
          message: 'Success',
          description: 'Your application has been successfully updated',
        });
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Oops! Something goes wrong.',
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
