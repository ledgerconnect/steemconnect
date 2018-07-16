import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { authorize, login } from '../../utils/auth';
import SignForm from '../Form/Sign';
import ChooseAccountForm from '../Form/ChooseAccount';
import Loading from '../../widgets/Loading';
import { getAccounts } from '../../utils/localStorage';
import './Login.less';


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
      step: 0,
      success: false,
    };
  }

  componentWillMount() {
    let step = 1;
    const accounts = getAccounts();
    if (accounts.length > 0) {
      step = 2;
    }
    this.setState({ step });
  }

  resetForm = () => {
    this.setState({
      step: 0,
      success: false,
    });
  };

  handleSubmit = (auth) => {
    const { next } = this.props.location.query;
    this.setState({ step: 0 });
    login({ ...auth }, () => {
      window.location = next || '/dashboard';
    });
  };

  addAccount = () => {
    this.setState({ step: 1 });
  }

  changeAccount = () => {
    const { clientId, responseType, next, scope } = this.state;
    authorize({ clientId, scope, responseType }, () => {
      window.location = next || '/dashboard';
    });
  }

  render() {
    const { step } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2 login-form Sign__authorize">
          <div className="Sign_frame">
            <div className="Sign__header">
              <object data="/img/logo.svg" type="image/svg+xml" id="logo" />
            </div>
            <div className="Sign__wrapper">
              {step === 0 && <Loading />}
              {step === 1 && <SignForm title={<FormattedMessage id="log_in" />} roles={['posting']} sign={this.handleSubmit} />}
              {step === 2 &&
              <ChooseAccountForm
                addAccount={this.addAccount}
                callback={this.changeAccount}
              />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
