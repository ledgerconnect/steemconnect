<template>
  <div class="p-4">
    <h1>About</h1>
    <p>Version: {{pkg.version}}</p>
    <p>License: {{pkg.license}}</p>
    <p v-if="pkg.bugs">
      <a :href="pkg.bugs.url" target="_blank">
        Report a bug
      </a>
    </p>
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
