/* global chrome */
import { isChromeExtension } from '@/helpers/utils';
import store from '@/store';

export default function getPersistedData(callback) {
  if (!isChromeExtension()) return callback({ store });

  chrome.runtime.sendMessage({ type: 'retrieve' }, data => {
    let url = null;

    if (data) {
      if (data.state) {
        store.replaceState(data.state);
      }

      if (data.url) {
        ({ url } = data);
      }
    }

    store.subscribe((mut, state) => {
      chrome.runtime.sendMessage({ type: 'store', payload: state });
    });

    return callback({ store, url });
  });

  return null;
}
