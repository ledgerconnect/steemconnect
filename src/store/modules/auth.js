import Vue from 'vue';
import Client from 'lightrpc';

const client = new Client('https://api.steemit.com');
const username = 'hellosteem';

const state = {
  account: {},
  open_orders: [],
};

const mutations = {
  saveAccount(_state, result) {
    Vue.set(state, 'account', result);
  },
  saveOpenOrders(_state, result) {
    Vue.set(state, 'open_orders', result);
  },
};

const actions = {
  login: ({ commit, dispatch }) => {
    client.call('get_accounts', [[username]], (err, result) => {
      commit('saveAccount', result[0]);
    });
    dispatch('getOpenOrders');
  },
  getOpenOrders: ({ commit }) => {
    client.call('get_open_orders', [username], (err, result) => {
      commit('saveOpenOrders', result);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
