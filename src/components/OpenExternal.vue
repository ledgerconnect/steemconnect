<template>
  <div class="flash mb-4 overflow-hidden">
    <div class="mb-3">
      We recommend you to use the SteemConnect desktop app. If you don't have this, you can download
      it from the
      <a :href="pkg.homepage" target="_blank">official site</a>.
    </div>
    <button class="btn btn-blue" @click="openUriScheme">
      Open desktop app
    </button>
  </div>
</template>

<script>
import pkg from '@/../package.json';

export default {
  props: ['uri', 'withChrome'],
  data() {
    return {
      pkg,
    };
  },
  methods: {
    openUriScheme() {
      /* eslint-disable no-underscore-dangle */
      if (this.withChrome && window._steemconnect) window._steemconnect.sign(this.uri);
      else document.location = this.uri;
      /* eslint-enable no-underscore-rangle */
    },
  },
};
</script>
