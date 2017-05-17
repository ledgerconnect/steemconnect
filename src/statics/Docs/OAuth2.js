import React from 'react';
import { Link } from 'react-router';

const OAuth2 = ({ app }) => {
  const origin = window.location.origin;
  return (
    <div className="container my-5">
      <h3>OAuth2</h3>
      <h4>Implementing OAuth2</h4>
      <p>The URLs for OAuth2 are as follows:</p>
      <div className="list-group">
        <div className="list-group-item">
          {`${origin}/api/oauth2/authorize`}
          {` Base authorization URL`}
        </div>
      </div>
    </div>
  );
};

export default OAuth2;
