import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Modal, notification } from 'antd';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import Avatar from '../../widgets/Avatar';
import Loading from '../../widgets/Loading';

import './AuthorizedApps.less';

class AuthorizedApps extends Component {
  static propTypes = {
    auth: PropTypes.shape(),
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: true,
      isLoaded: false,
      displayRevokeModal: false,
      clientId: null,
      apps: [],
    };
  }

  async componentWillMount() {
    const result = await fetch('/api/apps/authorized', {
      headers: new Headers({
        Authorization: this.props.auth.token,
      }),
    })
    .then(res => res.json());

    this.setState({ apps: result.apps, isLoading: false });
  }

  showRevokeModal = (clientId) => {
    this.setState({
      displayRevokeModal: true,
      clientId,
    });
  }

  handleCancel = () => {
    this.setState({
      displayRevokeModal: false,
    });
  }

  confirm = () => {
    const { intl } = this.props;
    const { clientId } = this.state;
    fetch(clientId ? `/api/token/revoke/user/${clientId}` : '/api/token/revoke/user', {
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

  render() {
    const { isLoading, displayRevokeModal } = this.state;
    const { auth: { user }, intl } = this.props;
    return (
      <div className="container py-5">
        {isLoading && <Loading />}
        {user.posting &&
          <div>
            <ul className="authorized-apps-list">
              {user.posting.account_auths.map((auth, idx) =>
                <li key={idx} className="authorized-apps-list-item">
                  <div className="app-item-name">
                    <Link to={`/apps/@${auth[0]}`} className="AppAvatar"><Avatar username={auth[0]} size="60" /></Link>
                    <Link to={`/apps/@${auth[0]}`}>{auth[0]}</Link>
                  </div>
                  <div className="app-item-action">
                    <button
                      className="float-right btn btn-revoke btn-sm ml-1"
                      onClick={() => { this.showRevokeModal(auth[0]); }}
                    >
                      <FormattedMessage id="revoke" />
                    </button>
                  </div>
                </li>
              )}
            </ul>
            <br />
            {user.posting.account_auths.length > 0 &&
            <div className="block py-4">
              <h2><FormattedMessage id="revoke_all_oauth_token" /></h2>
              <p>
                <FormattedMessage id="revoke_all_oauth_token_text" />
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
      </div>
    );
  }
}

export default injectIntl(AuthorizedApps);
