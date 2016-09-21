import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import appReducers from './app/appReducers';
import devReducers from './developer/devReducers';
import authReducers from './auth/authReducers';
import headerReducers from './header/headerReducers';

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  developer: devReducers,
  header: headerReducers,
});

export default createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk)
);
