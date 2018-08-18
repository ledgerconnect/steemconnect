import Vue from 'vue';
import { PrivateKey } from 'dsteem';
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

    const result = await client.database.getAccounts([username]);
    commit('saveAccount', { result: result[0], keys });
    await Promise.all([
      dispatch('getOpenOrders'),
      dispatch('getTransferHistory'),
      dispatch('getRate'),
    ]);
  },
  getOpenOrders: ({ commit }) => (
    new Promise((resolve) => {
      client.database.call('get_open_orders', [state.username]).then((result) => {
        commit('saveOpenOrders', result);
        resolve();
      });
    })
  ),
  getTransferHistory: ({ commit }) => (
    new Promise((resolve) => {
      client.database.getState(`/@${state.username}/transfers`).then((result) => {
        const transferHistory = result.accounts[state.username].transfer_history.slice().reverse();
        commit('saveTransferHistory', transferHistory);
        resolve();
      });
    })
  ),
  transfer: ({ rootState }, { amount, to, memo }) => {
    const { account, keys } = rootState.auth;

    return client.broadcast.transfer({
      from: account.name,
      amount,
      to,
      memo,
    }, PrivateKey.from(keys.active));
  },
};

export default {
  state,
  mutations,
  actions,
};
