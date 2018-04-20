import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Form, Button } from 'antd';
import { titleCase } from 'change-case';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'query-string';
import jwt from 'jsonwebtoken';
import fetch from 'isomorphic-fetch';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import { authorize, login, addPostingAuthority } from '../../utils/auth';
import { getAccounts } from '../../utils/localStorage';
import SteemitAvatar from '../../widgets/SteemitAvatar';
import Loading from '../../widgets/Loading';
import SignForm from '../Form/Sign';
import ChooseAccountForm from '../Form/ChooseAccount';
import config from '../../../config.json';
import './Authorize.less';

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
      scopes: [],
      app: null,
    };
  }

  async componentWillMount() {
    const { scope, clientId } = this.state;
    if (scope !== '') {
      if (difference(scope.split(','), config.authorized_operations.concat(['login', 'offline'])).length > 0) {
        this.setState({ step: 4 });
        return;
      }
    }
    let scopes = intersection(scope.split(','), config.authorized_operations);
    if (scope.split(',').length === 0) {
      scopes = config.authorized_operations;
    }
    const app = await fetch(`/api/apps/@${clientId}`)
      .then(res => res.json());
    this.setState({ scopes, app, step: 1 });
  }

  authorize = (auth) => {
    const { clientId, responseType, redirectUri, scope, state, scopes } = this.state;
    this.setState({ step: 0 });
    login({ ...auth }, () => {
      if (scope === '' || intersection(scopes, config.authorized_operations).length > 0) {
        addPostingAuthority({ ...auth, clientId }, () => {
          authorize({ clientId, scope, responseType }, (errA, resA) => {
            window.location = `${redirectUri}?${qs.stringify({ ...resA, state })}`;
          });
        });
      } else {
        authorize({ clientId, scope, responseType }, (errA, resA) => {
          window.location = `${redirectUri}?${qs.stringify({ ...resA, state })}`;
        });
      }
    });
  };

  selectNextStep = () => {
    const accounts = getAccounts();
    if (accounts.length > 0) {
      return 2;
    }
    return 3;
  }

  addAccount = () => {
    this.setState({ step: 3 });
  }

  hasAuthorityFromStorage = (username, clientId) => {
    const accounts = getAccounts();
    const account = accounts.find(acc => acc.username === username);
    const auths = account.postingAuths.map(auth => auth[0]);
    return auths.indexOf(clientId) !== -1;
  }

  changeAccount = () => {
    const { clientId, responseType, redirectUri, scope, state } = this.state;
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      const decodedToken = jwt.decode(accessToken);
      if (decodedToken.user && (scope === '' || intersection(scope.split(','), config.authorized_operations).length > 0) && !this.hasAuthorityFromStorage(decodedToken.user, clientId)) {
        this.setState({ step: 3 });
      } else {
        authorize({ clientId, scope, responseType }, (err, res) => {
          window.location = `${redirectUri}?${qs.stringify({ ...res, state })}`;
        });
      }
    } else {
      this.setState({ step: 3 });
    }
  }

  render() {
    const { clientId, scope, step, scopes, app } = this.state;
    const requiredRoles = (scope === 'login') ? ['memo', 'posting'] : ['owner', 'active'];
    return (
      <div className="Sign">
        {step === 0 && <Loading />}
        {step !== 0 && <div className="Sign__content">
          <div className="Sign_frame">
            <div className="Sign__header">
              <object data="/img/logo.svg" type="image/svg+xml" id="logo" />
            </div>
            <div className="Sign__wrapper">
              {step === 1 &&
                <Form onSubmit={this.handleSubmit} className="SignForm AuthorizeForm">
                  <div className="Avatars">
                    <div className="Avatar-container">
                      <span className="Avatar" style={{ height: '40px', width: '40px' }}>
                        <object
                          data="/img/logo-c.svg"
                          type="image/svg+xml"
                          id="logo-c"
                          style={{ height: '40px', width: '40px' }}
                        />
                      </span>
                    </div>
                    <div className="Avatar-link" />
                    <div className="Avatar-container">
                      {!app &&
                      <SteemitAvatar username={clientId} size="40" />}
                      {app &&
                      <img
                        src={`https://steemitimages.com/40x40/${app.icon}`}
                        alt="icon"
                      />}
                    </div>
                  </div>
                  <p>
                    {scope !== '' &&
                    intersection(scopes, config.authorized_operations).length === 0 &&
                    intersection(scope.split(','), ['login', 'offline']).length > 0 &&
                    <FormattedMessage
                      id="authorize_login_question"
                      values={{
                        username: <b> {(app && app.name) || `@${clientId}`}</b>,
                      }}
                    />}
                    {(scope === '' || intersection(scopes, config.authorized_operations).length > 0) &&
                    <FormattedMessage
                      id="authorize_question"
                      values={{
                        username: <b> {(app && app.name && `${app.name} (@${clientId})`) || `@${clientId}`}</b>,
                        role: <b><FormattedMessage id="posting" /></b>,
                      }}
                    />}
                  </p>
                  {(scopes.length > 0 || scope.indexOf('offline') !== -1) &&
                  <ul className="authorize-operations">
                    {scope.indexOf('offline') !== -1 && <li><object data="/img/authorize/check.svg" type="image/svg+xml" className="check-icon" />{titleCase('offline_access')}</li>}
                    {scopes.map(op => <li key={op}><object data="/img/authorize/check.svg" type="image/svg+xml" className="check-icon" />{titleCase(op)}</li>)}
                  </ul>}
                  {scope === '' &&
                  <ul className="authorize-operations">
                    {config.authorized_operations.map(op => <li><object data="/img/authorize/check.svg" type="image/svg+xml" className="check-icon" />{titleCase(op === 'offline' ? 'offline_access' : op)}</li>)}
                  </ul>}
                  <Form.Item>
                    <Button
                      type="primary" htmlType="button" className="SignForm__button"
                      onClick={() => this.setState({ step: this.selectNextStep() })}
                    >
                      <FormattedMessage id="continue" />
                    </Button>
                  </Form.Item>
                </Form>
              }
              {step === 2 &&
              <ChooseAccountForm
                addAccount={this.addAccount}
                callback={this.changeAccount}
              />}
              {step === 3 && <SignForm roles={requiredRoles} sign={this.authorize} />}
              {step === 4 &&
              <div>
                <div className="Sign__result-title-bg">
                  <object data="/img/sign/fail.svg" type="image/svg+xml" id="error-icon" />
                </div>
                <h2><FormattedMessage id="error" /></h2>
                <FormattedMessage id="error_invalid_scope" values={{ scopes: <b>{config.authorized_operations.concat(['login', 'offline']).join(', ')}</b> }} />
              </div>
              }
            </div>
            <div className="Sign__footer">
              <Link to="/" target="_blank" rel="noopener noreferrer"><FormattedMessage id="about_steemconnect" /></Link>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
