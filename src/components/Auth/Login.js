import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { decode } from 'steem/lib/auth/memo';
import SignForm from '../Sign/SignForm';
import Loading from '../../widgets/Loading';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      success: false,
    };
  }

  resetForm = () => {
    this.setState({
      step: 0,
      success: false,
    });
  };

  login = (auth) => {
    const { next } = this.props.location.query;
    this.setState({ step: 2 });
    fetch(`/api/login/challenge?username=${auth.username}`)
      .then(res => res.json())
      .then(data => {
        const token = decode(auth.wif, data.code);
        localStorage.setItem('token', token.substring(1));
        window.location = next ? next : '/dashboard';
      });
  };

  render() {
    const { step } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 1 && <SignForm title="Log In" roles={['posting']} sign={this.login} />}
          {step === 2 && <Loading />}
        </div>
      </div>
    );
  }
}
