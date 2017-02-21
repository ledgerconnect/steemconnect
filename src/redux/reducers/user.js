// import {fromJS} from 'immutable';
import {updateIn} from './functions';

export default function reducer(state = {}, action = {}) {
  const {type, payload} = action

  if(type === 'user/update') {
    return updateIn(state, payload)
  }

  return state;
}
