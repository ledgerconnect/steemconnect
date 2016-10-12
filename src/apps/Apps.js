import React, { Component } from 'react';
import _ from 'lodash';
import Header from './../app/header';
import apps from './../helpers/apps.json';

class Apps extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="header header-activity" style={{ background: `url(https://img.busy6.com/@${this.props.username}/cover) center/cover` }}>
          <div className="container pvl">
            <h2>Apps</h2>
            <fieldset className="form-group man mhs plxs form-apps-searcher">
              <input autoFocus type="text" placeholder="Find a new app" className="paxs" />
            </fieldset>
          </div>
        </div>
        <nav className="header-nav mbl">
          <ul className="header-ul">
            <li className="header-li">
              <a className="header-a paxs" href="#">
                <i className="icon icon-sm material-icons">star</i>
                Featured
              </a>
            </li>
            <li className="header-li">
              <a className="header-a paxs" href="#">
                <i className="icon icon-sm material-icons">search</i>
                Browse
              </a>
            </li>
            <li className="header-li">
              <a className="header-a paxs" href="#">
                <i className="icon icon-sm material-icons">check</i>
                My Apps
              </a>
            </li>
          </ul>
        </nav>
        <div className="container">
          <div className="block block-apps">
            <ul className="list list-apps">
              {apps && _.map(apps, (app, key) =>
                <li key={app.name} className="list-element pam">
                  <img src={`https://img.busy6.com/@${key}`} alt="asd" className="list-image mrs" />
                  <strong className="list-title">{app.name}</strong>
                  <span className="list-description pls">{app.tagline}</span>
                  <i className="icon icon-md material-icons pull-right list-icon">keyboard_arrow_right</i>
                </li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Apps;
