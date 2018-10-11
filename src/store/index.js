/* global chrome */
import Vue from 'vue';
import Vuex from 'vuex';
import { isChromeExtension } from '@/helpers/utils';
import modules from './modules';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

let store = null;

export default function getStoreInstance(callback) {
  if (store) return callback(store);

  store = new Vuex.Store({
    modules,
    strict: debug,
  });

  if (!isChromeExtension()) return callback(store);

  chrome.runtime.sendMessage({ id: 'retrieve' }, data => {
    if (data) {
      store.replaceState(JSON.parse(data));
    }

    store.subscribe((mut, state) => {
      chrome.runtime.sendMessage({ id: 'store', payload: JSON.stringify(state) });
    });

    return callback(store);
  });

  return null;
}
