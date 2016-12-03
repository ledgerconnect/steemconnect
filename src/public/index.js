import React from 'react';
import { Link } from 'react-router';

export default () => <div className="splash">
  <div className="splash__header">
    <div className="container">
      <img src="/img/logo.svg" height="60" />
    </div>
  </div>
  <div className="splash__body my-3 py-3">
    <div className="container">
      <h1>Identity management for Steem</h1>
      <p>This simple identity layer built on top of the Steem
        blockchain accounts allows Apps to verify your identity
        based on the authentication performed by Steem Connect
        without storing your password.</p>
      <Link to="/login" className="btn btn-primary">Login</Link>
    </div>
  </div>
  <hr />
  <div className="container my-3">
    <div className="thin my-3">
      <h2 className="py-3">Lorem ipsum dolor sit amet</h2>
      <div className="my-3 text-md-left">
        <div className="row">
          <div className="col col-md-2">
            <i className="icon icon-xl material-icons">perm_identity</i>
          </div>
          <div className="col col-md-10">
            <h3>Zero-friction authentication and authorization</h3>
            <p>Access to authorized Website and applications with your
              Steem account credentials using mechanisms for robust
              signing and encryption without giving your password.</p>
          </div>
        </div>
      </div>
      <div className="my-3">
        <div className="my-3 text-md-left">
          <div className="row">
            <div className="col col-md-2">
              <i className="icon icon-xl material-icons">apps</i>
            </div>
            <div className="col col-md-10">
              <h3>Steem App Store</h3>
              <p>Access to authorized website and application with
                Steem Connect using your Steem credentials with confidence.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3">
        <div className="my-3 text-md-left">
          <div className="row">
            <div className="col col-md-2">
              <i className="icon icon-xl material-icons">code</i>
            </div>
            <div className="col col-md-10">
              <h3>Light Wallet, Activity & Profile Manager</h3>
              <p>Manage your wallet, check your activity on Steem
                and edit your global Profile data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr className="my-0" />
  <div className="container py-2">
    by <a href="https://busy.org/" target="_blank">@busy.org</a>{ ' ' }
    for <a href="https://steem.io/" target="_blank">Steem</a>
  </div>
</div>;
