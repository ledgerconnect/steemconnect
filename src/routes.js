var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./containers/wrapper'),
  Login = require('./auth/login'),
  Logout = require('./auth/logout'),
  Dashboard = require('./components/dashboard'),
  Profile = require('./components/settings'),
  LastUserSelector = require('./components/lastUserSelector'),
  Authorize = require('./auth/Authorize');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/login(/:username)" component={Login} />
    <Route path="/loginlist" component={LastUserSelector} />
    <Route path="/logout" component={Logout} />
    <Route path="/apps" component={Dashboard} />
    <Route path="/profile" component={Profile} />
    <Route path="/developers" component={Dashboard} />
    <Route path="/about" component={Dashboard} />
    <Route path="/authorize/@:app" component={Authorize} />
  </Route>
);
