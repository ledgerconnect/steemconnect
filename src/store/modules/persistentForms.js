// Rationale behind those persistent forms is exactly the same as Metamask's:
// https://github.com/MetaMask/metamask-extension/blob/develop/docs/form_persisting_architecture.md
// The only difference is in the implementation (Metamask uses localStorage), in this case we
// save form state to Vuex which is synced to the background script.
import Vue from 'vue';

const state = {
  login: {
    username: '',
    key: '',
  },
  import: {
    step: 1,
    username: '',
    password: '',
    key: '',
    keyConfirmation: '',
  },
};

const mutations = {
  saveLoginUsername(_state, username) {
    Vue.set(_state.login, 'username', username);
  },
  saveLoginKey(_state, key) {
    Vue.set(_state.login, 'key', key);
  },
  saveImportStep(_state, step) {
    Vue.set(_state.import, 'step', step);
  },
  saveImportUsername(_state, username) {
    Vue.set(_state.import, 'username', username);
  },
  saveImportPassword(_state, password) {
    Vue.set(_state.import, 'password', password);
  },
  saveImportKey(_state, key) {
    Vue.set(_state.import, 'key', key);
  },
  saveImportKeyConfirmation(_state, keyConfirmation) {
    Vue.set(_state.import, 'keyConfirmation', keyConfirmation);
  },
};

const actions = {};

export default { state, mutations, actions };
