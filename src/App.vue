<template>
  <div
    id="app"
    :class="{
      'app--extension': isExtension,
      'app--extension--light': isExtensionLight
    }"
    v-show="initialized"
  >
    <div
      class="d-flex flex-row flex-items-center height-full"
      v-if="isLight"
    >
      <router-view/>
    </div>
    <div class="d-flex flex-row" v-else>
      <Sidebar/>
      <div class="content width-full ml-sm-0" :class="{'content--nav-open': sidebarVisible}">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import { isChromeExtension } from '@/helpers/utils';

export default {
  data() {
    return {
      initialized: false,
    };
  },
  computed: {
    isLight() {
      return this.$route.meta.layout === 'light';
    },
    isExtension() {
      return isChromeExtension();
    },
    isExtensionLight() {
      return isChromeExtension() && this.isLight;
    },
    sidebarVisible() {
      return this.$store.state.ui.sidebarVisible;
    },
  },
  beforeUpdate() {
    if (this.initialized) return;

    this.initialized = true;
  },
};
</script>

<style scoped lang="less">
@import './vars';

.content {
  position: relative;
  left: 0;
  transition: left 0.3s;

  @media only screen and (min-width: 1012px) {
    margin-left: @sidebar-width !important;
  }

  @media only screen and (max-width: 1011px) {
    &--nav-open {
      left: @sidebar-width;
    }
  }
}
</style>
