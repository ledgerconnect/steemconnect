import React from 'react';
import { Link } from 'react-router';

export default
  () => <div className="my-3">
    <h1 className="mb-3">Developers</h1>
    <div className="row py-4 thin text-lg-left">
      <div className="py-4">
        <h3>Setup your app</h3>
        <p>Building an app for Steem blockchain? Click below to get ready.</p>
        <Link to="/apps/setup" className="btn btn-primary">Setup your app</Link>
      </div>
      <div className="py-4">
        <h3>Download Steem Connect JavaScript SDK</h3>
        <p>Use our SDK on your app to manage login and broadcast on Steem blockchain.</p>
        <a href="https://raw.githubusercontent.com/adcpm/steemconnect/dev/dist/steemconnect.min.js" className="btn btn-primary">Download</a>
      </div>
    </div>
  </div>;
