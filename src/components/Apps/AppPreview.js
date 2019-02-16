import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './AppPreview.less';

const AppPreview = ({ username }) => (
  <div className="list-group-item">
    <b>
      <Link to={`/apps/@${username}`}>
        {username}
      </Link>
    </b>
  </div>
);

AppPreview.propTypes = {
  username: PropTypes.string,
};

export default AppPreview;
