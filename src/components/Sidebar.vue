<template>
  <div id="nav" class="border-right">
    <div class="p-4">
      <router-link to="/">
        <span id="logo" class="octicon octicon-diff-modified"/>
      </router-link>
    </div>
    <ul>
      <li class="border-bottom">
        <router-link to="/" class="py-2 px-4 d-block">
          {{username}}
        </router-link>
      </li>
      <li class="border-bottom">
        <router-link to="/portfolio" class="py-2 px-4 d-block">
          Portfolio
        </router-link>
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
              Open orders <span v-if="openOrders.length > 0" class="Counter Counter--gray">{{openOrders.length}}</span>
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

  ul {
    list-style: none;

    li {
      clear: both;
    }
  }
}
</style>
