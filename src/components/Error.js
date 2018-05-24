import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import './Error.less';

const Error = ({ error }) =>
  <div>
    <div className="Sign_frame Error_frame">
      <div className="Sign__header">
        <object data="/img/logo.svg" type="image/svg+xml" id="logo" />
      </div>
      <div className="Sign__wrapper">
        <div className="Sign__result-container">
          <div className="Sign__result-title-bg">
            <object data="/img/sign/fail.svg" type="image/svg+xml" id="error-icon" />
          </div>
          <h2><FormattedMessage id="error" /></h2>
          {error && <h5><FormattedMessage id={error} /></h5>}
        </div></div>
      <div className="Sign__footer">
        <Link to="/" target="_blank" rel="noopener noreferrer"><FormattedMessage id="about_steemconnect" /></Link>
      </div>
    </div>
  </div>
;
Error.propTypes = {
  error: PropTypes.string.isRequired,
};

export default Error;
