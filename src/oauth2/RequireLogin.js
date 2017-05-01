import React from 'react';
import Loading from '../widgets/Loading';

const RequireLogin = (props) =>
  (props.app.isLoaded && props.app.user.name)
    ? React.cloneElement(props.children, { app: props.app })
    : <div className="Sign">
        <div className="Sign__content container my-2">
          {props.app.isLoading
            ? <Loading/>
            : <p>You must log in to do that</p>
          }
        </div>
    </div>;

export default RequireLogin;
