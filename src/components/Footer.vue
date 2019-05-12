<template>
  <div class="footer mb-4">
    <ul>
      <li class="d-inline mx-2">
        <router-link to="/apps">Apps</router-link>
      </li>
      <li class="d-inline mx-2">
        <router-link to="/settings">Settings</router-link>
      </li>
      <li class="d-inline mx-2">
        <router-link to="/developers">Developers</router-link>
      </li>
      <li class="d-inline mx-2">
        <router-link to="/about">About</router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
@import '../vars';

.footer {
  ul {
    list-style: none;
    a {
      color: @input-border-color;
    }
  }
}
</style>
