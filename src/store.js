/* global window */
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import api from './steemAPI';

import appReducers from './app/appReducers';

if (process.env.NODE_ENV !== 'production') {
  window.steemAPI = api;
}

const reducers = combineReducers({
  app: appReducers,
});

const middleware = [
  promiseMiddleware({
    promiseTypeSuffixes: [
      'START',
      'SUCCESS',
      'ERROR',
    ]
  }),
  thunk.withExtraArgument({
    steemAPI: api,
  })
];

const enhancer = compose(
  applyMiddleware(...middleware),
  persistState('favorites')
);

if (process.env.ENABLE_LOGGER &&
  process.env.IS_BROWSER &&
  process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({
    collapsed: true,
    duration: true,
    stateTransformer: state => JSON.parse(JSON.stringify(state))
  }));
}

const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  enhancer
);

export default store;
