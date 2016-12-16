import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Wrapper from './wrapper';
import Error404 from './statics/Error404';

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Error404} />
  </Route>
);
