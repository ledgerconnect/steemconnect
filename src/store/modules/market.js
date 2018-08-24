import Vue from 'vue';
import axios from 'axios';
import client, { createLimitOrder, cancelLimitOrder } from '@/helpers/client';
import { groupByRealPrice } from '@/helpers/market';

const state = {
  properties: {},
  ticker: {
    SBD: {},
  },
  orderBook: {
    SBD: {
      bids: {},
      asks: {},
    },
  },
  recentTrades: {
    SBD: [],
  },
  rate: {},
};

const mutations = {
  saveProperties(_state, result) {
    Vue.set(_state, 'properties', result);
  },
  saveTicker(_state, { asset, result }) {
    if (result) {
      Vue.set(state.ticker, asset, result);
    }
  },
  saveOrderBook(_state, { asset, result }) {
    if (result) {
      Vue.set(state.orderBook[asset], 'bids', groupByRealPrice(result.bids));
      Vue.set(state.orderBook[asset], 'asks', groupByRealPrice(result.asks));
    }
  },
  saveRecentTrades(_state, { asset, result }) {
    if (result) {
      Vue.set(state.recentTrades, asset, result);
    }
  },
  saveRate(_state, result) {
    Vue.set(state, 'rate', result);
  },
};

const actions = {
  getDynamicGlobalProperties: ({ commit }) => {
    client.database.call('get_dynamic_global_properties', []).then((result) => {
      commit('saveProperties', result);
    });
  },
  getTicker: ({ commit }, asset) => {
    client.database.call('get_ticker', []).then((result) => {
      commit('saveTicker', { asset, result });
    });
  },
  getOrderBook: ({ commit }, asset) => {
    client.database.call('get_order_book', [500]).then((result) => {
      commit('saveOrderBook', { asset, result });
    });
  },
  getRecentTrades: ({ commit }, asset) => {
    client.database.call('get_recent_trades', [25]).then((result) => {
      commit('saveRecentTrades', { asset, result });
    });
  },
  getRate: ({ commit }) => {
    axios.get('https://api.coinmarketcap.com/v1/ticker/steem/').then((response) => {
      if (response.data && response.data[0] && response.data[0].price_btc) {
        commit('saveRate', response.data[0]);
      }
    }).catch(err => console.log(err));
  },
  createLimitOrder: async ({ rootState, dispatch }, order) => {
    const { account, keys } = rootState.auth;

    const confirmation = await createLimitOrder(
      account.name,
      order.amountToSell,
      order.minToReceive,
      order.fillOrKill,
      order.expiration,
      keys.active,
    );

    await dispatch('getOpenOrders');

    return confirmation;
  },
  cancelLimitOrder: async ({ rootState, dispatch }, orderId) => {
    const { account, keys } = rootState.auth;

    const confirmation = await cancelLimitOrder(account.name, orderId, keys.active);
    await dispatch('getOpenOrders');

    return confirmation;
  },
};

export default {
  state,
  mutations,
  actions,
};
