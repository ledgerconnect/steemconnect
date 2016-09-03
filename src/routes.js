var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./containers/wrapper'),
  Login = require('./components/login'),
  Logout = require('./components/logout'),
  Dashboard = require('./components/dashboard'),
  Profile = require('./components/profile'),
  Authorize = require('./components/authorize');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/login" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/apps" component={Dashboard} />
    <Route path="/profile" component={Profile} />
    <Route path="/developers" component={Dashboard} />
    <Route path="/about" component={Dashboard} />
    <Route path="/authorize/@:app" component={Authorize} />
  </Route>
);