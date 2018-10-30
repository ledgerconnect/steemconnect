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
  position: fixed;
  z-index: 100;
  top: 0;
  width: 100%;
  height: @header-height;
  background-color: @header-bg;
  display: flex;
  align-items: center;
  transition: width 0.3s;

  @media @bp-small {
    position: relative;
  }

  & > button {
    line-height: 22px;
    background: none;
    border: none;
    outline: none;

    @media @bp-small {
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
