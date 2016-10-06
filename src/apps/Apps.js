import React, { Component } from 'react';
import _ from 'lodash';
import Header from './../app/header';
import apps from './../helpers/apps.json';

class Apps extends Component {
  render() {
    return (
      <div>
        <Header />
        Apps Placeholder
        <div className="block block-dashboard">
          <ul className="list list-dashboard">
            {apps && _.map(apps, app =>
              <li className="list-element pam">
                <img src="#" alt="asd" className="list-image mrs" />
                <strong className="list-title">{app.name}</strong>
                <span className="list-description pls">{app.tagline}</span>
                <i className="icon icon-md material-icons pull-right">keyboard_arrow_right</i>
              </li>)}
          </ul>
        </div>
      </div>
    );
  }
}

export default Apps;
