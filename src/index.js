import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes';
import store from './store';

if (process.env.SENTRY_PUBLIC_DSN) {
  const Raven = require('raven-js');
  Raven
    .config(process.env.SENTRY_PUBLIC_DSN)
    .install();
}

ReactDOM.render(
  <Provider store={store}>
    <Router
      routes={routes}
      history={browserHistory}
    />
  </Provider>,
  document.getElementById('app')
);
