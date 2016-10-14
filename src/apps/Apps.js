import React, { Component } from 'react';
import _ from 'lodash';
import Header from './../app/header';
import apps from './../helpers/apps.json';

class Apps extends Component {
  constructor() {
    super();
    this._setFilter = this._setFilter.bind(this);
    this.state = {
      appFilterValue: null
    };
  }

  _setFilter(e) {
    this.setState({appFilterValue: e.target.value})
  }

  render() {
    return (
      <div>
        <Header />
        <section className="align-center profile-header">
          <div className="container">
            <h1>
              Apps
            </h1>
            <div className="input-group input-group-lg apps-search">
              <span className="input-group-addon"><i className="icon icon-md material-icons">search</i></span>
              <input autoFocus type="text" placeholder="Find a new app" className="form-control" onChange={this._setFilter} />
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
              {apps && _.map(apps, (app, key) => {
                const filterValue = this.state.appFilterValue;
                
                // case insentitive filter is more user friendly
                const showFilteredApp = filterValue && _.includes(`${app.name} ${app.tagline}`.toLowerCase(), filterValue.toLowerCase());
                if(showFilteredApp || !filterValue) {
                  return <li key={app.name} className="list-element pam">
                    <img src={`https://img.busy6.com/@${key}`} alt="asd" className="list-image mrs" />
                    <strong className="list-title">{app.name}</strong>
                    <span className="list-description pls">{app.tagline}</span>
                    <i className="icon icon-md material-icons pull-right list-icon">keyboard_arrow_right</i>
                  </li>
                }
              })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Apps;
