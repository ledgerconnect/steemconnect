<template>
  <div id="app" :class="{ 'app--extension': isExtension }">
    <template v-if="loaded">
      <Sidebar v-if="showSidebar"/>
      <router-view
        class="height-full"
        :class="{'content': showSidebar, 'content--nav-open': sidebarVisible}"
      />
    </template>
    <VueLoadingIndicator v-else-if="showLoading" class="overlay fixed primary big"/>
  </div>
</template>

<script>
import { isChromeExtension } from '@/helpers/utils';

const LOADING_ICON_TIMEOUT = 300;

export default {
  data() {
    return {
      initialized: false,
      showLoading: false,
    };
  },
  computed: {
    loaded() {
      return !!this.$store.state.settings.properties.head_block_number;
    },
    showSidebar() {
      return !this.$route.meta.hideSidebar && this.initialized;
    },
    isExtension() {
      return isChromeExtension();
    },
    sidebarVisible() {
      return this.$store.state.ui.sidebarVisible;
    },
  },
  created() {
    const loadingTimeout = setTimeout(() => {
      this.showLoading = true;
    }, LOADING_ICON_TIMEOUT);

    this.$store.dispatch('getDynamicGlobalProperties').then(() => {
      clearTimeout(loadingTimeout);

      this.showLoading = false;
    });
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
