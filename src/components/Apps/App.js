import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Modal, notification } from 'antd';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import { hasAuthority } from '../../utils/auth';
import { getApp, isSelfManaged } from '../../utils/app';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/SteemitAvatar';

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
      appAccount: {},
      error: false,
      isLoading: false,
      isLoaded: false,
      revealSecret: false,
      clientId: this.props.params.clientId,
      app: [],
      displayRevokeModal: false,
    };
  }

  componentWillMount() {
    const { clientId } = this.state;
    this.setState({ isLoading: true });

    getApp(clientId).then((appAccount) => {
      this.setState({
        app: appAccount.profile,
        appAccount,
        isLoading: false,
        isLoaded: true,
      });
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
    });
  }

  showRevokeModal = () => {
    this.setState({
      displayRevokeModal: true,
    });
  }

  handleCancel = () => {
    this.setState({
      displayRevokeModal: false,
    });
  }

  confirm = () => {
    const { intl } = this.props;

    fetch(`https://api.steemconnect.com/api/token/revoke/user/${this.state.clientId}`, {
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
  };

  render() {
    const {
      app, clientId, isLoading, isLoaded,
      displayRevokeModal,
      appAccount,
    } = this.state;
    const { intl } = this.props;
    const editionIsEnabled = true;
    return (
      <div className="container my-5">
        {isLoaded &&
          <div>
            <Avatar username={clientId} size="80" className="float-left mr-3" />
            <h2 className="d-inline">{clientId}</h2>
            <span className="float-right">
              {editionIsEnabled && isLoaded && app.creator === this.props.auth.user.name &&
                <a
                  href="https://beta.steemconnect.com/developers"
                  target="_blank"
                  className="btn btn-secondary btn-sm ml-2"
                >
                  <FormattedMessage id="edit" />
                </a>
              }
              {this.props.auth.isAuthenticated && hasAuthority(this.props.auth.user, clientId) &&
                <Link to={`/revoke/@${clientId}`} className="btn btn-danger btn-sm ml-2">
                  <FormattedMessage id="revoke" />
                </Link>
              }
            </span>
            <p>@{clientId}</p>
            <div className="pt-4">
              <p>
                {isSelfManaged(appAccount.owner)
                  ? ' This app is self managed.'
                  : ' This app is managed by SteemConnect.'
                }
              </p>
              <div className="list-group">
                <div className="list-group-item">
                  <b className="mr-1"><FormattedMessage id="client_id" />:</b> {clientId}
                </div>
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
