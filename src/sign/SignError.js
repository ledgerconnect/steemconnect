import React from 'react';

const SignError = ({ error, resetForm }) =>
  <div>
    <h4 className="text-danger">Oops, something goes wrong!</h4>
    {error.code && error.data &&
      <h5><strong>Error code: {error.code}</strong> {error.data.message}</h5>
    }
    <p>Do you want to <a href="#" onClick={() => resetForm()}>try again</a>?</p>
  </div>;

export default SignError;
