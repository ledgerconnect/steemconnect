<template>
  <div class="p-4">
    <h1>About</h1>
    <p>Version: {{pkg.version}}</p>
  </div>
</template>

<script>
import pkg from '@/../package.json';

export default {
  data() {
    return {
      pkg
    }
  },
};
</script>
