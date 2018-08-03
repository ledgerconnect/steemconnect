<template>
  <div class="container-xs text-center">
    <span id="logo" class="octicon octicon-diff-modified mb-4"/>
    <div class="width-full p-4 mb-6 Box">
      <form
        @submit="submitForm"
        @change="checkForm"
        method="post"
        class="text-left"
      >
        <p>Username</p>
        <input
          v-model="username"
          name="to"
          type="text"
          class="form-control input-lg input-block mb-4"
        />
        <button
          :disabled="isLoading"
          type="submit"
          class="btn btn-large btn-blue input-block">
          Log in
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      errors: [],
      username: 'hellosteem',
      password: null,
      isLoading: false,
    };
  },
  methods: {
    ...mapActions([
      'login',
    ]),
    checkForm() {
      this.errors = [];
    },
    submitForm(e) {
      e.preventDefault();
      this.isLoading = true;
      this.login(this.username, this.password).then(() => {
        const { redirect } = this.$route.query;
        this.$router.push(redirect || '/');
      }).catch((err) => {
        console.log('Login failed', err);
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
</style>
