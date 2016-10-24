export const SHOW_SIDEBAR = '@app/SHOW_SIDEBAR';
export const HIDE_SIDEBAR = '@app/HIDE_SIDEBAR';

export function hideSidebar() {
  return { type: HIDE_SIDEBAR };
}

export function showSidebar() {
  return { type: SHOW_SIDEBAR };
}
