export const CREATE_APP_REQUEST = '@developers/CREATE_APP_REQUEST';
export const CREATE_APP_SUCCESS = '@developers/CREATE_APP_SUCCESS';
export const CREATE_APP_FAILURE = '@developers/CREATE_APP_FAILURE';
export const GET_APP_REQUEST = '@developers/GET_APP_REQUEST';
export const GET_APP_SUCCESS = '@developers/GET_APP_SUCCESS';
export const GET_APP_FAILURE = '@developers/GET_APP_FAILURE';
export const DELETE_APP_REQUEST = '@developers/DELETE_APP_REQUEST';
export const DELETE_APP_SUCCESS = '@developers/DELETE_APP_SUCCESS';
export const DELETE_APP_FAILURE = '@developers/DELETE_APP_FAILURE';

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function createApp(appData) {
  return (dispatch) => {
    dispatch({ type: CREATE_APP_REQUEST });
    fetch('/auth/app', {
      method: 'POST',
      body: JSON.stringify(appData),
      credentials: 'include',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
      }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(app => dispatch({ type: CREATE_APP_SUCCESS, app }))
      .catch((err) => {
        const errorMessage = err.toString();
        dispatch({
          type: CREATE_APP_FAILURE,
          app: {},
          errorMessage,
        });
      });
  };
}

export function getApp(appUserName) {
  return (dispatch) => {
    dispatch({ type: GET_APP_REQUEST });
    fetch(`/auth/app/@${appUserName}`, {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
      }),
    }).then(handleErrors)
      .then(response => response.json())
      .then(app => dispatch({ type: GET_APP_SUCCESS, app }))
      .catch((err) => {
        const errorMessage = err.toString();
        dispatch({
          type: GET_APP_FAILURE,
          app: {},
          errorMessage,
        });
      });
  };
}

export function deleteApp() {
  return (dispatch) => {
    dispatch({ type: DELETE_APP_REQUEST });
    fetch('/auth/app', {
      method: 'DELETE',
      credentials: 'include',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
      }),
    }).then(handleErrors)
      .then(response => response.json())
      .then(app => dispatch({ type: DELETE_APP_SUCCESS, app }))
      .catch((err) => {
        const errorMessage = err.toString();
        dispatch({
          type: DELETE_APP_FAILURE,
          app: {},
          errorMessage,
        });
      });
  };
}
