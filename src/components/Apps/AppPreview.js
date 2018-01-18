import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import './AppPreview.less';

const AppPreview = ({ app }) => (
  <li className="steemconnect-app">
    <Link to={`/apps/@${app.client_id}`}>
      <img src={`https://steemitimages.com/60x60/${app.icon}`} alt="icon" />
      <div>
        <span className="app-title">{app.client_id}</span>
        <span className="app-desc">{app.description}</span>
        {!app.installed &&
        <Link className="install-btn" to={`/oauth2/authorize?client_id=${app.client_id}&scope=`}>
          <FormattedMessage id="install" />
        </Link>}
      </div>
    </Link>
  </li>
);

AppPreview.propTypes = {
  app: PropTypes.shape(),
};

export default AppPreview;
