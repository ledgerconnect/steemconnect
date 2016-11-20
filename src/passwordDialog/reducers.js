import * as types from './actions';

const initialState = {
  showDialog: false,
  btnName: 'confirm',
  inProgress: false,
  onEnter: null,
  onCancel: null,
  isSuccess: false,
  isError: false,
  message: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_DIALOG:
      return Object.assign({}, state, {
        showDialog: true,
        btnName: action.btnName,
        onEnter: action.onEnter,
        onCancel: action.onCancel,
      });
    case types.UPDATE_DIALOG:
      return Object.assign({}, state, {
        btnName: action.btnName,
        inProgress: action.inProgress || initialState.inProgress,
        isSuccess: action.isSuccess || initialState.isSuccess,
        isError: action.isError || initialState.isError,
        message: action.message || initialState.message,
      });
    case types.HIDE_DIALOG:
      return { ...initialState };
    default:
      return state;
  }
};
