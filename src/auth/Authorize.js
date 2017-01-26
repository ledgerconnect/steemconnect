import _ from 'lodash';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';

import { getAppDetails } from './authAction';
import AccountCard from '../auth/AccountCard';
import Loading from '../widgets/Loading';
import Modal from '../widgets/Modal';

class Authorize extends React.Component {
  constructor(props) {
    super(props);
    this.permissions = {};
    this.state = { error: {}, isRedirecting: false };
  }

  componentWillMount() {
    const appName = this.props.params.app;
    this.props.getAppDetails(appName, this.props.location.query.redirect_url)
      .then((({ redirect_url, acceptedPermission = [], permissions = [] } = {}) => {
        const permissionsValues = _.chain(permissions).map(v1 => v1.api).filter().value();
        if (_.isEqual(permissionsValues, acceptedPermission) && redirect_url) {
          this.setState({ isRedirecting: true }, () => {
            window.location = redirect_url;
          });
        }
      }));
  }

  authorizeUser = (event, redirect_url, appName) => {
    event.preventDefault();
    const permissions = _.chain(this.permissions).map((v1, k1) =>
      v1.checked && k1).filter().value();
    window.location = `/auth/authorize?redirect_url=${redirect_url}&appUserName=${appName}&permissions=${permissions}`;
  }

  render() {
    const appName = this.props.params.app;
    const { apps = {}, user = {} } = this.props.auth;
    const appDetails = apps[appName] || {};
    const { permissions: permissionList = [], redirect_url, error } = appDetails;
    const isLoading = _.isEmpty(appDetails) || this.state.isRedirecting;
    let errorOrLoading;
    if (isLoading) {
      errorOrLoading = <Loading />;
    } else if (error) {
      errorOrLoading = <div className="my-4">{error}</div>;
    }

    return (
      <Modal>
        {errorOrLoading}
        {(!errorOrLoading) && (
          <div className="dialog">
            <AccountCard username={appName} />
            <div>
              <div className="mx-2 my-2">
                <p>The app <b>@{appName}</b> is requesting permission to do the following: </p>
                <ul>
                  {permissionList.map(({ name, api }) => <div key={api}>
                    <input type="checkbox" className="form-check-input" ref={c => (this.permissions[api] = c)} defaultChecked="true" value={api} />
                    {name}
                  </div>)}
                </ul>
              </div>
              <form className="form" onSubmit={this.handleSubmit}>
                <fieldset className="form-group m-0">
                  <button onClick={event => this.authorizeUser(event, redirect_url, appName)} className="btn btn-success form-submit">Continue as @{user.name}</button>
                </fieldset>
              </form>
            </div>
          </div>)}
      </Modal>
    );
  }
}

Authorize.propTypes = {
  params: PropTypes.shape({ app: PropTypes.string.isRequired }),
  location: PropTypes.shape({ query: PropTypes.object.isRequired }),
  auth: PropTypes.shape({ user: PropTypes.object.isRequired, apps: PropTypes.object }),
  getAppDetails: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth });

const mapDispatchToProps = dispatch => ({
  getAppDetails: bindActionCreators(getAppDetails, dispatch),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Authorize);
