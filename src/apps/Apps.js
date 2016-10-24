import React, { Component } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import apps from './../helpers/apps.json';

class Apps extends Component {
  constructor() {
    super();
    this.setFilter = this.setFilter.bind(this);
    this.state = { appFilterValue: null };
  }

  setFilter(e) {
    this.setState({ appFilterValue: e.target.value});
  }

  render() {
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
              {apps && _.map(apps, (app, key) => {
                const filterValue = this.state.appFilterValue;
                // case insentitive filter is more user friendly
                const showFilteredApp = filterValue && _.includes(`${app.name} ${app.tagline}`.toLowerCase(), filterValue.toLowerCase());
                if (showFilteredApp || !filterValue) {
                  return (<li key={app.name} className="list-element pam">
                    <img src={`https://img.busy6.com/@${key}`} className="list-image mrs" />
                    <b className="list-title">{app.name}</b>
                    <span className="list-description pls">{app.tagline}</span>
                    <Link to={`/apps/@${key}`} className="list-link"><i className="icon icon-md material-icons list-icon">keyboard_arrow_right</i></Link>
                  </li>);
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
