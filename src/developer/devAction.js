import axios from 'axios';
import * as devTypes from './devActionTypes';

export function createApplication({ appOwnerWif, appName, author, origins, redirect_urls, permissions }) {
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
