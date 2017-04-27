import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Summary extends Component {
  render() {
    return (
      <div className="my-5">
        <h1 className="mb-3">Dashboard</h1>
        <div className="row py-4 thin text-left">
          <div className="py-4">
            <h3>Control your public identity</h3>
            <p>Update your public profile on Steem blockchain.</p>
            <Link to="/profile" className="btn btn-primary mt-2">
              Update your profile
            </Link>
          </div>
          <div className="py-4">
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
