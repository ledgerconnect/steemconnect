import * as types from './appActionTypes';

export function hideSidebar() {
  return { type: types.HIDE_SIDEBAR };
}

export function showSidebar() {
  return { type: types.SHOW_SIDEBAR };
}
