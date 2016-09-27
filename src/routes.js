import Developer from './developer/Developer';
import Dashboard from './dashboard/Dashboard';

let React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./wrapper'),
  Logout = require('./auth/Logout'),
  Profile = require('./app/Settings'),
  Authorize = require('./auth/Authorize');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/logout" component={Logout} />
    <Route path="/apps" component={Dashboard} />
    <Route path="/profile" component={Profile} />
    <Route path="/developers" component={Developer} />
    <Route path="/about" component={Dashboard} />
    <Route path="/authorize/@:app" component={Authorize} />
  </Route>
);
