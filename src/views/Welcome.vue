<template>
  <div class="container-xs text-center">
    <router-link to="/">
      <span id="logo" class="octicon octicon-diff-modified mb-4"/>
    </router-link>
    <h2>Welcome on SteemDEX</h2>
    <router-link
      :to="`/create?${getRedirectQuery()}`"
      class="btn btn-large btn-blue input-block mb-2"
    >
    Get started
    </router-link>
  </div>
</template>

<script>
export default {
  methods: {
    getRedirectQuery() {
      const { redirect } = this.$route.query;
      if (!redirect) return '';

      return `redirect=${redirect}`;
    },
  },
};
</script>

<style scoped lang="less">
@import '../vars';

#logo {
  font-size: 124px;
  color: @primary-color;
}
</style>
