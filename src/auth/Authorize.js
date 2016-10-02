import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { getAppPermission } from './authAction';

class Authorize extends React.Component {
  constructor(props) {
    super(props);
    this.permissions = {};
  }

  componentWillMount() {
    const { clientId } = this.props.location.query;
    const appName = this.props.params.app;
    if (clientId) {
      this.props.getAppPermission(clientId, appName);
    }
  }

  authorizeUser = (clientId, redirect_url, appName) => {
    const scope = _.chain(this.permissions).map((v1, k1) => v1.checked && k1).filter().value();
    window.location = `/auth/authorize?clientId=${clientId}&redirect_url=${redirect_url}&appUserName=${appName}&scope=${JSON.stringify(scope)}`;
  }

  render() {
    const appName = this.props.params.app;
    const { appPermissions = {}, user = {} } = this.props.auth;
    const { clientId, redirect_url } = this.props.location.query;
    const permissionList = appPermissions[appName] || [];
    let message;
    if (!clientId || !redirect_url) {
      message = <div>Missing ClientId or redirect_url</div>;
    }
    return (
      <div className="block">
        <div className="mbl"><img alt="app-logo" src={`https://img.busy6.com/@${appName}`} width="70" /></div>
        {message ||
          <div>
            <p>The app <b>{appName}</b> is requesting permission to do the following: </p>
            <ul className="mbm">
              {permissionList.map(({ name, api }) => <div key={api}>
                <input type="checkbox" className="form-check-input" ref={c => (this.permissions[api] = c)} defaultChecked="true" value={api} />
                {name}
              </div>) }
            </ul>
            <a onClick={() => this.authorizeUser(clientId, redirect_url, appName)} className="btn btn-primary mbm">Continue as @{user.name}</a>
          </div>
        }
      </div>
    );
  }
}

Authorize.propTypes = {
  params: PropTypes.shape({ app: PropTypes.string.isRequired }),
  location: PropTypes.shape({ query: PropTypes.object.isRequired }),
  auth: PropTypes.shape({ user: PropTypes.object.isRequired, appPermissions: PropTypes.object }),
  getAppPermission: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth });

const mapDispatchToProps = dispatch => ({
  getAppPermission: bindActionCreators(getAppPermission, dispatch),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Authorize);
