import * as authTypes from './authActionTypes';

export function selectLoginWithUserName(selected) {
  return { type: authTypes.UPDATE_LAST_USER_LIST, lastUserList: { selected, show: false } };
}

export function ShowLastUserList() {
  return { type: authTypes.UPDATE_LAST_USER_LIST, lastUserList: { show: true } };
}
