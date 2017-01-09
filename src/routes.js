import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import Index from './statics/Index';
import Sign from './sign/Sign';
import Authorize from './authorize/Authorize';

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Index} />
    <Route path="/sign/:type" component={Sign} />
    <Route path="/authorize/@:username" component={Authorize} />
  </Route>
);
