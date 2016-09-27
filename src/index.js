import React from 'react';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import ReactDOM from 'react-dom';
import routes from './routes';
import store from './store';

// load the stylesheet
require('./styles/base.sass');

const appHistory = useRouterHistory(createHistory)({ queryKey: false });
ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={appHistory} />
  </Provider>,
  document.getElementById('app')
);
