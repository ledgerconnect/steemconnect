import React from 'react';
import { Link } from 'react-router';

const Dashboard = ({ app }) => {
  return (
    <div className="container my-5">
      <h4>My Account</h4>
      <p><Link to={`/@${app.user.name}/permissions`}>Permissions</Link></p>
      <p><Link to={`/apps`}>Apps</Link></p>
      <h4>Developers</h4>
      <p><Link to={`/apps/me`}>My Apps</Link></p>
    </div>
  );
};

export default Dashboard;
