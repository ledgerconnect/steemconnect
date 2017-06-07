import React from 'react';
import { Link } from 'react-router';
import Icon from '../widgets/Icon';

const Error404 = () => {
  return (
    <div className="Sign">
      <div className="Sign__content container my-2">
        <h2><Icon name="error_outline" lg /> Oops!</h2>
        <p>
          Looks like you followed a bad link. If you think this is a problem with SteemConnect,
          please tell us. Here's a link to the <Link to="/">home page</Link>.
        </p>
      </div>
    </div>
  );
};

export default Error404;
