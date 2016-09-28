import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const Authorize = (props) => {
  const appName = props.params.app;
  const { clientId, redirect_url, scope } = props.location.query;
  let message;
  if (!clientId || !redirect_url) {
    message = <div>Missing ClientId or redirect_url</div>;
  }
  return (
    <div className="block">
      <div className="mbl"><img alt="app-logo" src={`https://img.busy6.com/@${appName}`} width="70" /></div>
      {message ||
        <div>
          <p>The app <b>{appName}</b> is requesting permission to do the following: </p>
          <ul className="mbm">
            <li><i className="icon icon-sm material-icons">check_box</i> Verify your identity</li>
          </ul>
          <a href={`/auth/authorize?clientId=${clientId}&redirect_url=${redirect_url}&appUserName=${appName}&scope=${scope}`} className="btn btn-primary mbm">Continue as @{props.auth.user.name}</a>
        </div>
      }
    </div>
  );
};

Authorize.propTypes = {
  params: PropTypes.shape({ app: PropTypes.string.isRequired }),
  location: PropTypes.shape({ query: PropTypes.object.isRequired }),
  auth: PropTypes.shape({ user: PropTypes.object.isRequired }),
};

const mapStateToProps = state => ({ auth: state.auth });

module.exports = connect(mapStateToProps)(Authorize);
