import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { getErrorMessage } from '../../../helpers/operation';

const SignError = ({ error, resetForm }) =>
  <div className="Sign__result-container">
    <div className="Sign__result-title-bg">
      <object data="/img/sign/fail.svg" type="image/svg+xml" id="error-icon" />
    </div>
    <h2><FormattedMessage id="error" /></h2>
    <h5><FormattedMessage id="general_error_short" /></h5>
    <p><b>{ getErrorMessage(error) }</b></p>
    <button className="Sign__button" onClick={() => resetForm()}><FormattedMessage id="try_again" /></button>
  </div>;

SignError.propTypes = {
  resetForm: PropTypes.func,
  error: PropTypes.shape(),
};

export default SignError;
