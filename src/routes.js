import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import ModelWrapper from './ModelWrapper';
import Profile from './profile/Profile';
import Authorize from './auth/Authorize';
import Developer from './developer/Developer';
import Summary from './summary/Summary';
import Apps from './apps/Apps';
import App from './apps/App';
import Payments from './payments/Payments';
import Activity from './activity/Activity';
import SignUp from './auth/Signup';

module.exports = (
  <Route path="/">
    <Route path="/signup" component={SignUp} />
    <Route component={Wrapper}>
      <IndexRoute component={Summary} />
      <Route path="/activity" component={Activity} />
      <Route path="/payments" component={Payments} />
      <Route path="/apps" component={Apps} />
      <Route path="/apps/:app" component={App} />
      <Route path="/profile" component={Profile} />
      <Route path="/developers" component={Developer} />
    </Route>

    <Route component={ModelWrapper}>
      <Route path="/authorize/@:app" component={Authorize} />
    </Route>
  </Route>
);
