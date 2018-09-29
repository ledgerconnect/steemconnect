import Vue from 'vue';
import { PrivateKey, cryptoUtils } from 'dsteem';
import client, { unfollow } from '@/helpers/client';
import { credentialsValid, privateKeyFrom } from '@/helpers/auth';
import router from '@/router';
import { idleDetector } from '@/main';

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
  login: async ({ commit, dispatch, rootState }, { username, keys }) => {
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
      dispatch('getDynamicGlobalProperties'),
      dispatch('getContacts'),
    ]);

    idleDetector.start(rootState.settings.timeout * 60 * 1000, () => {
      idleDetector.stop();
      dispatch('logout');
    });
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
  unfollow: async ({ rootState, dispatch }, username) => {
    const { account, keys } = rootState.auth;

    const confirmation = await unfollow(account.name, username, keys.active);

    dispatch('getContacts');

    return confirmation;
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
  sign: ({ rootState }, tx) => {
    const { keys } = rootState.auth;
    const { chainId } = rootState.market;
    const privateKey = PrivateKey.fromString(keys.active);
    return cryptoUtils.signTransaction(tx, [privateKey], Buffer.from(chainId, 'hex'));
  },
  broadcast: (context, tx) => client.broadcast.send(tx),
};

export default {
  state,
  mutations,
  actions,
};
