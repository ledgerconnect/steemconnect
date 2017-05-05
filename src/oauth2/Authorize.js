import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'query-string';
import { authorize, login, hasAuthority, addPostingAuthority } from '../helpers/authHelper';
import Loading from '../widgets/Loading';
import SignForm from '../sign/SignForm';

@connect(
  dispatch => bindActionCreators({
    authorize,
  }, dispatch)
)
export default class Authorize extends Component {
  constructor(props) {
    super(props);
    const clientId = this.props.location.query.client_id;
    const redirectUri = this.props.location.query.redirect_uri;
    this.state = {
      clientId,
      redirectUri,
      step: 0,
    };
  }

  componentWillReceiveProps = (props) => {
    const { clientId, redirectUri } = this.state;
    const { app } = props;
    if (app.isAuthenticated && hasAuthority(app.user, clientId)) {
      authorize({ clientId }, (err, res) => {
        console.log(err, res);
        window.location = `${redirectUri}?${qs.stringify(res)}`;
      });
    } else if (app.isLoaded) {
      this.setState({ step: 1 })
    }
  };

  authorize = (auth) => {
    const { clientId, redirectUri } = this.state;
    this.setState({ step: 0 });
    login({ ...auth }, (err, res) => {
      console.log(err, res);
      addPostingAuthority({ ...auth, clientId }, (err, res) => {
        console.log(err, res);
        authorize({ clientId }, (err, res) => {
          console.log(err, res);
          window.location = `${redirectUri}?${qs.stringify(res)}`;
        });
      });
    })
  };

  render() {
    const { clientId, step } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 0 && <Loading/>}
          {step === 1 &&
            <div>
              <h2>Authorize</h2>
              <p>
                Do you want to authorize the Steem account
                <b> @{clientId}</b> to use your <b>posting</b> role?
              </p>
              <div className="form-group my-4">
                <button
                  type="submit"
                  onClick={() => this.setState({ step: 2 })}
                  className="btn btn-success"
                >
                  Continue
                </button>
              </div>
            </div>
          }
          {step === 2 && <SignForm roles={['owner', 'active']} sign={this.authorize} />}
        </div>
      </div>
    );
  }
}
