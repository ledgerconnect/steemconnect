import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import appReducers from './app/appReducers';
import authReducers from './auth/authReducers';
import headerReducers from './header/headerReducers';

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  header: headerReducers,
});

export default createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk)
);
