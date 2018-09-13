<template>
  <span
    class="avatar"
    :class="'avatar-' + sizeValue"
    :style="'background-image:url(https://steemitimages.com/u/' + username + '/avatar/' + sizeValue"
  />
</template>

<script>
export default {
  props: ['username', 'size'],
  data() {
    return {
      sizeValue: this.size || 'small',
    };
  },
};
</script>

<style scoped lang="less">
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;

  &.avatar-medium {
    width: 64px;
    height: 64px;
    border-radius: 2px;
  }
}
</style>
