import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './AppPreview.less';

const AppPreview = ({ app }) => (
  <div className="list-group-item">
    <b>
      <Link to={`/apps/@${app.client_id}`}>
        {app.client_id}
      </Link>
    </b>
  </div>
);

AppPreview.propTypes = {
  app: PropTypes.shape(),
};

export default AppPreview;
