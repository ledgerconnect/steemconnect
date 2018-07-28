import Vue from 'vue';
import Client from 'lightrpc';

const client = new Client('https://api.steemit.com');

const state = {
  ticker: {
    SBD: {},
  },
  orderBook: {
    SBD: {
      bids: [],
      asks: [],
    },
  },
  recentTrades: {
    SBD: [],
  },
};

const mutations = {
  saveTicker(_state, { asset, result }) {
    if (result) {
      Vue.set(state.ticker, asset, result);
    }
  },
  saveOrderBook(_state, { asset, result }) {
    if (result) {
      Vue.set(state.orderBook, asset, result);
    }
  },
  saveRecentTrades(_state, { asset, result }) {
    if (result) {
      Vue.set(state.recentTrades, asset, result);
    }
  },
};

const actions = {
  getTicker: ({ commit }, asset) => {
    client.call('get_ticker', [], (err, result) => {
      commit('saveTicker', { asset, result });
    });
  },
  getOrderBook: ({ commit }, asset) => {
    client.call('get_order_book', [500], (err, result) => {
      commit('saveOrderBook', { asset, result });
    });
  },
  getRecentTrades: ({ commit }, asset) => {
    client.call('get_recent_trades', [25], (err, result) => {
      commit('saveRecentTrades', { asset, result });
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
