import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import Index from './statics/Index';
import Sign from './sign/Sign';
import Permissions from './auth/Permissions'
import Authorize from './auth/Authorize';
import Revoke from './auth/Revoke';

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Index} />
    <Route path="/sign/:type" component={Sign} />
    <Route path="/@:username/permissions" component={Permissions} />
    <Route path="/authorize/@:username" component={Authorize} />
    <Route path="/revoke/@:username" component={Revoke} />
  </Route>
);
