var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./containers/wrapper'),
  Login = require('./components/login'),
  Dashboard = require('./components/dashboard'),
  Authorize = require('./components/authorize');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/login" component={Login} />
    <Route path="/apps" component={Dashboard} />
    <Route path="/developers" component={Dashboard} />
    <Route path="/about" component={Dashboard} />
    <Route path="/authorize/:app" component={Authorize} />
  </Route>
);