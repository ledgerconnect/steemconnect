import Vue from 'vue';
import client from '@/helpers/client';
import { idleDetector } from '@/main';

const SETTINGS_KEY = 'settings';

const state = {
  language: 'en',
  timeout: '20',
  theme: 'white',
  address: 'https://api.steemit.com',
};

const mutations = {
  saveSettings(_state, settings) {
    Vue.set(_state, 'language', settings.language || _state.language);
    Vue.set(_state, 'timeout', settings.timeout || _state.timeout);
    Vue.set(_state, 'theme', settings.theme || _state.theme);
    Vue.set(_state, 'address', settings.address || _state.address);
  },
};

const actions = {
  loadSettings: ({ dispatch, commit }) => {
    const settingsContent = localStorage.getItem(SETTINGS_KEY);
    if (!settingsContent) return;

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
