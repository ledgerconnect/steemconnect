import React from 'react';
import { browserHistory } from 'react-router';
import Loading from '../widgets/Loading';

const RequireLogin = (props) => {
  if (props.app.isLoaded && !props.app.user.name) {
    const to = next === '/dashboard' ? '/login' : `/login?next=${next}`;
    browserHistory.push(to);
  }
  return (props.app.isLoaded && props.app.user.name)
    ? React.cloneElement(props.children, {app: props.app})
    : <div className="Sign">
      <div className="Sign__content container my-2">
        {props.app.isLoading && <Loading/>}
      </div>
    </div>;
};

export default RequireLogin;
