import * as devTypes from './devActionTypes';
import { UPDATE_PROFILE } from '../auth/authActionTypes';

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
    }).then(response => response.json())
    .then((userData) => {
      dispatch({
        type: devTypes.CREATE_APPLICATION,
        error: false,
      });
      dispatch({
        type: UPDATE_PROFILE,
        user: userData,
      });
    }).catch((err) => {
      const errorMessage = typeof err !== 'string' ? ((err.data && err.data.error) || err.statusText) : err;
      dispatch({
        type: devTypes.CREATE_APPLICATION,
        error: errorMessage || 'Could not create app',
      });
    });
  };
}
