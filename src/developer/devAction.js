import axios from 'axios';
import { map } from 'lodash';
import * as devTypes from './devActionTypes';

export function setPermission(permissionList) {
  return { type: devTypes.UPDATE_PERMISSIONLIST, permissionList };
}

export function createApplication({
  appOwnerWif, appName, author, origins, redirect_urls, permissions,
}) {
  return (dispatch) => {
    axios.post('/auth/create', {
      appOwnerWif,
      appName,
      author,
      origins,
      redirect_urls,
      permissions,
    }, { headers: { 'x-csrf-token': document.querySelector('meta[name="_csrf"]').content } }).then(({ data }) => {
      dispatch({
        type: devTypes.CREATE_APPLICATION,
        keys: data,
      });
    });
  };
}

export function getPermissionList() {
  return (dispatch) => {
    axios.get('/auth/permissionList')
      .then(response => response.data)
      .then((permissions) => {
        const permissionArray = map(permissions, (v, k) => ({ ...v, api: k }));
        dispatch(setPermission(permissionArray));
      });
  };
}
