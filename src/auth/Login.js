import React, { Component } from 'react';
import crypto from 'crypto';
import cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';
import SignForm from '../sign/SignForm';
import SignError from '../sign/SignError';
import Loading from '../widgets/Loading';
import { encryptMessage } from '../../helpers/hash';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      success: false,
      error: false,
    };
  }

  resetForm = () => {
    this.setState({
      step: 0,
      error: false,
      success: false,
    });
  };

  login = (auth) => {
    const { next } = this.props.location.query;

    this.setState({ step: 2 });

    const secret = crypto.randomBytes(32).toString('base64');
    cookie.set('_secret', secret, {
      path: '/',
      secure: global.location.hostname !== 'localhost',
      expires: 10,
    });

    const payload = { message: encryptMessage(auth.wif, secret) };
    fetch('/oauth2/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      credentials: 'include',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    })
      .then(res => res.json())
      .then(data => {
        window.location = next ? next : '/';
      });
  };

  render() {
    const { step, error } = this.state;
    const { params: { username } } = this.props;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 1 && <SignForm roles={['posting']} sign={this.login} />}
          {step === 2 && <Loading />}
          {step === 3 && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}
