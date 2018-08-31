<template>
  <span
    class="avatar"
    :style="'background-image:url(https://steemitimages.com/u/' + username + '/avatar/small'"
  />
</template>

<script>
export default {
  props: ['username'],
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
}
</style>
