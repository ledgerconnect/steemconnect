import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Router
      routes={routes}
      history={browserHistory}
    />
  </Provider>,
  document.getElementById('app')
);
