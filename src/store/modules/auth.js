import Vue from 'vue';
import client from '@/helpers/client';

const state = {
  username: null,
  account: {},
  open_orders: [],
  transfer_history: [],
};

const mutations = {
  saveAccount(_state, result) {
    Vue.set(state, 'username', result.name);
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
  login: ({ commit, dispatch }, username) => (
    new Promise((resolve) => {
      client.callAsync('get_accounts', [[username]]).then((result) => {
        commit('saveAccount', result[0]);
        Promise.all([
          dispatch('getOpenOrders'),
          dispatch('getTransferHistory'),
          dispatch('getRate'),
        ]).then(() => {
          resolve();
        });
      })
        .catch((err) => {
          console.log('Steemd "get_accounts" request failed', err);
        });
    })
  ),
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
