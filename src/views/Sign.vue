<template>
  <div>
    <Header title="New unsigned transaction" />
    <div v-if="parsed && uriIsValid" class="p-4 after-header">
      <div class="container-sm mx-0">
        <div v-if="isWeb && !failed && !transactionId" class="flash mb-4 overflow-hidden">
          <div class="mb-3">
            We recommend you to use the SteemConnect desktop app.
            If you don't have this, you can download it from the
            <a href="https://steemconnect.com" target="_blank">official site</a>.
          </div>
          <button class="btn btn-blue" @click="openUriScheme">
            Open desktop app
          </button>
        </div>
        <div v-if="!loading && failed" class="flash flash-error mb-4">
          Oops, something went wrong.
          <span v-if="errorMessage">
            Here is the error message:
            <br/><b>"{{ errorMessage }}"</b>
          </span>
          <span v-else>Please try again later.</span>
        </div>
        <Confirmation v-if="!loading && !!transactionId" :id="transactionId" />
        <div v-if="!failed && !transactionId">
          <div v-for="(operation, key) in parsed.tx.operations" :key="key" class="mb-4">
            <div class="Box">
              <OperationHeader :operation="operation[0]"/>
              <div class="Box-row">
                <div v-for="(value, key) in operation[1]" :key="key">
                  <p>
                    <b class="form-label">{{ key }}</b>
                    <OperationValue :value="value"/>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flash flash-warn mb-4" v-if="parsed.params.callback">
            You are going to get redirected to
            <span class="link-color">{{ parsed.params.callback | parseUrl }}</span>.
          </div>
          <div class="mb-4">
            <router-link
              :to="{ name: 'login', query: { redirect: this.uri.replace('steem://', '') }}"
              class="btn btn-large mr-2 mb-2"
              v-if="!username"
            >
              Log in
            </router-link>
            <button
              type="submit"
              class="btn btn-large btn-primary mr-2 mb-2"
              :disabled="loading"
              @click="handleSubmit"
              v-else
            >
              {{ parsed.params.no_broadcast ? 'Sign' : 'Approve' }}
            </button>
            <button
              class="btn btn-large btn-danger mb-2"
              @click="handleReject"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 after-header" v-else>
      <div class="container-sm mx-0 flash flash-error mb-4">
        Oops, something went wrong. The signing URL provided is invalid.
      </div>
    </div>
  </div>
</template>

<script>
import * as steemuri from 'steem-uri';
import { mapActions } from 'vuex';
import { resolveTransaction, legacyUriToParsedSteemUri } from '@/helpers/client';
import { isWeb, getErrorMessage } from '@/helpers/utils';

export default {
  data() {
    return {
      parsed: null,
      uriIsValid: true,
      loading: false,
      transactionId: '',
      failed: false,
      errorMessage: '',
      isWeb: isWeb(),
      uri: `steem://sign/${this.$route.params[0]}${window.location.search}`,
    };
  },
  computed: {
    username() {
      return this.$store.state.auth.username;
    },
  },
  mounted() {
    this.parseUri(this.uri);
  },
  methods: {
    ...mapActions(['sign', 'broadcast']),
    parseUri(uri) {
      let parsed;
      try {
        parsed = steemuri.decode(uri);
      } catch (err) {
        console.error('Failed to decode URI', err);
        parsed = legacyUriToParsedSteemUri(uri);
        if (!parsed) {
          this.uriIsValid = false;
        }
      }

      this.parsed = parsed;
    },
    openUriScheme() {
      document.location = this.uri;
    },
    async handleSubmit() {
      this.loading = true;
      let sig = null;
      let tx = null;
      let signedTx = null;
      let confirmation = null;

      try {
        tx = await resolveTransaction(this.parsed, this.$store.state.auth.username);
        signedTx = await this.sign(tx);
        [sig] = signedTx.signatures;
      } catch (err) {
        console.error('Failed to resolve and sign transaction', err);
      }

      if (!sig) {
        this.transactionId = '';
        this.failed = true;
        this.loading = false;
        return;
      }

      if (!this.parsed.params.no_broadcast) {
        try {
          confirmation = await this.broadcast(signedTx);
          this.transactionId = confirmation.id;
          this.failed = false;
        } catch (err) {
          this.errorMessage = getErrorMessage(err);
          console.error('Failed to broadcast transaction', err);
          this.transactionId = '';
          this.failed = true;
        }
      }

      // redirect to the callback if set
      if (this.parsed.params.callback) {
        window.location = steemuri.resolveCallback(this.parsed.params.callback, {
          sig,
          id: confirmation.id || undefined,
          block: confirmation.block_num || undefined,
          txn: confirmation.txn_num || undefined,
        });
      } else {
        this.loading = false;
      }
    },
    handleReject() {
      this.$router.push({ name: 'settings' });
    },
  },
};
</script>
