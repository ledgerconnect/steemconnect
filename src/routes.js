import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import App from './app';
import Index from './statics/Index';
import Dashboard from './statics/Dashboard';
import Apps from './apps/Apps';
import MyApps from './apps/MyApps';
import Docs from './statics/Docs';
import Sign from './sign/Sign';
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
    <Route component={App}>
      <Route path="/apps" component={Apps} />
      <Route path="/docs" component={Docs} />
      <Route path="/@:username/permissions" component={Permissions} />
    </Route>
    <Route component={RequireLogin}>
      <Route component={App}>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/apps/me" component={MyApps} />
      </Route>
    </Route>
    <Route path="/login" component={Login} />
    <Route path="/oauth2/authorize" component={Authorize} />
    <Route path="/sign/:type" component={Sign} />
    <Route path="/authorize/@:username" component={SignAuthorize} />
    <Route path="/revoke/@:username" component={Revoke} />
    <Route path="/*" component={Error404} />
  </Route>
);
