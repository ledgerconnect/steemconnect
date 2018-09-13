<template>
  <div id="nav">
    <div class="p-4">
      <router-link to="/">
        <span id="logo" class="iconfont icon-diff-modified"/>
      </router-link>
    </div>
    <ul>
      <li class="border-bottom">
        <a href="#" class="py-2 px-4 d-block">
          {{username}}
        </a>
      </li>
      <li class="border-bottom py-3">
        <div class="pb-1 px-4 text-uppercase text-small">Account</div>
        <ul>
          <li>
            <router-link to="/portfolio" class="py-1 px-4 d-block">
              Portfolio
            </router-link>
          </li>
          <li>
            <router-link to="/transfer-history" class="py-1 px-4 d-block">
              History
            </router-link>
          </li>
          <li>
            <router-link to="/contacts" class="py-1 px-4 d-block">
              Contacts
            </router-link>
          </li>
          <li>
            <router-link to="/permissions" class="py-1 px-4 d-block">
              Permissions
            </router-link>
          </li>
        </ul>
      </li>
      <li class="border-bottom py-3">
        <div class="pb-1 px-4 text-uppercase text-small">Apps</div>
        <ul>
          <li>
            <router-link to="/app-store" class="py-1 px-4 d-block">
              App store
            </router-link>
          </li>
          <li>
            <a href="#authorized-apps" class="py-1 px-4 d-block">
              Authorized apps
            </a>
          </li>
        </ul>
      </li>
      <li class="border-bottom py-3">
        <div class="pb-1 px-4 text-uppercase text-small">Markets</div>
        <ul>
          <li>
            <router-link to="/market/SBD" class="py-1 px-4 d-block">
              SBD
            </router-link>
          </li>
          <li>
            <router-link to="/open-orders" class="py-1 px-4 d-block">
              Open orders
              <span v-if="openOrders.length > 0" class="Counter Counter--gray">
                {{openOrders.length}}
              </span>
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <router-link to="/settings" class="py-2 px-4 d-block">
          Settings
        </router-link>
      </li>
      <li>
        <router-link to="/about" class="py-2 px-4 d-block">
          About
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    openOrders() {
      return this.$store.state.auth.open_orders;
    },
    username() {
      return this.$store.state.auth.username;
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

#nav {
  font-size: 18px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: @sidebar-width;
  overflow: auto;
  background-color: @sidebar-bg-color;
  display: none;

  @media (min-width: 768px){
    display: block;
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
