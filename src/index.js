import React from 'react';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import ReactDOM from 'react-dom';
import steem from 'steem';
import routes from './routes';
import store from './store';

require('es6-promise').polyfill();
require('isomorphic-fetch');

// load the stylesheet
require('./styles/base.sass');

steem.config.set('websocket', 'wss://steemd.steemit.com');

const appHistory = useRouterHistory(createHistory)({ queryKey: false });
ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={appHistory} />
  </Provider>,
  document.getElementById('app')
);
