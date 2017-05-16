import React from 'react';
import { Link } from 'react-router';

const Dashboard = ({ app }) => {
  return (
    <div className="container my-5">
      <h4>Applications</h4>
      <p><Link to="/apps">Apps</Link></p>
      <p><Link to="/apps/authorized">Authorized Apps</Link></p>
      <h4>Developers</h4>
      <p><Link to="/apps/me">My Apps</Link></p>
      <p><Link to="/docs/oauth2">OAuth2</Link></p>
    </div>
  );
};

export default Dashboard;
