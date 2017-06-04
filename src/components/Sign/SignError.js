import React from 'react';
import Icon from '../../widgets/Icon';

const SignError = ({ error, resetForm }) =>
  <div>
    <h2><Icon name="close" className="text-danger" lg /> Error</h2>
    <h5>Oops, something goes wrong!</h5>
    {error.code && error.data &&
      <p><b>Error code: {error.code}</b> {error.data.message}</p>
    }
    <p>Do you want to <a href="#" onClick={() => resetForm()}>try again</a>?</p>
  </div>;

export default SignError;
