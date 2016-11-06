import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getAppList } from './actions';

class AppDetails extends Component {
  componentWillMount() {
    const { apps: { appList = [] } = {}, params: { app } } = this.props;
    if (!_.find(appList, { app })) {
      this.props.getAppList(app);
    }
  }

  render() {
    const { apps: { appList = [] } = {}, params: { app } } = this.props;
    const currentApp = _.find(appList, { app }) || {};
    currentApp.origins = _.isArray(currentApp.origins) && currentApp.origins.length ? currentApp.origins : ['#'];
    return (
      <div>
        <div className="container">
          <div className="apps apps-details ptl">
            <div className="apps-photo">
              <img src={`https://img.busy.org/@${currentApp.app}`} height="175px" alt={currentApp.name} width="100%" className="mbm" />
              <a href={currentApp.origins[0]}><button className="btn btn-lg btn-success">Connect</button></a>
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
};

const mapStateToProps = state => ({ auth: state.auth, apps: state.apps });
const mapDispatchToProps = dispatch => bindActionCreators({ getAppList }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppDetails);
