<template>
  <div class="flash flash-error mb-4">
    Oops, something went wrong.
    <span v-if="message">
      Here is the error message:
      <br /><b>"{{ message }}"</b>
    </span>
    <span v-else>Please try again later.</span>
  </div>
</template>

<script>
import { getErrorMessage } from '@/helpers/utils';

export default {
  props: ['error'],
  computed: {
    message() {
      return getErrorMessage(this.error);
    },
  },
};
</script>
