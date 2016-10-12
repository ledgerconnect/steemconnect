import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import Logout from './auth/Logout';
import Profile from './profile/Profile';
import Authorize from './auth/Authorize';
import Developer from './developer/Developer';
import Dashboard from './dashboard/Dashboard';
import Apps from './apps/Apps';
import AppDetails from './appdetails/AppDetails';
import Payments from './payments/Payments';
import Activity from './activity/Activity';

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/activity" component={Activity} />
    <Route path="/payments" component={Payments} />
    <Route path="/apps" component={Apps} />
    <Route path="/apps/:app" component={AppDetails}/>
    <Route path="/profile" component={Profile} />
    <Route path="/developers" component={Developer} />
    <Route path="/authorize/@:app" component={Authorize} />
    <Route path="/logout" component={Logout} />
  </Route>
);
