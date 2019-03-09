<template>
  <pre class="mt-2 d-inline-block">{{ value | pretty }}</pre>
</template>

<script>
export default {
  props: ['value'],
};
</script>
