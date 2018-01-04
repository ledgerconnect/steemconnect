import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import steem from '@steemit/steem-js';
import auth from './reducers/auth';
import appLocale from './reducers/appLocale';

const reducers = combineReducers({
  auth,
  appLocale,
});

if (process.env.STEEMJS_URL) {
  steem.api.setOptions({ url: process.env.STEEMJS_URL });
}

const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk),
);

export default store;
