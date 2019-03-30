<template>
  <div>
    <Header title="Authorize" />
    <div class="p-4 after-header">
      <div class="container-sm mx-auto">
        <OpenExternal v-if="isWeb && !failed && !transactionId" :uri="uri" />
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
              The account <b>{{ username }}</b> is requesting authorization to do
              <b>{{ authority }}</b> operations on your behalf.
            </p>
            <div class="flash flash-error mt-4" v-if="authority === 'active'">
              Giving active authority enables the authorized account to do fund transfers from your
              account, this should be used with utmost care.
            </div>
          </div>
          <button type="submit" class="btn btn-large btn-success mb-2 mt-2" :disabled="loading">
            Sign
          </button>
        </form>
        <div v-if="hasAuthority">
          <p class="mb-4">
            Your already authorize the account <b>{{ username }}</b> to do
            <b>{{ authority }}</b> operations on your behalf.
          </p>
          <a v-if="callback" :href="callback" class="btn btn-large btn-blue mb-2 mt-2">
            Continue to {{ callback | parseUrl }}
          </a>
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

export default {
  data() {
    return {
      loading: false,
      failed: false,
      error: false,
      transactionId: '',
      isWeb: isWeb(),
      username: this.$route.params.username,
      authority: ['posting', 'active'].includes(this.$route.query.authority)
        ? this.$route.query.authority
        : 'posting',
      callback: this.$route.query.redirect_uri,
      uri: `steem://authorize/${this.$route.params.username}${buildSearchParams(this.$route)}`,
    };
  },
  computed: {
    account() {
      return this.$store.state.auth.account;
    },
    hasAuthority() {
      const auths = this.account[this.authority].account_auths.map(auth => auth[0]);
      return auths.indexOf(this.username) !== -1;
    },
  },
  methods: {
    ...mapActions(['updateAccount']),
    handleSubmit() {
      const { username, authority, callback, account } = this;
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
          if (isWeb && callback) {
            window.location = callback;
          } else {
            this.transactionId = confirmation.id;
            this.failed = false;
            this.loading = false;
          }
        })
        .catch(err => {
          this.error = err;
          console.error('Failed to broadcast transaction', err);
          this.failed = true;
        });
    },
  },
};
</script>
