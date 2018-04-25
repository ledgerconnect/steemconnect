import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Modal, notification } from 'antd';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import { hasAuthority } from '../../utils/auth';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/Avatar';

class App extends Component {
  static propTypes = {
    params: PropTypes.shape({
      clientId: PropTypes.string,
    }),
    auth: PropTypes.shape({
      isAuthenticated: PropTypes.bool,
      token: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      revealSecret: false,
      clientId: this.props.params.clientId,
      app: [],
      displayRevokeModal: false,
      displayResetSecretModal: false,
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

  showRevokeModal = () => {
    this.setState({
      displayRevokeModal: true,
    });
  }

  showResetSecretModal = () => {
    this.setState({
      displayResetSecretModal: true,
    });
  }

  handleCancel = () => {
    this.setState({
      displayRevokeModal: false,
      displayResetSecretModal: false,
    });
  }

  confirm = () => {
    const { intl } = this.props;
    fetch(`/api/token/revoke/user/${this.state.clientId}`, {
      headers: new Headers({
        Authorization: this.props.auth.token,
      }),
    })
      .then(res => res.json())
      .then((result) => {
        this.handleCancel();
        if (result.success) {
          notification.success({
            message: intl.formatMessage({ id: 'success' }),
            description: intl.formatMessage({ id: 'success_revoke_app_tokens' }),
          });
        } else {
          notification.error({
            message: intl.formatMessage({ id: 'error' }),
            description: intl.formatMessage({ id: 'general_error_short' }),
          });
        }
      });
  }

  confirmResetSecret = () => {
    const { clientId, app } = this.state;
    const { intl, auth } = this.props;
    fetch(`/api/apps/@${clientId}/reset-secret`, {
      method: 'PUT',
      headers: new Headers({
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: auth.token,
      }),
    })
      .then(res => res.json())
      .then((res) => {
        app.secret = res.secret;
        this.setState({ app });
        this.handleCancel();
        notification.success({
          message: intl.formatMessage({ id: 'success' }),
          description: intl.formatMessage({ id: 'success_secret_reset' }),
        });
      })
      .catch(() => {
        this.handleCancel();
        notification.error({
          message: intl.formatMessage({ id: 'error' }),
          description: intl.formatMessage({ id: 'general_error' }),
        });
      });
  }

  render() {
    const {
      app, clientId, isLoading, isLoaded, revealSecret,
      displayRevokeModal, displayResetSecretModal,
    } = this.state;
    const { intl } = this.props;
    return (
      <div className="container my-5">
        {isLoaded &&
          <div>
            <Avatar icon={app.icon} size="80" className="float-left mr-3" />
            <h2 className="d-inline">{clientId}</h2>
            <span className="float-right">
              {isLoaded && app.owner === this.props.auth.user.name &&
                <Link to={`/apps/@${clientId}/edit`} className="btn btn-secondary btn-sm ml-2">
                  <FormattedMessage id="edit" />
                </Link>
              }
              {this.props.auth.isAuthenticated && hasAuthority(this.props.auth.user, clientId) &&
                <Link to={`/revoke/@${clientId}`} className="btn btn-danger btn-sm ml-2">
                  <FormattedMessage id="revoke" />
                </Link>
              }
            </span>
            <p>@{clientId}</p>
            <div className="pt-4">
              <p><FormattedMessage id="app_secured_by" /></p>
              <div className="list-group">
                <div className="list-group-item">
                  <b className="mr-1"><FormattedMessage id="client_id" />:</b> {app.client_id}
                </div>
                {app.secret &&
                  <div className="list-group-item">
                    <b className="mr-1"><FormattedMessage id="client_secret" />:</b>
                    {revealSecret
                      ? <div>
                        {`${app.secret} `}
                        <button className="button-link" onClick={() => this.setState({ revealSecret: false })}>
                          <FormattedMessage id="hide" />
                        </button>
                      </div>
                      : <button className="button-link" onClick={() => this.setState({ revealSecret: true })}>
                        <FormattedMessage id="click_to_reveal" />
                      </button>
                    }
                    <button type="button" className="btn btn-secondary btn-sm ml-2" onClick={this.showResetSecretModal}>
                      <FormattedMessage id="reset" />
                    </button>
                    <Modal
                      title={intl.formatMessage({ id: 'are_you_sure' })}
                      visible={displayResetSecretModal}
                      onOk={this.confirmResetSecret}
                      onCancel={this.handleCancel}
                      okText={intl.formatMessage({ id: 'yes' })}
                      cancelText={intl.formatMessage({ id: 'no' })}
                    >
                      <p><FormattedMessage id="reset_secret_question" /></p>
                    </Modal>
                  </div>
                }
              </div>
            </div>
            <br />
            {this.props.auth.isAuthenticated && hasAuthority(this.props.auth.user, clientId) &&
            <div className="block py-4">
              <h2><FormattedMessage id="revoke_access_tokens" /></h2>
              <p>
                <FormattedMessage id="revoke_access_tokens_text" />
              </p>
              <Modal
                title={intl.formatMessage({ id: 'are_you_sure' })}
                visible={displayRevokeModal}
                onOk={this.confirm}
                onCancel={this.handleCancel}
                okText={intl.formatMessage({ id: 'yes' })}
                cancelText={intl.formatMessage({ id: 'no' })}
              >
                <p><FormattedMessage id="revoke_access_tokens_question" /></p>
              </Modal>
              <button type="button" className="btn btn-danger btn-sm ml-2" onClick={this.showRevokeModal}>
                <FormattedMessage id="revoke_access_tokens" />
              </button>
            </div>}
          </div>
        }
        {isLoading && <Loading />}
      </div>
    );
  }
}

export default injectIntl(App);
