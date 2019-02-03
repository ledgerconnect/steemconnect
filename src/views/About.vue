<template>
  <div>
    <Header title="About" />
    <div class="p-4 after-header">
      <div class="container-sm mx-auto">
        <h2>{{pkg.name}}</h2>
        <p v-if="pkg.description">{{pkg.description}}</p>
        <p>Version: {{pkg.version}}</p>
        <p v-if="pkg.license">License: {{pkg.license}}</p>
        <p v-if="pkg.homepage">
          <a :href="pkg.homepage" target="_blank">
            <span class="iconfont icon-link-external"/> Website
          </a>
        </p>
        <p v-if="pkg.bugs">
          <a :href="pkg.bugs.url" target="_blank">
            <span class="iconfont icon-mark-github"/> Report a bug
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import pkg from '@/../package.json';

export default {
  data() {
    return {
      pkg,
    };
  },
};
</script>
