<template>
  <Center>
    <router-link to="/" class="d-inline-block my-2 no-decoration">
      <span class="logo iconfont icon-steemconnect" />
      <h4 class="m-0">steemconnect</h4>
    </router-link>
    <div class="width-full p-4 mb-2">
      <form @submit.prevent="submitForm" method="post" class="text-left">
        <div v-if="step === 1">
          <label for="username">Steem username</label>
          <div v-if="dirty.username && !!errors.username" class="error mb-2">
            {{ errors.username }}
          </div>
          <input
            key="username"
            v-model.trim="username"
            id="username"
            type="text"
            class="form-control input-lg input-block mb-2"
            autocorrect="off"
            autocapitalize="none"
            @blur="handleBlur('username')"
          />
          <label for="password">Steem password or private key</label>
          <div v-if="dirty.password && !!errors.password" class="error mb-2">
            {{ errors.password }}
          </div>
          <input
            key="password"
            v-model.trim="password"
            id="password"
            type="password"
            class="form-control input-lg input-block mb-2"
            @blur="handleBlur('password')"
          />
          <label class="mb-2" :class="{ 'mb-4': !error }">
            <input key="storeAccount" v-model="storeAccount" type="checkbox" /> Keep the account on
            this computer
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
          <label for="key">Encryption key</label>
          <div v-if="dirty.key && !!errors.key" class="error mb-2">
            {{ errors.key }}
          </div>
          <input
            key="key"
            id="key"
            v-model.trim="key"
            type="password"
            class="form-control input-lg input-block mb-2"
            @blur="handleBlur('key')"
          />
          <label for="key-confirmation">Confirm encryption key</label>
          <div v-if="dirty.keyConfirmation && !!errors.keyConfirmation" class="error mb-2">
            {{ errors.keyConfirmation }}
          </div>
          <input
            key="keyConfirmation"
            id="key-confirmation"
            v-model.trim="keyConfirmation"
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
          :to="{ name: 'login', query: { redirect: getRedirectQuery() } }"
          class="btn btn-large input-block text-center mb-2"
        >
          Log in instead
        </router-link>
      </form>
    </div>
    <Footer />
  </Center>
</template>

<script>
import { mapActions } from 'vuex';
import triplesec from 'triplesec';
import PasswordValidator from 'password-validator';
import { credentialsValid, getKeys } from '@/helpers/auth';
import { addToKeychain, hasAccounts } from '@/helpers/keychain';
import { ERROR_INVALID_CREDENTIALS } from '@/helpers/messages';

const passphraseSchema = new PasswordValidator();

passphraseSchema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .symbols();

export default {
  data() {
    return {
      dirty: {
        username: false,
        password: false,
        key: false,
        keyConfirmation: false,
      },
      error: '',
      storeAccount: true,
      isLoading: false,
    };
  },
  computed: {
    step: {
      get() {
        return this.$store.state.persistentForms.import.step;
      },
      set(value) {
        this.$store.commit('saveImportStep', value);
      },
    },
    username: {
      get() {
        return this.$store.state.persistentForms.import.username;
      },
      set(value) {
        this.$store.commit('saveImportUsername', value);
      },
    },
    password: {
      get() {
        return this.$store.state.persistentForms.import.password;
      },
      set(value) {
        this.$store.commit('saveImportPassword', value);
      },
    },
    key: {
      get() {
        return this.$store.state.persistentForms.import.key;
      },
      set(value) {
        this.$store.commit('saveImportKey', value);
      },
    },
    keyConfirmation: {
      get() {
        return this.$store.state.persistentForms.import.keyConfirmation;
      },
      set(value) {
        this.$store.commit('saveImportKeyConfirmation', value);
      },
    },
    hasAccounts() {
      return hasAccounts();
    },
    errors() {
      const current = {};

      const { username, password, key, keyConfirmation } = this;

      if (!username) {
        current.username = 'Username is required.';
      }

      if (!password) {
        current.password = 'Password is required.';
      }

      if (!key) {
        current.key = 'Encryption key is required.';
      } else if (!passphraseSchema.validate(key)) {
        current.key =
          'Encryption key has to be at least 8 characters long and contain lowercase letter, uppercase letter, and a symbol.';
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
    ...mapActions(['login']),
    resetForm() {
      this.dirty = {
        username: false,
        password: false,
        key: false,
        keyConfirmation: false,
      };

      this.step = 1;
      this.username = '';
      this.password = '';
      this.key = '';
      this.keyConfirmation = '';
    },
    getRedirectQuery() {
      const { redirect } = this.$route.query;
      return redirect;
    },
    handleBlur(name) {
      this.dirty[name] = true;
    },
    async startLogin() {
      this.isLoading = true;

      const { username, password } = this;
      const keys = await getKeys(username, password);

      this.login({ username, keys })
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
    async submitNext() {
      const { username, password } = this;

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
      const { username, password, key } = this;

      this.isLoading = true;

      const keys = await getKeys(username, password);

      triplesec.encrypt(
        {
          data: new triplesec.Buffer(JSON.stringify(keys)),
          key: new triplesec.Buffer(key),
        },
        (encryptError, buff) => {
          if (encryptError) {
            this.isLoading = false;
            console.log('err', encryptError);
            return;
          }

          addToKeychain(username, buff.toString('hex'));

          this.startLogin();
        },
      );
    },
  },
};
</script>
