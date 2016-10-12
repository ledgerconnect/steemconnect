import React, { Component } from 'react';
import _ from 'lodash';
import Header from './../app/header';
import apps from './../helpers/apps.json';

class AppDetails extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="header header-activity mbl">
          <div className="pam phxl-m phm">
            <h2>App Information Placeholder</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default AppDetails;
