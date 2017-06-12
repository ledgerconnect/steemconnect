import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import Layout from './app';
import Index from './components/Index';
import Dashboard from './components/Dashboard';
import App from './components/Apps/App';
import Apps from './components/Apps/Apps';
import MyApps from './components/Apps/MyApps';
import AuthorizedApps from './components/Apps/AuthorizedApps';
import EditApp from './components/Apps/EditApp';
import Steemjs from './components/Docs/Steemjs';
import OAuth2 from './components/Docs/OAuth2';
import Sign from './components/Sign';
import RecoverAccount from './components/Accounts/RecoverAccount';
import RequestAccountRecovery from './components/Accounts/RequestAccountRecovery';
import CreateAccount from './components/Accounts/CreateAccount';
import Login from './components/Auth/Login';
import Authorize from './components/Auth/Authorize';
import RequireLogin from './components/Auth/RequireLogin';
import Permissions from './components/Accounts/Permissions';
import SignAuthorize from './components/Accounts/Authorize';
import Revoke from './components/Accounts/Revoke';
import Error404 from './components/Error404';

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Index} />
    <Route component={RequireLogin}>
      <Route component={Layout}>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/apps/me" component={MyApps} />
        <Route path="/apps/authorized" component={AuthorizedApps} />
        <Route path="/apps/@:clientId/edit" component={EditApp} />
      </Route>
    </Route>
    <Route component={Layout}>
      <Route path="/apps" component={Apps} />
      <Route path="/docs/oauth2" component={OAuth2} />
      <Route path="/@:username/permissions" component={Permissions} />
      <Route path="/apps/@:clientId" component={App} />
    </Route>
    <Route path="/docs/steemjs" component={Steemjs} />
    <Route path="/accounts/create" component={CreateAccount} />
    <Route path="/accounts/recover" component={RecoverAccount} />
    <Route path="/accounts/request-recovery" component={RequestAccountRecovery} />
    <Route path="/login" component={Login} />
    <Route path="/oauth2/authorize" component={Authorize} />
    <Route path="/sign/:type" component={Sign} />
    <Route path="/authorize/@:username" component={SignAuthorize} />
    <Route path="/authorize/@:username/:role" component={SignAuthorize} />
    <Route path="/revoke/@:username" component={Revoke} />
    <Route path="/*" component={Error404} />
  </Route>
);
