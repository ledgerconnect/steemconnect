import React from 'react';
import { getErrorMessage } from '../../utils/operation';
import Icon from '../../widgets/Icon';

const SignError = ({ error, resetForm }) =>
  <div>
    <h2><Icon name="close" className="text-danger" lg /> Error</h2>
    <h5 className="mb-4">Oops, something goes wrong!</h5>
    <p><b>{ getErrorMessage(error) }</b></p>
    <p>Do you want to <a href="#" onClick={() => resetForm()}>try again</a>?</p>
  </div>;

export default SignError;
