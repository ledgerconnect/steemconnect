<template>
  <div class="Box-row">
    <h4 class="mb-0">{{ model.name || operation }}</h4>
  </div>
</template>

<script>
import operations from '@/helpers/operations.json';

export default {
  props: ['operation'],
  data() {
    return {
      model: operations[this.operation] || {},
    };
  },
};
</script>
