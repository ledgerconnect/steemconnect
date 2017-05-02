import * as types from './actions';

const initialState = {
  username: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USERNAME:
      return {
        ...state,
        username: action.payload.username,
      };
    default:
      return state;
  }
};
