import React, { PropTypes } from 'react';
import { getErrorMessage } from '../../../helpers/operation';
import Icon from '../../widgets/Icon';

const SignError = ({ error, resetForm }) =>
  <div>
    <h2><Icon name="close" className="text-danger" lg /> Error</h2>
    <h5 className="mb-4">Oops, something goes wrong!</h5>
    <p><b>{ getErrorMessage(error) }</b></p>
    <p>Do you want to <button className="button-link" onClick={() => resetForm()}>try again</button>?</p>
  </div>;

SignError.propTypes = {
  resetForm: PropTypes.func,
  error: PropTypes.shape(),
};

export default SignError;
