<template>
  <div id="topnav" class="border-bottom py-2 px-4 text-right">
    <Avatar :username="username"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    username() {
      return this.$store.state.auth.username;
    },
  },
  methods: mapActions([
    'login',
  ]),
};
</script>

<style scoped lang="less">
@import '../vars';

#topnav {
  font-size: 18px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: @topnav-height;
  background-color: @bg-color;

  @media (min-width: 768px){
    left: @sidebar-width !important;
  }

  ul {
    list-style: none;

    li {
      display: inline-block;
    }
  }
}
</style>
