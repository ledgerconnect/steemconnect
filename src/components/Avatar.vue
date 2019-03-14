<template>
  <span
    class="avatar"
    :style="{
      'background-image': `url(https://steemitimages.com/u/${username}/avatar/small`,
      width: `${this.size}px`,
      height: `${this.size}px`,
    }"
  />
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 32,
    },
  },
};
</script>

<style scoped lang="less">
@import '../vars';

.avatar {
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: @border-color;

  &.avatar-medium {
    width: 64px;
    height: 64px;
    border-radius: 2px;
  }
}
</style>
