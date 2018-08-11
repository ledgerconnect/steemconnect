<template>
  <div class="container-xs text-center">
    <h2>Welcome on SteemDEX</h2>
    <router-link
      :to="`/create?${getRedirectQuery()}`"
      class="btn btn-large btn-blue input-block mb-2"
    >
      Click here to get started
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
