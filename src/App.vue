<template>
  <div
    id="app"
    :class="{ 'app--extension': isExtension }"
    v-show="initialized"
  >
    <Sidebar v-if="showSidebar" />
    <router-view class="height-full" :class="{'content': showSidebar, 'content--nav-open': sidebarVisible}" />
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
    showSidebar() {
      return !this.$route.meta.hideSidebar;
    },
    isExtension() {
      return isChromeExtension();
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

  @media @bp-small {
    margin-left: @sidebar-width !important;
  }

  &--nav-open {
    left: @sidebar-width;

    @media @bp-small {
      left: 0;
    }
  }
}
</style>
