<template>
  <div>
    <Header title="Authorize (active)" />
    <div class="p-4 after-header">
      <div class="container-sm mx-auto">
        <OpenExternal v-if="!hasAuthority && isWeb && !failed && !transactionId" :uri="uri" />
        <form
          v-if="!hasAuthority && !failed && !transactionId"
          @submit.prevent="handleSubmit"
          class="mb-4"
        >
          <div class="mb-4">
            <div class="mb-4 text-center" v-if="username">
              <Avatar :username="username" :size="80" />
              <h4 class="mb-0 mt-2">{{ username }}</h4>
            </div>
            <p>
              Do you want to update your account to authorize <b>{{ username }}</b> to do
              <b>{{ authority }}</b> operations on your behalf?
            </p>
            <div class="flash flash-error mt-4" v-if="authority === 'active'">
              Giving active authority enables the authorized account to do fund transfers from your
              account, this should be used with utmost care.
            </div>
            <div class="flash flash-warn mt-4" v-if="account.name && hasRequiredKey === false">
              This transaction require your <b>active</b> key.
            </div>
          </div>
          <div class="mt-2">
            <router-link
              :to="{
                name: 'login',
                query: { redirect: this.$route.fullPath, authority: 'active' },
              }"
              class="btn btn-large mr-2 mb-2"
              v-if="!account.name || hasRequiredKey === false"
            >
              Log in
            </router-link>
            <button
              type="submit"
              class="btn btn-large btn-success mb-2 mr-2"
              :disabled="loading"
              v-else
            >
              Authorize
            </button>
            <button class="btn btn-large btn-danger mb-2" @click="handleReject">
              Cancel
            </button>
          </div>
        </form>
        <div v-if="hasAuthority && !failed && !transactionId">
          <p class="mb-4">
            You already authorize the account <b>{{ username }}</b> to do
            <b>{{ authority }}</b> operations on your behalf.
          </p>
          <template v-if="callback">
            <router-link
              v-if="callback[0] === '/'"
              :to="callback"
              class="btn btn-large btn-blue mb-2 mt-2"
            >
              Continue
            </router-link>
            <a v-else :href="callback" class="btn btn-large btn-blue mb-2 mt-2">
              Continue to {{ callback | parseUrl }}
            </a>
          </template>
        </div>
        <Error v-if="!loading && failed" :error="error" />
        <Confirmation v-if="!loading && !!transactionId" :id="transactionId" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { isWeb, buildSearchParams } from '@/helpers/utils';
import { getAuthority } from '@/helpers/auth';

export default {
  data() {
    return {
      loading: false,
      failed: false,
      error: false,
      transactionId: '',
      isWeb: isWeb(),
      username: this.$route.params.username,
      authority: getAuthority(this.$route.query.authority, 'posting'),
      callback: this.$route.query.redirect_uri,
      uri: `steem://authorize/${this.$route.params.username}${buildSearchParams(this.$route)}`,
    };
  },
  computed: {
    account() {
      return this.$store.state.auth.account;
    },
    hasAuthority() {
      if (this.account.name) {
        const auths = this.account[this.authority].account_auths.map(auth => auth[0]);
        return auths.indexOf(this.username) !== -1;
      }
      return false;
    },
    hasRequiredKey() {
      return !!(this.$store.state.auth.username && this.$store.state.auth.keys.active);
    },
  },
  methods: {
    ...mapActions(['updateAccount', 'loadAccount']),
    handleSubmit() {
      const { username, authority, callback, account } = this;
      this.loading = true;
      const data = {
        account: account.name,
        memo_key: account.memo_key,
        json_metadata: account.json_metadata,
      };
      data[authority] = JSON.parse(JSON.stringify(account[authority]));
      data[authority].account_auths.push([username, account[authority].weight_threshold]);
      data[authority].account_auths.sort((a, b) => (a[0] > b[0] ? 1 : -1));

      this.updateAccount(data)
        .then(confirmation => {
          this.loadAccount().then(() => {
            if (isWeb && callback) {
              if (callback[0] === '/') {
                this.$router.push(callback);
              } else {
                window.location = callback;
              }
            } else {
              this.transactionId = confirmation.id;
              this.failed = false;
              this.loading = false;
            }
          });
        })
        .catch(err => {
          this.error = err;
          console.error('Failed to broadcast transaction', err);
          this.failed = true;
          this.loading = false;
        });
    },
    handleReject() {
      this.$router.push('/');
    },
  },
};
</script>
