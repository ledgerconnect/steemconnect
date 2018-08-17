import Vue from 'vue';
import client from '@/helpers/client';
import { credentialsValid } from '@/helpers/auth';

const state = {
  username: null,
  keys: {},
  account: {},
  open_orders: [],
  transfer_history: [],
};

const mutations = {
  saveAccount(_state, { result, keys }) {
    Vue.set(state, 'username', result.name);
    Vue.set(state, 'keys', keys);
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
  login: async ({ commit, dispatch }, { username, keys }) => {
    const valid = await credentialsValid(username, keys.active);

    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const result = await client.callAsync('get_accounts', [[username]]);
    commit('saveAccount', { result: result[0], keys });
    await Promise.all([
      dispatch('getOpenOrders'),
      dispatch('getTransferHistory'),
      dispatch('getRate'),
    ]);
  },
  getOpenOrders: ({ commit }) => (
    new Promise((resolve) => {
      client.callAsync('get_open_orders', [state.username]).then((result) => {
        commit('saveOpenOrders', result);
        resolve();
      });
    })
  ),
  getTransferHistory: ({ commit }) => (
    new Promise((resolve) => {
      client.callAsync('get_state', [`/@${state.username}/transfers`]).then((result) => {
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
