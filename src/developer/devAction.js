import * as devTypes from './devActionTypes';

export function setPermission(permissionList) {
  return { type: devTypes.UPDATE_PERMISSIONLIST, permissionList };
}

export function createApplication({
  name, ownerWif, author, tagline, description, origins, redirect_urls, permissions,
}) {
  return (dispatch) => {
    fetch('/auth/create', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        name,
        ownerWif,
        author,
        tagline,
        description,
        origins,
        redirect_urls,
        permissions,
      }),
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-csrf-token': document.querySelector('meta[name="_csrf"]').content,
      }),
    }).then((response) => {
      if (response.status === 201) {
        dispatch({
          type: devTypes.CREATE_APPLICATION,
          error: false,
        });
      } else {
        dispatch({
          type: devTypes.CREATE_APPLICATION,
          error: 'Could not create app',
        });
      }
    });
  };
}
