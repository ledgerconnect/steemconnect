import React from 'react';
import { Link } from 'react-router';

const Dashboard = ({ app }) => {
  return (
    <div className="container my-5">
      <h2>Dashboard</h2>
      <h4>
        <Link to={`/@${app.username}/permissions`}>
          Permissions
        </Link>
      </h4>
    </div>
  );
};

export default Dashboard;
