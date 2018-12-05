import Vue from 'vue';
import client from '@/helpers/client';
import { idleDetector } from '@/main';

const SETTINGS_KEY = 'settings';

const state = {
  properties: {},
  steemAddressPrefix: '',
  chainId: '',
  language: 'en',
  timeout: '20',
  theme: 'white',
  address: 'https://api.steemit.com',
};

const mutations = {
  saveProperties(_state, result) {
    Vue.set(_state, 'properties', result);
  },
  saveConfig(_state, config) {
    Vue.set(_state, 'steemAddressPrefix', config.STEEM_ADDRESS_PREFIX);
    Vue.set(_state, 'chainId', config.STEEM_CHAIN_ID);
  },
  saveSettings(_state, settings) {
    Vue.set(_state, 'language', settings.language || _state.language);
    Vue.set(_state, 'timeout', settings.timeout || _state.timeout);
    Vue.set(_state, 'theme', settings.theme || _state.theme);
    Vue.set(_state, 'address', settings.address || _state.address);
  },
};

const actions = {
  getDynamicGlobalProperties: ({ commit }) =>
    client.database.call('get_dynamic_global_properties', []).then(result => {
      commit('saveProperties', result);
    }),
  getConfig: async ({ commit }) => {
    const config = await client.database.call('get_config', []);
    commit('saveConfig', config);
  },
  loadSettings: ({ dispatch, commit }) => {
    const settingsContent = localStorage.getItem(SETTINGS_KEY);
    if (!settingsContent) {
      dispatch('getConfig');
      return;
    }

    try {
      const settings = JSON.parse(settingsContent);
      client.updateClient(settings.address);
      dispatch('getConfig');

      idleDetector.start(settings.timeout * 60 * 1000, () => {
        idleDetector.stop();
        dispatch('logout');
      });

      commit('saveSettings', settings);
    } catch (err) {
      console.error("Couldn't load settings", err);
    }
  },
  saveSettings: ({ dispatch }, settings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error("Couldn't save settings", err);
    }

    dispatch('loadSettings');
  },
};

export default {
  state,
  mutations,
  actions,
};
