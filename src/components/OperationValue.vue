<template>
  <span>
    <template v-if="value && Array.isArray(value)">
      <OperationValue v-for="(v, key) in value" :key="key" :value="v"/>
    </template>
    <template v-else-if="value && typeof value === 'object'">
      <div v-for="(v, key) in value" :key="key" class="mt-2">
        <p>
          <span class="form-label">- {{ key }}</span>
          <OperationValue :value="v"/>
        </p>
      </div>
    </template>
    <template v-else>
      <template v-if="value === '__signer'">
        <em v-if="!username">you</em>
        <template v-else>{{ username }}</template>
      </template>
      <template v-else>{{ value }}</template>
    </template>
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
