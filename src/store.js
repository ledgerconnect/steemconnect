import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import auth from './reducers/auth';

const reducers = combineReducers({
  auth,
});

if (process.env.ENABLE_LOGGER &&
  process.env.IS_BROWSER &&
  process.env.NODE_ENV !== 'production') {
}

const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk),
);

export default store;
