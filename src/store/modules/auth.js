import Vue from 'vue';
import client from '@/helpers/client';
import { credentialsValid, privateKeyFrom } from '@/helpers/auth';
import router from '@/router';
import createIdleDetector from '@/helpers/idle';

const IDLE_DETECTOR_TRESHOLD = 20 * 60 * 1000;
const idleDetector = createIdleDetector({
  treshold: IDLE_DETECTOR_TRESHOLD,
  autostop: true,
});

const state = {
  username: null,
  keys: {},
  account: {},
  contacts: [],
  open_orders: [],
  transfer_history: [],
};

const mutations = {
  saveAccount(_state, { result, keys }) {
    Vue.set(_state, 'username', result.name);
    Vue.set(_state, 'keys', keys);
    Vue.set(_state, 'account', result);
  },
  saveContacts(_state, { contacts }) {
    Vue.set(_state, 'contacts', contacts);
  },
  saveOpenOrders(_state, result) {
    Vue.set(_state, 'open_orders', result.reverse());
  },
  saveTransferHistory(_state, result) {
    Vue.set(_state, 'transfer_history', result);
  },
  logout(_state) {
    Vue.set(_state, 'username', null);
    Vue.set(_state, 'keys', {});
    Vue.set(_state, 'account', {});
    Vue.set(_state, 'open_orders', []);
    Vue.set(_state, 'transfer_history', []);
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
      dispatch('getConfig'),
      dispatch('getOpenOrders'),
      dispatch('getTransferHistory'),
      dispatch('getRate'),
      dispatch('getDynamicGlobalProperties'),
      dispatch('getContacts'),
    ]);

    idleDetector.setCallback(() => dispatch('logout'));
    idleDetector.start();
  },
  logout: ({ commit }) => {
    commit('logout');
    router.push('/');
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
    }, privateKeyFrom(keys.active));
  },
  getContacts: async ({ state: _state, commit }) => {
    const step = 100;
    let allFollows = [];

    let follows = await client.call('follow_api', 'get_following', [_state.username, '', 'blog', step]);
    allFollows = follows;

    while (follows.length === step) {
      const startFrom = allFollows[allFollows.length - 1].following;
      // eslint-disable-next-line no-await-in-loop
      follows = await client.call('follow_api', 'get_following', [_state.username, startFrom, 'blog', step]);
      allFollows.push(...follows.slice(1));
    }
    const contacts = allFollows.map(follow => ({ username: follow.following, what: follow.what }));
    commit('saveContacts', { contacts });
  },
};

export default {
  state,
  mutations,
  actions,
};
