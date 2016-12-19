import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Wrapper from './wrapper';
import Index from './statics/Index';
import Method from './method/Method';
import Operation from './operation/Operation';
import Sign from './operation/Sign';
import Authorize from './auth/Authorize';
import Auths from './auth/Auths';

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Index} />
    <Route path="/method/:type" component={Method} />
    <Route path="/operation/:type" component={Operation} />
    <Route path="/sign/:type" component={Sign} />
    <Route path="/authorize/@:username" component={Authorize} />
    <Route path="/auths" component={Auths} />
  </Route>
);
