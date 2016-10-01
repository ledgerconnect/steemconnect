import * as devTypes from './devActionTypes';

const initialState = { permissionList: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case devTypes.CREATE_APPLICATION:
      return {
        ...state,
        ...action,
      };
    case devTypes.UPDATE_PERMISSIONLIST:
      return {
        ...state,
        permissionList: action.permissionList,
      };
    default:
      return state;
  }
};
