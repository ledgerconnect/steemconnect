<template>
  <div id="nav" class="border-right">
    <div class="p-4">
      <router-link to="/">
        <span id="logo" class="octicon octicon-diff-modified"/>
      </router-link>
    </div>
    <ul>
      <li>
        <router-link to="/" class="py-2 px-4 d-block">
          Home
        </router-link>
      </li>
      <li class="border-top py-3">
        <div class="pb-1 px-4 text-uppercase text-small">Markets</div>
        <ul>
          <li>
            <router-link to="/market/SBD" class="py-1 px-4 d-block">
              SBD
            </router-link>
          </li>
          <li class="py-1 px-4">...</li>
        </ul>
      </li>
      <li class="border-top">
        <router-link to="/wallet" class="py-2 px-4 d-block">
          Wallet
        </router-link>
      </li>
      <li class="border-top">
        <router-link to="/about" class="py-2 px-4 d-block">
          About
        </router-link>
      </li>
    </ul>
  </div>
</template>

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
