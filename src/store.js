import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import appReducers from './app/appReducers';
import authReducers from './auth/authReducers';
import devReducers from './developer/reducers';

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  developer: devReducers,
});

export default createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk)
);
