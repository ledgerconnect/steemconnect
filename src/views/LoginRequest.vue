<template>
  <div>
    <VueLoadingIndicator v-if="showLoading" class="overlay fixed big"/>
    <div v-else>
      <Header :title="`Log in request (${authority})`" />
      <div v-if="!failed" class="p-4 after-header">
        <div class="container-sm mx-auto">
          <div v-if="!failed && !signature">
            <div class="mb-4">
              <div class="mb-4 text-center" v-if="app && appProfile">
                <Avatar :username="app" :size="80"/>
                <div class="mt-2">
                  <h4 v-if="appProfile.name" class="mb-0">{{ appProfile.name }}</h4>
                  <span v-if="appProfile.website">{{ appProfile.website | parseUrl }}</span>
                </div>
              </div>
              <p>
                <span v-if="app">The app <b>{{app}}</b></span>
                <span v-else>This site </span>
                is requesting access to view your current account username.
              </p>
            </div>
            <div class="mb-4">
              <router-link
                :to="{ name: 'login', query: { redirect: this.$route.fullPath }}"
                class="btn btn-large mr-2 mb-2"
                v-if="!username"
              >
                Log in
              </router-link>
              <button
                type="submit"
                class="btn btn-large btn-success mr-2 mb-2"
                :disabled="loading"
                @click="handleSubmit"
                v-else
              >
                Sign
              </button>
              <button
                class="btn btn-large btn-danger mb-2"
                @click="handleReject"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 after-header" v-else>
        <div class="container-sm mx-auto flash flash-error mb-4">
          Oops, something went wrong. The log in request URL provided is invalid.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global chrome */
import { mapActions } from 'vuex';
import { isChromeExtension, isElectron } from '@/helpers/utils';
import client from '../helpers/client';

let openExternal = null;
if (typeof window !== 'undefined' && window.require) {
  // eslint-disable-next-line prefer-destructuring
  openExternal = window.require('electron').shell.openExternal;
}

const REQUEST_ID_PARAM = 'requestId';

function signComplete(requestId, err, res) {
  if (!isChromeExtension()) return;
  chrome.runtime.sendMessage({
    type: 'signComplete',
    payload: {
      requestId,
      args: [err, res],
    },
  });
}

export default {
  data() {
    return {
      showLoading: false,
      loading: false,
      failed: false,
      signature: null,
      errorMessage: '',
      requestId: this.$route.query[REQUEST_ID_PARAM],
      authority: this.$route.query.authority || 'posting',
      isChrome: isChromeExtension(),
      app: null,
      appProfile: {},
      callback: this.$route.query.redirect_uri,
      state: this.$route.query.state,
    };
  },
  computed: {
    username() {
      return this.$store.state.auth.username;
    },
  },
  mounted() {
    if (this.$route.params[0]) {
      this.loadAppProfile();
    }
  },
  methods: {
    ...mapActions(['signMessage']),
    async loadAppProfile() {
      this.showLoading = true;
      const app = this.$route.params[0];
      const accounts = await client.database.getAccounts([app]);
      if (accounts[0]) {
        this.app = app;
        try {
          this.appProfile = JSON.parse(accounts[0].json_metadata).profile;
          if (!isChromeExtension() && !this.appProfile.redirect_uris.includes(this.callback)) {
            this.failed = true;
          }
        } catch (e) {
          console.log('Failed to parse app account', e);
        }
      } else {
        this.failed = true;
      }
      this.showLoading = false;
    },
    async handleSubmit() {
      this.loading = true;
      this.showLoading = true;

      try {
        const loginObj = {
          timestamp: Math.floor(new Date().getTime() / 1000),
          type: 'login',
          app: this.app ? this.app : undefined,
        };
        const signedMessageObj = await this.signMessage({
          message: loginObj,
          authority: this.authority,
        });
        [this.signature] = signedMessageObj.signatures;
        const token = btoa(JSON.stringify(signedMessageObj));
        if (this.requestId) {
          signComplete(this.requestId, null, token);

          if (isChromeExtension()) {
            window.close();
          }
        }
        if (!isChromeExtension()) {
          let callback = `${this.callback}?access_token=${token}&username=${this.username}`;
          if (this.state) callback += `&state=${this.state}`;

          if (isElectron()) {
            openExternal(callback);
            this.$router.push('/');
          } else {
            window.location = callback;
          }
        }
      } catch (err) {
        console.error('Failed to log in', err);
        this.signature = '';
        this.failed = true;
        if (this.requestId) {
          signComplete(this.requestId, err, null);
        }
        if (isChromeExtension()) {
          window.close();
        }
        this.loading = false;
      }
    },
    handleReject() {
      const requestId = this.$route.query[REQUEST_ID_PARAM];
      if (requestId) {
        signComplete(requestId, 'Request canceled', null);
      }

      if (isChromeExtension()) {
        window.close();
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>
