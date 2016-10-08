import * as devTypes from './devActionTypes';

export function setPermission(permissionList) {
  return { type: devTypes.UPDATE_PERMISSIONLIST, permissionList };
}

export function createApplication({
  appOwnerWif, appName, author, origins, redirect_urls, permissions,
}) {
  return (dispatch) => {
    fetch('/auth/create', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        appOwnerWif,
        appName,
        author,
        origins,
        redirect_urls,
        permissions,
      }),
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
      }),
    }).then(response => response.json())
      .then((data) => {
        dispatch({
          type: devTypes.CREATE_APPLICATION,
          keys: data,
        });
      });
  };
}
