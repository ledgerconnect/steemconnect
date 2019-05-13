<template>
  <div class="app-preview">
    <div class="mb-2">
      <Avatar :username="app" :size="60" />
    </div>
    {{ app }}
  </div>
</template>

<script>
export default {
  props: ['app'],
};
</script>

<style lang="less" scoped>
.app-preview {
  text-align: center;
}
</style>
