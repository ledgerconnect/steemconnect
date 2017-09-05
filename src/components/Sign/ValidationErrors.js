import React, { PropTypes } from 'react';

const SignValidationErrors = ({ errors }) =>
  <div>
    <div className="Sign__error-title-bg">
      <object data="/img/signin/fail.svg" type="image/svg+xml" id="error-icon" />
    </div>
    <h2>Error</h2>
    <h5>Validation errors in your request!</h5>
    <table className="table text-center">
      <tbody>
        {errors.map((error, idx) =>
          <tr key={idx}>
            <td>{error}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>;

SignValidationErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default SignValidationErrors;
