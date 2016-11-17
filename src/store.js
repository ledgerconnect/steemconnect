import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import appReducers from './app/appReducers';
import appsReducers from './apps/reducers';
import paymentsReducers from './transfer/reducers';
import authReducers from './auth/authReducers';
import devReducers from './developers/reducers';

const reducers = combineReducers({
  app: appReducers,
  apps: appsReducers,
  auth: authReducers,
  payments: paymentsReducers,
  developer: devReducers,
});

export default createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk)
);
