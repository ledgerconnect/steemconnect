var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./containers/wrapper'),
  Dashboard = require('./components/dashboard'),
  Connect = require('./components/connect');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/connect" component={Connect} />
  </Route>
);