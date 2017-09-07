import React, { PropTypes } from 'react';
import { getErrorMessage } from '../../../helpers/operation';

const SignError = ({ error, resetForm }) =>
  <div className="Sign__result-container">
    <div className="Sign__result-title-bg">
      <object data="/img/sign/fail.svg" type="image/svg+xml" id="error-icon" />
    </div>
    <h2>Error</h2>
    <h5>Oops, something went wrong!</h5>
    <p><b>{ getErrorMessage(error) }</b></p>
    <button className="Sign__button" onClick={() => resetForm()}>try again</button>
  </div>;

SignError.propTypes = {
  resetForm: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object,
};

export default SignError;
