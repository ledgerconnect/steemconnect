import React from 'react';
import { Link } from 'react-router';

export default () => <div className="my-3">
  <h1 className="mb-3">Welcome SteemConnect</h1>
  <div className="row pvl thin text-lg-left">
    <div className="pvl">
      <Link to="/login" className="btn btn-primary">Login</Link>
    </div>
    <div className="pvl">
      <Link to="/register" className="btn btn-primary">Register</Link>
    </div>
  </div>
</div>;
