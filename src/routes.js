import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import Index from './statics/Index';
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
    <Route path="/docs" component={Docs} />
    <Route path="/login" component={Login} />
    <Route path="/sign/:type" component={Sign} />
    <Route path="/@:username/permissions" component={Permissions} />
    <Route path="/authorize/@:username" component={Authorize} />
    <Route path="/revoke/@:username" component={Revoke} />
    <Route path="/404" component={Error404} />
  </Route>
);
