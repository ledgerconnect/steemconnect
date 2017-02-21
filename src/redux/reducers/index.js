import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './User';

export default combineReducers({
  routing: routerReducer,
  user,
});
