<template>
  <div>
    <Header title="steemconnect" />
    <div class="p-4 after-header">
      <div v-if="username" class="container-sm mx-auto pt-4 text-center">
        <div class="mb-3">
          <Avatar :username="username" :size="80"/>
          <h4>{{ username }}</h4>
        </div>
        <p>Your account is unlocked, ready to sign transaction(s).</p>
        <p>
          <router-link to="/login">
            Switch account
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: this.$store.state.auth.username,
    };
  },
};
</script>
