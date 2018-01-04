import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Modal, notification } from 'antd';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import Loading from '../../widgets/Loading';

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
    fetch('/api/token/revoke/user', {
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
    const { isLoading, apps, displayRevokeModal } = this.state;
    const { auth: { user }, intl } = this.props;
    return (
      <div className="container py-5">
        <h2><FormattedMessage id="authorized_apps" /></h2>
        {user.posting &&
          <div>
            <p><FormattedMessage id="authorized_apps_list" /></p>
            {isLoading && <div className="text-center"><Loading /></div>}
            <ul className="list-group text-xs-left mb-3">
              {apps.map((app, idx) =>
                <li key={idx} className="list-group-item">
                  <b><Link to={`/apps/@${app.client_id}`}>{app.client_id}</Link></b>
                  <Link
                    to={`/revoke/@${app.client_id}`}
                    className="float-right btn btn-secondary btn-sm ml-1"
                  >
                    <FormattedMessage id="revoke" />
                  </Link>
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
