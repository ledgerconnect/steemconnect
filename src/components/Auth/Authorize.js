import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'query-string';
import { authorize, login, hasAuthority, addPostingAuthority } from '../../utils/auth';
import Loading from '../../widgets/Loading';
import SignForm from '../Form/Sign';

@connect(
  dispatch => bindActionCreators({
    authorize,
  }, dispatch)
)
export default class Authorize extends Component {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        client_id: PropTypes.string,
        scope: PropTypes.string,
        redirect_uri: PropTypes.string,
      }),
    }),
    // eslint-disable-next-line react/forbid-prop-types
    auth: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const clientId = this.props.location.query.client_id;
    const redirectUri = this.props.location.query.redirect_uri;
    const scope = this.props.location.query.scope || '';
    this.state = {
      clientId,
      redirectUri,
      scope,
      step: 0,
    };
  }

  componentWillReceiveProps = (props) => {
    const { clientId, scope, redirectUri } = this.state;
    const { auth } = props;
    if (auth.isAuthenticated && hasAuthority(auth.user, clientId)) {
      authorize({ clientId, scope }, (err, res) => {
        window.location = `${redirectUri}?${qs.stringify(res)}`;
      });
    } else if (auth.isLoaded) {
      this.setState({ step: 1 });
    }
  };

  authorize = (auth) => {
    const { clientId, redirectUri, scope } = this.state;
    this.setState({ step: 0 });
    login({ ...auth }, () => {
      addPostingAuthority({ ...auth, clientId }, () => {
        authorize({ clientId, scope }, (errA, resA) => {
          window.location = `${redirectUri}?${qs.stringify(resA)}`;
        });
      });
    });
  };

  render() {
    const { clientId, step } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 0 && <Loading />}
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
