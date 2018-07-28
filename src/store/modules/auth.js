import Vue from 'vue';
import Client from 'lightrpc';

const client = new Client('https://api.steemit.com');

const state = {
  account: {},
};

const mutations = {
  saveAccount(_state, account) {
    Vue.set(state, 'account', account);
  },
};

const actions = {
  login: ({ commit }) => {
    const username = 'hellosteem';
    client.call('get_accounts', [[username]], (err, accounts) => {
      console.log(accounts);
      commit('saveAccount', accounts[0]);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
