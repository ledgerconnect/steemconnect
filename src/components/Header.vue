<template>
  <div class="header border-bottom">
    <button class="px-4 py-3 border-right" @click="toggleSidebarVisibility">
      <span class="iconfont icon-three-bars"/>
    </button>
    <slot>
      <h5>{{ title }}</h5>
    </slot>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    title: {
      type: String,
    },
  },
  methods: mapActions(['toggleSidebarVisibility']),
};
</script>

<style lang="less" scoped>
@import (reference) '../vars';

.header {
  display: flex;
  height: 56px;
  align-items: center;
  transition: width 0.3s;

  & > button {
    line-height: 22px;
    background: none;
    border: none;
    outline: none;

    @media only screen and (min-width: 1012px) {
      display: none;
    }

    & > .iconfont {
      color: @border-color !important;
      font-size: 20px;
    }
  }

  & > h5 {
    margin: 0 0 0 16px;
  }

}
</style>
