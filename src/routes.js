import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import Layout from './app';
import Index from './statics/Index';
import Dashboard from './statics/Dashboard';
import App from './apps/App';
import Apps from './apps/Apps';
import MyApps from './apps/MyApps';
import AuthorizedApps from './apps/AuthorizedApps';
import EditApp from './apps/EditApp';
import Steemjs from './statics/Docs/Steemjs';
import OAuth2 from './statics/Docs/OAuth2';
import Sign from './sign/Sign';
import RecoverAccount from './components/RecoverAccount';
import CreateAccount from './sign/CreateAccount';
import Login from './oauth2/Login';
import Authorize from './oauth2/Authorize';
import RequireLogin from './oauth2/RequireLogin';
import Permissions from './user/Permissions';
import SignAuthorize from './sign/Authorize';
import Revoke from './sign/Revoke';
import Error404 from './statics/Error404';

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
      <Route path="/docs/steemjs" component={Steemjs} />
      <Route path="/docs/oauth2" component={OAuth2} />
      <Route path="/@:username/permissions" component={Permissions} />
      <Route path="/apps/@:clientId" component={App} />
    </Route>
    <Route path="/accounts/create" component={CreateAccount} />
    <Route path="/accounts/recover" component={RecoverAccount} />
    <Route path="/login" component={Login} />
    <Route path="/oauth2/authorize" component={Authorize} />
    <Route path="/sign/:type" component={Sign} />
    <Route path="/authorize/@:username" component={SignAuthorize} />
    <Route path="/revoke/@:username" component={Revoke} />
    <Route path="/*" component={Error404} />
  </Route>
);
