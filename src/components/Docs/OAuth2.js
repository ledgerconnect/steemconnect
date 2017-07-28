import React from 'react';
import { Link } from 'react-router';

const OAuth2 = () => {
  const origin = window.location.origin;
  return (
    <div className="container my-5">
      <h3>OAuth2</h3>
      <h4>Implementing OAuth2</h4>
      <p>
        The first step in implementing OAuth2 is <Link to="/apps/create">registering a developer application</Link>
        , and retrieving your client ID and client secret. The URLs for OAuth2 are as follows:
      </p>
      <div className="list-group">
        <div className="list-group-item">
          <a className="mr-2" href={`${origin}/api/oauth2/authorize`}>
            {`${origin}/api/oauth2/authorize`}
          </a>
          <b>Base authorization URL</b>
        </div>
        <div className="list-group-item">
          <a className="mr-2" href={`${origin}/api/oauth2/token`}>
            {`${origin}/api/oauth2/token`}
          </a>
          <b>Token URL</b>
        </div>
        <div className="list-group-item">
          <a className="mr-2" href={`${origin}/api/oauth2/token/revoke`}>
            {`${origin}/api/oauth2/token/revoke`}
          </a>
          <b>Revocation URL</b>
        </div>
      </div>
    </div>
  );
};

export default OAuth2;
