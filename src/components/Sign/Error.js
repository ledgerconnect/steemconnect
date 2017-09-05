import React, { PropTypes } from 'react';
import { getErrorMessage } from '../../../helpers/operation';

const SignError = ({ error, resetForm }) =>
  <div>
    <div className="Sign__error-title-bg">
      <object data="/img/signin/fail.svg" type="image/svg+xml" id="error-icon" />
    </div>
    <h2>Error</h2>
    <h5>Oops, something went wrong!</h5>
    <p><b>{ getErrorMessage(error) }</b></p>
    <button className="signin-button" onClick={() => resetForm()}>try again</button>
  </div>;

SignError.propTypes = {
  resetForm: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object,
};

export default SignError;
