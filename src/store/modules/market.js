import Vue from 'vue';
import Client from 'lightrpc';

const client = new Client('https://api.steemit.com');

const state = {
  recentTrades: [],
  ticker: {},
};

const mutations = {
  saveRecentTrades(_state, result) {
    if (result) {
      Vue.set(state, 'recentTrades', result);
    }
  },
  saveTicker(_state, result) {
    if (result) {
      Vue.set(state, 'ticker', result);
    }
  },
};

const actions = {
  getRecentTrades: ({ commit }) => {
    client.call('get_recent_trades', [25], (err, result) => {
      commit('saveRecentTrades', result);
    });
  },
  getTicker: ({ commit }) => {
    client.call('get_ticker', [], (err, result) => {
      commit('saveTicker', result);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
