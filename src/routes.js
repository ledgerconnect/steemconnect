import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import Layout from './app';
import Index from './components/Index';
import Dashboard from './components/Dashboard';
import App from './components/Apps/App';
// import Apps from './components/Apps/Apps';
import AuthorizedApps from './components/Apps/AuthorizedApps';
import Steemjs from './components/Docs/Steemjs';
import Sign from './components/Sign';
import Generate from './components/GenerateLink';
// import RecoverAccount from './components/Accounts/RecoverAccount';
// import RequestAccountRecovery from './components/Accounts/RequestAccountRecovery';
import CreateAccount from './components/Accounts/CreateAccount';
import Login from './components/Auth/Login';
import Authorize from './components/Auth/Authorize';
import RequireLogin from './components/Auth/RequireLogin';
import Permissions from './components/Accounts/Permissions';
// import SignAuthorize from './components/Accounts/Authorize';
// import Revoke from './components/Accounts/Revoke';
// import Error404 from './components/Error404';

const redirectToNewVersion = () => {
  window.location = (window.location.href)
    .replace('http://localhost:3000', 'https://beta.steemconnect.com')
    .replace('https://app.steemconnect.com', 'https://beta.steemconnect.com')
    .replace('https://steemconnect.com', 'https://beta.steemconnect.com');
};

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Index} />
    <Route component={RequireLogin}>
      <Route component={Layout}>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/apps/authorized" component={AuthorizedApps} />
      </Route>
    </Route>
    <Route component={Layout}>
      <Route path="/apps" component={redirectToNewVersion} />
      <Route path="/@:username/permissions" component={Permissions} />
      <Route path="/apps/@:clientId" component={App} />
    </Route>
    <Route path="/docs/steemjs" component={Steemjs} />
    <Route path="/accounts/create" component={CreateAccount} />
    <Route path="/accounts/recover" component={redirectToNewVersion} />
    <Route path="/accounts/request-recovery" component={redirectToNewVersion} />
    <Route path="/login" component={Login} />
    <Route path="/oauth2/authorize" component={Authorize} />
    <Route path="/sign" component={Generate} />
    <Route path="/sign/profile-update" component={Sign} />
    <Route path="/sign/:type(/:base64)" component={redirectToNewVersion} />
    <Route path="/authorize/@:username" component={redirectToNewVersion} />
    <Route path="/authorize/@:username/:role" component={redirectToNewVersion} />
    <Route path="/revoke/@:username" component={redirectToNewVersion} />
    <Route path="/*" component={redirectToNewVersion} />
  </Route>
);
