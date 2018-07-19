<template>
  <div id="app" class="d-flex flex-row">
    <div id="nav">
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          Markets
          <ul>
            <li>
              <router-link to="/market/SBD">SBD</router-link>
            </li>
          </ul>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
      </ul>
    </div>
    <div id="content" class="width-full p-3">
      <router-view/>
    </div>
  </div>
</template>

<style scoped lang="less">
#nav {
  background-color: white;
  width: 200px;
  ul {
    li {
      clear: both;
    }
  }
}
</style>
