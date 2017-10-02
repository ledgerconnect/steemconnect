import React, { Component, PropTypes } from 'react';
import { login } from '../../utils/auth';
import SignForm from '../Form/Sign';
import Loading from '../../widgets/Loading';

export default class Login extends Component {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        next: PropTypes.string,
      }),
    }),
  };

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

  handleSubmit = (auth) => {
    const { next } = this.props.location.query;
    this.setState({ step: 2 });
    login({ ...auth }, () => {
      window.location = next || '/dashboard';
    });
  };

  render() {
    const { step } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 1 && <SignForm title="Log In" roles={['memo', 'posting']} sign={this.handleSubmit} />}
          {step === 2 && <Loading />}
        </div>
      </div>
    );
  }
}
