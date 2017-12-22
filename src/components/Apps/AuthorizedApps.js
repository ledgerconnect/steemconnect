import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Modal, notification } from 'antd';
import { Link } from 'react-router';
import numeral from 'numeral';
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
      isLoading: false,
      isLoaded: false,
      displayRevokeModal: false,
    };
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
    const { isLoading, displayRevokeModal } = this.state;
    const { auth: { user }, intl } = this.props;
    return (
      <div className="container py-5">
        <h2><FormattedMessage id="authorized_apps" /></h2>
        {isLoading && <Loading />}
        {user.posting &&
          <div>
            <p><FormattedMessage id="authorized_apps_list" /></p>
            <ul className="list-group text-xs-left mb-3">
              {user.posting.account_auths.map((auth, idx) =>
                <li key={idx} className="list-group-item">
                  <b><Link to={`/apps/@${auth[0]}`}>{auth[0]}</Link></b>
                  <span className="ml-1">
                    {numeral((100 / user.posting.weight_threshold) * (auth[1] / 100)).format('0%')}
                  </span>
                  <Link
                    to={`/revoke/@${auth[0]}`}
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
