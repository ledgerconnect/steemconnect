import React from 'react';
import Icon from '../../widgets/Icon';

const SignValidationErrors = ({ errors }) =>
  <div>
    <h2><Icon name="close" className="text-danger" lg /> Error</h2>
    <h5 className="mb-4">Validation errors in your request!</h5>
    <ul>
      {errors.map((error, idx) =>
        <li key={idx}>
          {error}
        </li>
      )}
    </ul>
  </div>;

export default SignValidationErrors;
