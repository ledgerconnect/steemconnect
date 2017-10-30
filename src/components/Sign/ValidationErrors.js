import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

const SignValidationErrors = ({ errors }) =>
  <div className="Sign__result-container">
    <div className="Sign__result-title-bg">
      <object data="/img/sign/fail.svg" type="image/svg+xml" id="error-icon" />
    </div>
    <h2><FormattedMessage id="error" /></h2>
    <h5><FormattedMessage id="error_request_validation" /></h5>
    <table className="table text-center">
      <tbody>
        {errors.map((error, idx) =>
          <tr key={idx}>
            <td><FormattedMessage id={error.error} values={error.values} /></td>
          </tr>
        )}
      </tbody>
    </table>
  </div>;

SignValidationErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default SignValidationErrors;
