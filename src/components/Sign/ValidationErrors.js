import React, { PropTypes } from 'react';
import Icon from '../../widgets/Icon';

const SignValidationErrors = ({ errors }) =>
  <div>
    <h2><Icon name="close" className="text-danger" lg /> Error</h2>
    <h5 className="mb-4">Validation errors in your request!</h5>
    <table className="table text-center">
      <tbody>
        {errors.map((error, idx) =>
          <tr key={idx}>
            <td>{error.error}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>;

SignValidationErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default SignValidationErrors;
