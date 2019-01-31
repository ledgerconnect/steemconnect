<template>
  <div>
    <Header title="steemconnect" />
    <div v-if="username" class="p-4 after-header pt-6 text-center">
      <span class="iconfont icon-zap"/>
      <h2 class="m-0 mb-4">Ready</h2>
      <p>Your account <b>{{ username }}</b> is unlocked, ready to sign transaction(s).</p>
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

<style scoped lang="less">
@import '../vars';

.icon-zap {
  font-size: 64px;
  color: @primary-color;
}
</style>
