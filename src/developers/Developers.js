import React from 'react';
import { Link } from 'react-router';

export default
  () => <div className="my-3">
    <h1 className="mb-3">Developers</h1>
    <div className="row pvl thin text-lg-left">
      <div className="pvl">
        <h3>Setup your app</h3>
        <p>Building an app for Steem blockchain? Click below to get ready.</p>
        <Link to="/apps/setup" className="btn btn-primary">Setup your app</Link>
      </div>
      {/* <div className="pvl">
        <h3>Tutorials</h3>
        <p>Get started using Steem Connect. Implement Steem authentication
        for any kind of application in minutes.</p>
        <Link to="/developers/tutorials/simple-app" className="btn btn-primary">
          Read the tutorials
        </Link>
      </div> */}
      <div className="pvl">
        <h3>Download Steem Connect JavaScript SDK</h3>
        <p>Use our SDK on your app to manage login and broadcast on Steem blockchain.</p>
        <a href="https://raw.githubusercontent.com/adcpm/steemconnect/dev/dist/steemconnect.min.js" className="btn btn-primary">Download</a>
      </div>
    </div>
  </div>;
