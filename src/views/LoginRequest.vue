<template>
  <div>
    <VueLoadingIndicator v-if="showLoading" class="overlay fixed big" />
    <div v-else>
      <Header :title="`Log in request (${authority})`" />
      <div v-if="!failed" class="p-4 after-header">
        <div class="container-sm mx-auto">
          <OpenExternal v-if="isWeb && !failed && !signature" :uri="uri" />
          <div v-if="!failed && !signature">
            <div class="mb-4">
              <div class="mb-4 text-center" v-if="app && appProfile">
                <Avatar :username="app" :size="80" />
                <div class="mt-2">
                  <h4 v-if="appProfile.name" class="mb-0">{{ appProfile.name }}</h4>
                  <span v-if="appProfile.website">{{ appProfile.website | parseUrl }}</span>
                </div>
              </div>
              <p>
                <span v-if="app"
                  >The app <b>{{ app }}</b></span
                >
                <span v-else>This site </span>
                is requesting access to view your current account username.
              </p>
            </div>
            <div class="mb-4">
              <router-link
                :to="{ name: 'login', query: { redirect: this.$route.fullPath } }"
                class="btn btn-large btn-blue mr-2 mb-2"
                v-if="!username"
              >
                Continue
              </router-link>
              <button
                type="submit"
                class="btn btn-large btn-success mr-2 mb-2"
                :disabled="loading"
                @click="handleSubmit"
                v-else
              >
                Log in
              </button>
              <button class="btn btn-large mb-2" @click="handleReject">
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
import { mapActions } from 'vuex';
import client from '@/helpers/client';
import {
  isWeb,
  isChromeExtension,
  isElectron,
  buildSearchParams,
  signComplete,
  isValidUrl,
  REQUEST_ID_PARAM,
  b64uEnc,
} from '@/helpers/utils';
import { getAuthority } from '@/helpers/auth';

let openExternal = null;
if (typeof window !== 'undefined' && window.require) {
  // eslint-disable-next-line prefer-destructuring
  openExternal = window.require('electron').shell.openExternal;
}

export default {
  data() {
    return {
      showLoading: false,
      loading: false,
      failed: false,
      signature: null,
      errorMessage: '',
      isWeb: isWeb(),
      requestId: this.$route.query[REQUEST_ID_PARAM],
      authority: getAuthority(this.$route.query.authority, 'posting'),
      isChrome: isChromeExtension(),
      clientId: this.$route.params.clientId || this.$route.query.client_id,
      app: null,
      appProfile: {},
      callback: this.$route.query.redirect_uri,
      responseType: ['code', 'token'].includes(this.$route.query.response_type)
        ? this.$route.query.response_type
        : 'token',
      state: this.$route.query.state,
      scope: ['login', 'posting'].includes(this.$route.query.scope)
        ? this.$route.query.scope
        : 'login',
      uri: `steem://login-request/${this.$route.params.clientId}${buildSearchParams(this.$route)}`,
    };
  },
  computed: {
    username() {
      return this.$store.state.auth.username;
    },
    account() {
      return this.$store.state.auth.account;
    },
    hasAuthority() {
      const auths = this.account.posting.account_auths.map(auth => auth[0]);
      return auths.indexOf(this.clientId) !== -1;
    },
  },
  mounted() {
    if (
      this.scope === 'posting' &&
      !isChromeExtension() &&
      this.clientId &&
      this.username &&
      !this.hasAuthority
    ) {
      this.$router.push({
        name: 'authorize',
        params: { username: this.clientId },
        query: { redirect_uri: this.uri.replace('steem:/', '') },
      });
    } else if (this.clientId) {
      this.loadAppProfile();
    }
  },
  methods: {
    ...mapActions(['signMessage']),
    async loadAppProfile() {
      this.showLoading = true;
      const app = this.clientId;
      const accounts = await client.database.getAccounts([app]);
      if (accounts[0]) {
        this.app = app;
        try {
          this.appProfile = JSON.parse(accounts[0].json_metadata).profile;
          if (
            !isChromeExtension() &&
            (!this.appProfile.redirect_uris.includes(this.callback) || !isValidUrl(this.callback))
          ) {
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
        const loginObj = {};
        loginObj.type = isChromeExtension() ? 'login' : this.scope;
        if (this.responseType === 'code') loginObj.type = 'code';
        if (this.app) loginObj.app = this.app;
        const signedMessageObj = await this.signMessage({
          message: loginObj,
          authority: this.authority,
        });
        [this.signature] = signedMessageObj.signatures;
        const token = b64uEnc(JSON.stringify(signedMessageObj));
        if (this.requestId) {
          signComplete(this.requestId, null, token);
        }
        if (!isChromeExtension()) {
          let { callback } = this;
          callback += this.responseType === 'code' ? `?code=${token}` : `?access_token=${token}`;
          callback += `&username=${this.username}`;
          if (this.responseType !== 'code') callback += '&expires_in=604800';
          if (this.state) callback += `&state=${encodeURIComponent(this.state)}`;

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
        this.loading = false;
      }
    },
    handleReject() {
      const requestId = this.$route.query[REQUEST_ID_PARAM];
      if (requestId) {
        signComplete(requestId, 'Request canceled', null);
      }
      if (!isChromeExtension()) {
        this.$router.push('/');
      }
    },
  },
};
</script>
