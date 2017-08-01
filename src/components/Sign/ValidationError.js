import React from 'react';
import Icon from '../../widgets/Icon';

const SignValidationError = ({ errors }) =>
  <div>
    <h2><Icon name="close" className="text-danger" lg /> Error</h2>
    <h5 className="mb-4">Validation errors in your request!</h5>
    <ul>
      {errors.map(error =>
        <li>
          {error}
        </li>
      )}
    </ul>
  </div>;

export default SignValidationError;
