import Vue from 'vue';
import Client from 'lightrpc';

const client = new Client('https://api.steemit.com');

const state = {
  username: null,
  account: {},
  open_orders: [],
};

const mutations = {
  saveAccount(_state, result) {
    Vue.set(state, 'username', result.name);
    Vue.set(state, 'account', result);
  },
  saveOpenOrders(_state, result) {
    Vue.set(state, 'open_orders', result);
  },
};

const actions = {
  login: ({ commit, dispatch }, username) => (
    new Promise((resolve, reject) => {
      client.call('get_accounts', [[username]], (err, result) => {
        commit('saveAccount', result[0]);
        dispatch('getOpenOrders').then(() => {
          resolve();
        });
      });
    })
  ),
  getOpenOrders: ({ commit }) => (
    new Promise((resolve, reject) => {
      client.call('get_open_orders', [state.username], (err, result) => {
        commit('saveOpenOrders', result);
        resolve();
      });
    })
  ),
};

export default {
  state,
  mutations,
  actions,
};
