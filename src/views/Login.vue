<template>
  <div class="container-xs text-center">
    <router-link to="/">
      <span id="logo" class="octicon octicon-diff-modified mb-4"/>
    </router-link>
    <div class="width-full p-4 mb-6 Box">
      <form @submit.prevent="submitForm" method="post" class="text-left">
        <p>Steem username</p>
        <div
          v-if="dirty.username && !!errors.username"
          class="error mb-2"
        >
          {{ errors.username }}
        </div>
        <select
          v-model="username"
          class="form-select input-block mb-2"
          @blur="handleBlur('username')"
        >
          <option disabled value="">Please select one</option>
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
          v-model="key"
          type="password"
          class="form-control input-lg input-block mb-4"
          @blur="handleBlur('key')"
        />
        <button
          :disabled="submitDisabled || isLoading"
          type="submit"
          class="btn btn-large btn-blue input-block mb-2"
        >
          Log in
        </button>
        <router-link
          :to="`/create?${getRedirectQuery()}`"
          class="btn btn-large input-block ahref-btn mb-2"
        >
          Sign up instead
        </router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import triplesec from 'triplesec';
import { getKeychain } from '@/helpers/keychain';

export default {
  data() {
    return {
      keychain: {},
      dirty: {
        username: false,
        key: false,
      },
      username: '',
      key: '',
      isLoading: false,
    };
  },
  computed: {
    submitDisabled() {
      return !!this.errors.username || !!this.errors.key;
    },
    errors() {
      const current = {};

      const username = this.username.trim();
      const key = this.key.trim();

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
    ...mapActions([
      'login',
    ]),
    getRedirectQuery() {
      const { redirect } = this.$route.query;
      if (!redirect) return '';

      return `redirect=${redirect}`;
    },
    loadKeychain() {
      this.keychain = getKeychain();
    },
    handleBlur(name) {
      this.dirty[name] = true;
    },
    submitForm() {
      this.isLoading = true;

      const encryptedPassword = this.keychain[this.username];

      triplesec.decrypt({
        data: new triplesec.Buffer(encryptedPassword, 'hex'),
        key: new triplesec.Buffer(this.key),
      }, (decryptError, buff) => {
        if (decryptError) {
          this.isLoading = false;
          console.log('err', decryptError);
          return;
        }

        this.login({
          username: this.username,
          password: buff.toString(),
        }).then(() => {
          const { redirect } = this.$route.query;
          this.$router.push(redirect || '/market/SBD');
          this.isLoading = false;
        }).catch((err) => {
          console.log('Login failed', err);
        });
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
