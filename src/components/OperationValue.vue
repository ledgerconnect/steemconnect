<template>
  <span>
    <span v-if="value && Array.isArray(value)">
      <OperationValue v-for="(v, key) in value" :key="key" :value="v"/>
    </span>
    <span v-else-if="value && typeof value === 'object'">
      <div v-for="(v, key) in value" :key="key" class="mt-2">
        <p>
          <span class="form-label">- {{ key }}</span>
          <OperationValue :value="v"/>
        </p>
      </div>
    </span>
    <span v-else>
      {{ value === '__signer' ? username : value }}
    </span>
  </span>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      username: this.$store.state.auth.username,
    };
  },
};
</script>
