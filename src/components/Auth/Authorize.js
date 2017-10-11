import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
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
        response_type: PropTypes.string,
        redirect_uri: PropTypes.string,
        scope: PropTypes.string,
        state: PropTypes.string,
      }),
    }),
    auth: PropTypes.shape(),
  };

  constructor(props) {
    super(props);
    const clientId = this.props.location.query.client_id;
    const responseType = this.props.location.query.response_type || 'token';
    const redirectUri = this.props.location.query.redirect_uri;
    const scope = this.props.location.query.scope || '';
    const state = this.props.location.query.state;
    this.state = {
      clientId,
      responseType,
      redirectUri,
      scope,
      state,
      step: 0,
    };
  }

  componentWillReceiveProps = (props) => {
    const { clientId, responseType, redirectUri, scope, state } = this.state;
    const { auth } = props;
    if (auth.isAuthenticated && hasAuthority(auth.user, clientId)) {
      authorize({ clientId, scope, responseType }, (err, res) => {
        window.location = `${redirectUri}?${qs.stringify({ ...res, state })}`;
      });
    } else if (auth.isLoaded) {
      this.setState({ step: 1 });
    }
  };

  authorize = (auth) => {
    const { clientId, responseType, redirectUri, scope, state } = this.state;
    this.setState({ step: 0 });
    login({ ...auth }, () => {
      addPostingAuthority({ ...auth, clientId }, () => {
        authorize({ clientId, scope, responseType }, (errA, resA) => {
          window.location = `${redirectUri}?${qs.stringify({ ...resA, state })}`;
        });
      });
    });
  };

  render() {
    const { clientId, step } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2 Sign__authorize">
          {step === 0 && <Loading />}
          {step === 1 &&
            <div>
              <h2><FormattedMessage id="authorize" /></h2>
              <p>
                <FormattedMessage id="authorize_question" values={{ username: <b> @{clientId}</b>, role: <b><FormattedMessage id="posting" /></b> }} />
              </p>
              <div className="form-group my-4">
                <button
                  type="submit"
                  onClick={() => this.setState({ step: 2 })}
                  className="btn btn-success"
                >
                  <FormattedMessage id="continue" />
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
