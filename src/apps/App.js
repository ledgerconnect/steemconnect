import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getAppList, getMyAppList, disconnectApp } from './actions';

class AppDetails extends Component {
  componentWillMount() {
    const { apps: { appList = [], myAppList = [] } = {}, params: { app } } = this.props;
    if (!_.find(appList, { app })) { this.props.getAppList(app); }
    if (myAppList.length === 0) { this.props.getMyAppList(); }
  }

  disconnectApp = () => {
    const { params: { app } } = this.props;
    this.props.disconnectApp(app);
  }

  render() {
    const { apps: { appList = [], myAppList = [], isFetching } = {}, params: { app } } = this.props;
    const isMyApp = _.find(myAppList, { app });
    const currentApp = isMyApp || (_.find(appList, { app }) || {});

    currentApp.origins = _.isArray(currentApp.origins) && currentApp.origins.length ? currentApp.origins : ['#'];
    return (
      <div>
        <div className="container">
          <div className="apps apps-details ptl">
            <div className="apps-photo">
              <img src={`https://img.steemconnect.com/@${currentApp.app}`} height="175px" alt={currentApp.name} width="100%" className="mbm" />
              {!isMyApp && <a href={currentApp.origins[0]}><button className="btn btn-lg btn-success">Connect</button></a>}
              {isMyApp && <button className="btn btn-lg btn-danger" disabled={isFetching} onClick={this.disconnectApp}>Disconnect</button>}
            </div>
            <div className="apps-description pls">
              <h3>{currentApp.name}</h3>
              <span>{currentApp.tagline}</span>
              <p className="mts">{currentApp.description}</p>
              <strong className="author">Author:
                <a href="#" alt="Author"> @{currentApp.author}</a>
              </strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AppDetails.propTypes = {
  apps: PropTypes.shape({}),
  params: PropTypes.shape({}),
  getAppList: PropTypes.func,
  getMyAppList: PropTypes.func,
  disconnectApp: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth, apps: state.apps });
const mapDispatchToProps = dispatch => bindActionCreators({ getAppList, getMyAppList, disconnectApp }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppDetails);
