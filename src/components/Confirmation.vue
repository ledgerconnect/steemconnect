<template>
  <div class="flash flash-success mb-4">
    Your transaction is on the way! Here is the ID of the transaction:
    <a :href="`https://steemd.com/tx/${id}`" target="_blank">{{ id }}</a>
    <button v-if="isExtension" type="submit" class="btn btn-large btn-success mt-4" @click="close">
      Close
    </button>
  </div>
</template>

<script>
import { isChromeExtension } from '@/helpers/utils';

export default {
  props: {
    id: String,
  },
  data() {
    return {
      isExtension: isChromeExtension(),
    };
  },
  methods: {
    close() {
      window.close();
    },
  },
};
</script>
