import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import AppForm from './AppForm';
import Loading from '../widgets/Loading';
import Avatar from '../widgets/Avatar';

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
        Authorization: this.props.app.token,
      })
    })
      .then(res => res.json())
      .then(app => {
        this.setState({
          app,
          isLoading: false,
          isLoaded: true,
        });
      });
  }

  submit = (data) => {
    const { clientId } = this.state;
    fetch(`/api/apps/@${clientId}`, {
      method: 'PUT',
      headers: new Headers({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: this.props.app.token,
      }),
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        console.log('Updated');
      });
  };

  render() {
    const { app, clientId, isLoading, isLoaded } = this.state;
    return (
      <div className="container my-5">
        <Avatar username={clientId} size="80" className="float-left mr-3" />
        <h2 className="d-inline">{clientId}</h2>
        <p>@{clientId}</p>
        {isLoading && <Loading/>}
        {isLoaded &&
          <AppForm data={app} submit={this.submit} />
        }
      </div>
    );
  }
};
