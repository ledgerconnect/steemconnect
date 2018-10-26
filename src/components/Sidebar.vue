<template>
  <div class="nav" :class="{'nav--open': sidebarVisible}">
    <div class="p-4">
      <router-link
        to="/"
        @click.native="toggleSidebar"
      >
        <span id="logo" class="iconfont icon-diff-modified"/>
      </router-link>
    </div>
    <ul>
      <li v-if="!username" class="border-bottom">
        <router-link
          to="/login"
          class="py-2 px-4 d-block"
          @click.native="toggleSidebar"
        >
          Log in
        </router-link>
      </li>
      <li v-if="username" class="border-bottom">
        <router-link
          to="/"
          class="py-2 px-4 d-block"
          @click.native="toggleSidebar"
        >
          {{username}}
        </router-link>
      </li>
      <li v-if="username">
        <router-link
          to="/permissions"
          class="py-2 px-4 d-block"
          @click.native="toggleSidebar"
        >
          Permissions
        </router-link>
      </li>
      <li>
        <router-link
          to="/settings"
          class="py-2 px-4 d-block"
          @click.native="toggleSidebar"
        >
          Settings
        </router-link>
      </li>
      <li>
        <router-link
          to="/about"
          class="py-2 px-4 d-block"
          @click.native="toggleSidebar"
        >
          About
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    sidebarVisible() {
      return this.$store.state.ui.sidebarVisible;
    },
    username() {
      return this.$store.state.auth.username;
    },
  },
  methods: {
    ...mapActions(['toggleSidebarVisibility']),
    toggleSidebar() {
      if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1011px)')) {
        this.toggleSidebarVisibility();
      }
    },
  },
};
</script>

<style scoped lang="less">
@import '../vars';

#logo {
  font-size: 32px;
  color: @primary-color;
}

.nav {
  z-index: @sidebar-zindex;
  font-size: 17px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: -@sidebar-width;
  width: @sidebar-width;
  overflow: auto;
  background-color: @sidebar-bg-color;
  transition: left 0.3s;

  @media only screen and (min-width: 1012px) {
    left: 0 !important;
  }

  &--open {
    left: 0 !important;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;

    li {
      clear: both;
      border-color: #2f3136 !important;

      .router-link-exact-active {
        opacity: 1;
      }

      a {
        text-decoration: none;
        color: #f6f6f7;
        opacity: 0.3;
      }
    }
  }
}
</style>
