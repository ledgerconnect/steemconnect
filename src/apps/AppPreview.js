import React from 'react';
import { Link } from 'react-router';
import './AppPreview.scss';

const AppPreview = ({ app }) => {
  return (
    <div className="list-group-item">
      <b>
        <Link to={`/apps/@${app.client_id}`}>
          {app.client_id}
        </Link>
      </b>
    </div>
  );
};

export default AppPreview;
