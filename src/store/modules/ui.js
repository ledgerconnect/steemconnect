import Vue from 'vue';

const state = {
  sidebarVisible: false,
  savedPath: null,
};

const mutations = {
  toggleSidebarVisibility(_state) {
    Vue.set(_state, 'sidebarVisible', !_state.sidebarVisible);
  },
  savePath(_state, path) {
    Vue.set(_state, 'savedPath', path);
  },
};

const actions = {
  toggleSidebarVisibility({ commit }) {
    commit('toggleSidebarVisibility');
  },
  savePath({ commit }, path) {
    commit('savePath', path);
  },
};

export default {
  state,
  mutations,
  actions,
};
