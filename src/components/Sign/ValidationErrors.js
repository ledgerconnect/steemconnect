import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

const SignValidationErrors = ({ errors }) =>
  <div>
    <h2><Icon name="close" className="text-danger" lg /> <FormattedMessage id="error" /></h2>
    <h5 className="mb-4"><FormattedMessage id="error_request_validation" /></h5>
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
