import Vue from 'vue';
import Client from 'lightrpc';

const client = new Client('https://api.steemit.com');

const state = {
  username: null,
  account: {},
  open_orders: [],
  transfer_history: [],
};

const mutations = {
  saveAccount(_state, result) {
    Vue.set(state, 'username', result.name);
    Vue.set(state, 'account', result);
  },
  saveOpenOrders(_state, result) {
    Vue.set(state, 'open_orders', result);
  },
  saveTransferHistory(_state, result) {
    Vue.set(state, 'transfer_history', result);
  },
};

const actions = {
  login: ({ commit, dispatch }, username) => (
    new Promise((resolve, reject) => {
      client.call('get_accounts', [[username]], (err, result) => {
        commit('saveAccount', result[0]);
        Promise.all([
          dispatch('getOpenOrders'),
          dispatch('getTransferHistory'),
          dispatch('getRate'),
        ]).then(() => {
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
  getTransferHistory: ({ commit }) => (
    new Promise((resolve, reject) => {
      client.call('get_state', [`/@${state.username}/transfers`], (err, result) => {
        const transferHistory = result.accounts[state.username].transfer_history.slice().reverse();
        commit('saveTransferHistory', transferHistory);
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
