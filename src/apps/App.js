import React, { Component } from 'react';

class AppDetails extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="apps apps-details ptl">
            <div className="apps-photo">
              <img src="#" height="175px" width="100%" className="mbm" />
              <button className="btn btn-lg btn-success">Connect</button>
            </div>
            <div className="apps-description pls">
              <h3>SteemStats</h3>
              <span>Steem Account Statistics + Monitoring</span>
              <p className="mts">SteemStats is an application created to help you monitor your account activity on steemit.com, a social media platform based on steem blockchain</p>
              <strong className="author">Author:
                <a href="#" alt="Author"> @jesta</a>
              </strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppDetails;
