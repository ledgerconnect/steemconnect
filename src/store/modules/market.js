import Vue from 'vue';
import Client from 'lightrpc';

const client = new Client('https://api.steemit.com');

const state = {
  tradeHistory: [],
};

const mutations = {
  saveTradeHistory(_state, result) {
    if (result) {
      Vue.set(state, 'tradeHistory', result.slice().reverse());
    }
  },
};

const actions = {
  getTradeHistory: ({ commit }) => {
    client.call('get_trade_history', [
      '2018-07-16T20:08:07',
      '1969-12-31T23:59:59',
      1000,
    ], (err, result) => {
      commit('saveTradeHistory', result);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
