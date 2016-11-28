import React from 'react';
import { Link } from 'react-router';

export default () => <div className="splash">
  <div className="splash__header">
    <div className="container">
      <img src="/img/logo.svg" height="60" />
    </div>
  </div>
  <div className="splash__body my-3">
    <div className="container-fluid">
      <h1>Build apps on Steem blockchain</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Nulla sed porta metus, eu efficitur sapien.</p>
      <Link to="/login" className="btn btn-primary">Login</Link>
    </div>
  </div>
  <hr />
  <div className="container">
    <div className="my-3">
      <i className="icon icon-xl material-icons">perm_identity</i>
    </div>
    <div className="my-3">
      <i className="icon icon-xl material-icons">apps</i>
    </div>
    <div className="my-3">
      <i className="icon icon-xl material-icons">code</i>
    </div>
  </div>
</div>;
