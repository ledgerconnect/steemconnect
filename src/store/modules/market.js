import Vue from 'vue';
import Client from 'lightrpc';

const client = new Client('https://api.steemit.com');

const state = {
  ticker: {},
  orderBook: {
    bids: [],
    asks: [],
  },
  recentTrades: [],
};

const mutations = {
  saveTicker(_state, result) {
    if (result) {
      Vue.set(state, 'ticker', result);
    }
  },
  saveOrderBook(_state, result) {
    if (result) {
      Vue.set(state, 'orderBook', result);
    }
  },
  saveRecentTrades(_state, result) {
    if (result) {
      Vue.set(state, 'recentTrades', result);
    }
  },
};

const actions = {
  getTicker: ({ commit }) => {
    client.call('get_ticker', [], (err, result) => {
      commit('saveTicker', result);
    });
  },
  getOrderBook: ({ commit }) => {
    client.call('get_order_book', [500], (err, result) => {
      commit('saveOrderBook', result);
    });
  },
  getRecentTrades: ({ commit }) => {
    client.call('get_recent_trades', [25], (err, result) => {
      commit('saveRecentTrades', result);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
