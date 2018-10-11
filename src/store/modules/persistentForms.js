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
  create: {
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
  saveCreateStep(_state, step) {
    Vue.set(_state.create, 'step', step);
  },
  saveCreateUsername(_state, username) {
    Vue.set(_state.create, 'username', username);
  },
  saveCreatePassword(_state, password) {
    Vue.set(_state.create, 'password', password);
  },
  saveCreateKey(_state, key) {
    Vue.set(_state.create, 'key', key);
  },
  saveCreateKeyConfirmation(_state, keyConfirmation) {
    Vue.set(_state.create, 'keyConfirmation', keyConfirmation);
  },
};

const actions = {};

export default { state, mutations, actions };
