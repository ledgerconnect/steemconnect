import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Summary extends Component {
  render() {
    return (
      <div className="ptxl">
        <h1 className="pbxl">Dashboard</h1>
        <div className="row pvl thin text-lg-left">
          <div className="pvl">
            <h3>Control your public identity</h3>
            <p>Curabitur tortor. Pellentesque nibh. Aenean quam.
              In scelerisque sem at dolor. Maecenas mattis.</p>
            <Link to="/profile" className="btn btn-primary mt-2">
              Update your profile
            </Link>
          </div>
          <div className="pvl">
            <h3>Build your apps on Steem blockchain</h3>
            <p>Integrate identity architecture early,
              saving critical time and ensuring security.</p>
            <Link to="/developers" className="btn btn-primary mt-2">
              Create your app
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
