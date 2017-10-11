import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

const OAuth2 = () => {
  const origin = window.location.origin;
  return (
    <div className="container my-5">
      <h3><FormattedMessage id="oauth2" /></h3>
      <h4><FormattedMessage id="implementing_oauth2" /></h4>
      <p>
        <FormattedMessage id="implementing_oauth2_text" values={{ link: <Link to="/apps/create"><FormattedMessage id="registering_app" /></Link> }} />
      </p>
      <div className="list-group">
        <div className="list-group-item">
          <a className="mr-2" href={`${origin}/api/oauth2/authorize`}>
            {`${origin}/api/oauth2/authorize`}
          </a>
          <b><FormattedMessage id="base_auth_url" /></b>
        </div>
        <div className="list-group-item">
          <a className="mr-2" href={`${origin}/api/oauth2/token`}>
            {`${origin}/api/oauth2/token`}
          </a>
          <b><FormattedMessage id="token_url" /></b>
        </div>
        <div className="list-group-item">
          <a className="mr-2" href={`${origin}/api/oauth2/token/revoke`}>
            {`${origin}/api/oauth2/token/revoke`}
          </a>
          <b><FormattedMessage id="revocation_url" /></b>
        </div>
      </div>
    </div>
  );
};

export default OAuth2;
