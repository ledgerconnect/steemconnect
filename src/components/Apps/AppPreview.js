import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './AppPreview.less';

const AppPreview = ({ app }) => (
  <li className="steemconnect-app">
    <Link to={`/apps/@${app.client_id}`}>
      <img src="https://res.cloudinary.com/hpiynhbhq/image/upload/v1506948447/p72avlprkfariyti7q2l.png" alt="icon" />
      <div>
        <span className="app-title">{app.client_id}</span>
        <span className="app-desc">{app.description}</span>
      </div>
    </Link>
  </li>
);

AppPreview.propTypes = {
  app: PropTypes.shape(),
};

export default AppPreview;
