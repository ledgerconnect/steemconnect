import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Loading from '../../widgets/Loading';

const RequireLogin = ({ auth, location, children }) => {
  if (auth.isLoaded && !auth.user.name) {
    const next = location.pathname;
    const to = next === '/dashboard' ? '/login' : `/login?next=${next}`;
    browserHistory.push(to);
  }
  return (auth.isLoaded && auth.user.name)
    ? React.cloneElement(children, { auth })
    : <div className="Sign">
      <div className="Sign__content container my-2">
        {auth.isLoading && <Loading />}
      </div>
    </div>;
};

RequireLogin.propTypes = {
  location: PropTypes.shape(),
  auth: PropTypes.shape(),
  children: PropTypes.shape(),
};

export default RequireLogin;
