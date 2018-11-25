<template>
  <div class="container-xs text-center">
    <router-link
      to="/"
      class="logo-lg iconfont icon-steemconnect d-inline-block my-2"
    />
    <div class="width-full p-4 mb-2">
      <form @submit.prevent="submitForm" method="post" class="text-left">
        <p>Steem username</p>
        <div
          v-if="dirty.username && !!errors.username"
          class="error mb-2"
        >
          {{ errors.username }}
        </div>
        <select
          v-model.trim="username"
          class="form-select input-block mb-2"
          autocorrect="off"
          autocapitalize="none"
          @blur="handleBlur('username')"
        >
          <option
            v-for="user in Object.keys(keychain)"
            :key="user"
            :value="user"
          >
            {{ user }}
          </option>
        </select>
        <p>Encryption key</p>
        <div
          v-if="dirty.key && !!errors.key"
          class="error mb-2"
        >
          {{ errors.key }}
        </div>
        <input
          v-model.trim="key"
          type="password"
          class="form-control input-lg input-block mb-2"
          :class="{ 'mb-4': !error }"
          @blur="handleBlur('key')"
        />
        <div v-if="!!error" class="error mb-4">{{ error }}</div>
        <button
          :disabled="submitDisabled || isLoading"
          type="submit"
          class="btn btn-large btn-blue input-block mb-2"
        >
          Log in
        </button>
        <router-link
          :to="{ name: 'import', query: { redirect: getRedirectQuery() }}"
          class="btn btn-large input-block text-center mb-2"
        >
          Import account
        </router-link>
      </form>
    </div>
    <Footer/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import triplesec from 'triplesec';
import { getKeychain } from '@/helpers/keychain';
import { jsonParse } from '@/helpers/utils';
import { ERROR_INVALID_CREDENTIALS, ERROR_INVALID_ENCRYPTION_KEY } from '@/helpers/messages';

export default {
  data() {
    return {
      keychain: {},
      dirty: {
        username: false,
        key: false,
      },
      error: '',
      isLoading: false,
    };
  },
  computed: {
    username: {
      get() {
        return this.$store.state.persistentForms.login.username;
      },
      set(value) {
        this.$store.commit('saveLoginUsername', value);
      },
    },
    key: {
      get() {
        return this.$store.state.persistentForms.login.key;
      },
      set(value) {
        this.$store.commit('saveLoginKey', value);
      },
    },
    submitDisabled() {
      return !!this.errors.username || !!this.errors.key;
    },
    errors() {
      const current = {};

      const { username, key } = this;

      if (!username) {
        current.username = 'Username is required.';
      }

      if (!key) {
        current.key = 'Encryption key is required.';
      }

      return current;
    },
  },
  created() {
    this.loadKeychain();
  },
  methods: {
    ...mapActions(['login']),
    resetForm() {
      this.dirty = {
        username: false,
        key: false,
      };

      this.username = '';
      this.key = '';
    },
    getRedirectQuery() {
      const { redirect } = this.$route.query;
      return redirect;
    },
    loadKeychain() {
      this.keychain = getKeychain();

      const usernames = Object.keys(this.keychain);

      if (usernames.length > 0) {
        [this.username] = usernames;
      }
    },
    handleBlur(name) {
      this.dirty[name] = true;
    },
    submitForm() {
      this.isLoading = true;

      const encryptedKeys = this.keychain[this.username];

      triplesec.decrypt(
        {
          data: new triplesec.Buffer(encryptedKeys, 'hex'),
          key: new triplesec.Buffer(this.key),
        },
        (decryptError, buff) => {
          if (decryptError) {
            this.isLoading = false;
            this.error = ERROR_INVALID_ENCRYPTION_KEY;

            console.log('err', decryptError);
            return;
          }

          this.login({
            username: this.username,
            keys: jsonParse(buff.toString()),
          })
            .then(() => {
              const { redirect } = this.$route.query;
              this.$router.push(redirect || '/');
              this.isLoading = false;
              this.error = '';

              this.resetForm();
            })
            .catch(err => {
              console.log('Login failed', err);
              this.isLoading = false;
              this.error = ERROR_INVALID_CREDENTIALS;
            });
        },
      );
    },
  },
};
</script>
