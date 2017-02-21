import Immutable, {fromJS} from 'immutable';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './user';

/** Convert initial reducer state from an object to immutable. */
const initImmutable = (reducer) => (state, action) =>
  (action.type === '@@redux/INIT' || action.type === '@@INIT') && !Immutable.is(state) ?
    reducer(fromJS(state), action) :
    reducer(state, action);

export default combineReducers({
  user: initImmutable(user),
  routing: initImmutable(routerReducer),
  logAll: (state = {}, action = {}) => {console.log('reducer/index::action', action); return state}
});
