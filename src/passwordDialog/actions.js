export const SHOW_DIALOG = '@passwordDialog/SHOW_DIALOG';
export const HIDE_DIALOG = '@passwordDialog/HIDE_DIALOG';
export const UPDATE_DIALOG = '@passwordDialog/UPDATE_DIALOG';

export function showPasswordDialog({ btnName, onEnter, onCancel }) {
  return { type: SHOW_DIALOG, btnName, onEnter, onCancel };
}

export function updatePasswordDialog({ btnName, inProgress, isSuccess, isError, message }) {
  return { type: UPDATE_DIALOG, btnName, inProgress, isSuccess, isError, message };
}

export function hidePasswordDialog() {
  return { type: HIDE_DIALOG };
}

