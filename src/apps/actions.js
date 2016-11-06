export const GET_APPLIST_REQUEST = '@apps/GET_APPLIST_REQUEST';
export const GET_APPLIST_SUCCESS = '@apps/GET_APPLIST_SUCCESS';
export const GET_APPLIST_FAILURE = '@apps/GET_APPLIST_FAILURE';

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function getAppList(filter = '') {
  return (dispatch) => {
    dispatch({ type: GET_APPLIST_REQUEST });
    fetch(`/auth/apps?filter=${filter}`, {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
      }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(appList => dispatch({ type: GET_APPLIST_SUCCESS, appList }))
      .catch((err) => {
        const errorMessage = err.toString();
        dispatch({
          type: GET_APPLIST_FAILURE,
          app: {},
          errorMessage,
        });
      });
  };
}
