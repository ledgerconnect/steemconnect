import Vue from 'vue';

const state = {
  sidebarVisible: false,
};

const mutations = {
  toggleSidebarVisibility(_state) {
    Vue.set(_state, 'sidebarVisible', !_state.sidebarVisible);
  },
};

const actions = {
  toggleSidebarVisibility({ commit }) {
    commit('toggleSidebarVisibility');
  },
};

export default {
  state,
  mutations,
  actions,
};
