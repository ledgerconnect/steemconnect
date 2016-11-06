import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import { getAppList } from './actions';

class Apps extends Component {

  componentWillMount() {
    this.props.getAppList();
    this.getAppList = _.debounce(this.props.getAppList, 250);
  }

  setFilter = (e) => {
    this.getAppList(e.target.value);
  }

  render() {
    const { appList } = this.props.apps;
    return (
      <div>
        <section className="align-center profile-header">
          <div className="container">
            <h1>Apps</h1>
            <div className="input-group input-group-lg">
              <span className="input-group-addon"><i className="icon icon-md material-icons">search</i></span>
              <input autoFocus type="text" placeholder="Find a new app" className="form-control" onChange={this.setFilter} />
            </div>
          </div>
        </section>
        <ul className="secondary-nav mbl">
          <li>
            <a href="#">
              <i className="icon icon-md material-icons">star</i>
              <span className="hidden-xs"> Featured</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="icon icon-md material-icons">search</i>
              <span className="hidden-xs"> Browse</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="icon icon-md material-icons">check</i>
              <span className="hidden-xs"> My Apps</span>
            </a>
          </li>
        </ul>
        <div className="container">
          <div className="block block-apps">
            <ul className="list list-apps">
              {_.map(appList, app => (<li key={app.id} className="list-element pam">
                <img src={`https://img.busy.org/@${app.app}`} alt={app.app} className="list-image mrs" />
                <b className="list-title">{app.name}</b>
                <span className="list-description pls">{app.tagline}</span>
                <Link to={`/apps/@${app.app}`} className="list-link"><i className="icon icon-md material-icons list-icon">keyboard_arrow_right</i></Link>
              </li>))
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Apps.propTypes = {
  apps: PropTypes.shape({ appList: PropTypes.array }),
  getAppList: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth, apps: state.apps });
const mapDispatchToProps = dispatch => bindActionCreators({ getAppList }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Apps);
