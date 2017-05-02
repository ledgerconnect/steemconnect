import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import App from './app';
import Index from './statics/Index';
import Dashboard from './app/Dashboard';
import Docs from './statics/Docs';
import Sign from './sign/Sign';
import Login from './auth/Login'
import Permissions from './auth/Permissions';
import Authorize from './auth/Authorize';
import Revoke from './auth/Revoke';
import Error404 from './statics/Error404';

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Index} />
    <Route component={App}>
      <Route path="/app" component={Dashboard} />
      <Route path="/docs" component={Docs} />
      <Route path="/@:username/permissions" component={Permissions} />
    </Route>
    <Route path="/login" component={Login} />
    <Route path="/sign/:type" component={Sign} />
    <Route path="/authorize/@:username" component={Authorize} />
    <Route path="/revoke/@:username" component={Revoke} />
    <Route path="/*" component={Error404} />
  </Route>
);
