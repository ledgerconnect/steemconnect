<template>
  <div class="flash flash-success mb-4">
    Your transaction is on the way! Here is the ID of the transaction:
    <a :href="`https://steemd.com/tx/${id}`" target="_blank">{{ id }}</a>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
  },
};
</script>
