<template>
  <div class="container-xs text-center">
    <router-link to="/">
      <span id="logo" class="octicon octicon-diff-modified mb-4"/>
    </router-link>
    <div class="width-full p-4 mb-6 Box">
      <form
        @submit.prevent="submitForm"
        method="post"
        class="text-left"
      >
        <div v-if="step === 1">
          <label for="username">Steem username</label>
          <div
            v-if="dirty.username && !!errors.username"
            class="error mb-2"
          >
            {{ errors.username }}
          </div>
          <input
            key="username"
            v-model="username"
            id="username"
            type="text"
            class="form-control input-lg input-block mb-2"
            @blur="handleBlur('username')"
          />
          <label for="password">Steem password or active WIF</label>
          <div
            v-if="dirty.password && !!errors.password"
            class="error mb-2"
          >
            {{ errors.password }}
          </div>
          <input
            key="password"
            v-model="password"
            id="password"
            type="password"
            class="form-control input-lg input-block mb-2"
            @blur="handleBlur('password')"
          />
          <label class="mb-2" :class="{ 'mb-4': !error }">
            <input
              key="storeAccount"
              v-model="storeAccount"
              type="checkbox"
            > Keep the account on this computer
          </label>
          <div v-if="!!error" class="error mb-4">{{ error }}</div>
          <button
            :disabled="nextDisabled || isLoading"
            class="btn btn-large btn-blue input-block mb-2"
            @click.prevent="submitNext"
          >
            {{ nextText }}
          </button>
        </div>
        <div v-if="step === 2">
          <p>Encryption key</p>
          <div
            v-if="dirty.key && !!errors.key"
            class="error mb-2"
          >
            {{ errors.key }}
          </div>
          <input
            key="key"
            v-model="key"
            type="password"
            class="form-control input-lg input-block mb-2"
            @blur="handleBlur('key')"
          />
          <p>Confirm encryption key</p>
          <div
           v-if="dirty.keyConfirmation && !!errors.keyConfirmation"
           class="error mb-2"
          >
            {{ errors.keyConfirmation }}
          </div>
          <input
            key="keyConfirmation"
            v-model="keyConfirmation"
            type="password"
            class="form-control input-lg input-block mb-2"
            :class="{ 'mb-4': !error }"
            @blur="handleBlur('keyConfirmation')"
          />
          <div v-if="!!error" class="error mb-4">{{ error }}</div>
          <button
            :disabled="submitDisabled || isLoading"
            type="submit"
            class="btn btn-large btn-blue input-block mb-2"
          >
            Get started
          </button>
        </div>
        <router-link
          v-if="hasAccounts"
          :to="`/?${getRedirectQuery()}`"
          class="btn btn-large input-block ahref-btn mb-2"
        >
          Log in instead
        </router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import triplesec from 'triplesec';
import { credentialsValid, getKeys } from '@/helpers/auth';
import { addToKeychain, hasAccounts } from '@/helpers/keychain';
import { ERROR_INVALID_CREDENTIALS } from '@/helpers/messages';

export default {
  data() {
    return {
      step: 1,
      dirty: {
        username: false,
        password: false,
        key: false,
        keyConfirmation: false,
      },
      username: '',
      password: '',
      key: '',
      keyConfirmation: '',
      error: '',
      storeAccount: true,
      isLoading: false,
    };
  },
  computed: {
    hasAccounts() {
      return hasAccounts();
    },
    values() {
      return {
        username: this.username.trim(),
        password: this.password.trim(),
        key: this.key.trim(),
        keyConfirmation: this.keyConfirmation.trim(),
      };
    },
    errors() {
      const current = {};

      const {
        username,
        password,
        key,
        keyConfirmation,
      } = this.values;

      if (!username) {
        current.username = 'Username is required.';
      }

      if (!password) {
        current.password = 'Password is required.';
      }

      if (!key) {
        current.key = 'Encryption key is required.';
      }

      if (!keyConfirmation) {
        current.keyConfirmation = 'Encryption key confirmation is required.';
      } else if (keyConfirmation !== key) {
        current.keyConfirmation = 'Encryption keys do not match.';
      }

      return current;
    },
    nextText() {
      return this.storeAccount ? 'Continue' : 'Get started';
    },
    nextDisabled() {
      return !!this.errors.username || !!this.errors.password;
    },
    submitDisabled() {
      return !!this.errors.key || !!this.errors.keyConfirmation;
    },
  },
  methods: {
    ...mapActions([
      'login',
    ]),
    getRedirectQuery() {
      const { redirect } = this.$route.query;
      if (!redirect) return '';

      return `redirect=${redirect}`;
    },
    handleBlur(name) {
      this.dirty[name] = true;
    },
    async startLogin() {
      this.isLoading = true;

      const { username, password } = this.values;
      const keys = await getKeys(username, password);

      this.login({ username, keys }).then(() => {
        const { redirect } = this.$route.query;
        this.$router.push(redirect || '/market/SBD');
        this.isLoading = false;
        this.error = '';
      }).catch((err) => {
        this.error = ERROR_INVALID_CREDENTIALS;
        console.log('Login failed', err);
      });
    },
    async submitNext() {
      const { username, password } = this.values;

      this.isLoading = true;

      const invalidCredentials = !(await credentialsValid(username, password));

      this.isLoading = false;

      if (invalidCredentials) {
        this.error = ERROR_INVALID_CREDENTIALS;
        return;
      }

      this.error = '';

      if (this.storeAccount) {
        this.step += 1;
      } else {
        this.startLogin();
      }
    },
    async submitForm() {
      const { username, password, key } = this.values;

      this.isLoading = true;

      const keys = await getKeys(username, password);

      triplesec.encrypt({
        data: new triplesec.Buffer(JSON.stringify(keys)),
        key: new triplesec.Buffer(key),
      }, (encryptError, buff) => {
        if (encryptError) {
          this.isLoading = false;
          console.log('err', encryptError);
          return;
        }

        addToKeychain(username, buff.toString('hex'));

        this.startLogin();
      });
    },
  },
};
</script>

<style scoped lang="less">
@import '../vars';

#logo {
  font-size: 64px;
  color: @primary-color;
}

.ahref-btn {
  text-align: center;
}

.error {
  color: @error-color;
}
</style>
