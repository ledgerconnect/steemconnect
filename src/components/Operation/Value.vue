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
        <template v-if="username">
          <OperationValueAccount :value="username"/>
        </template>
        <em v-else>you</em>
      </template>
      <template v-else-if="!value">
        <em>empty</em>
      </template>
      <template v-else>
        <OperationValueAccount v-if="schema.type === 'account'" :value="value"/>
        <OperationValueAmount v-else-if="schema.type === 'amount'" :value="value"/>
        <template v-else-if="schema.type === 'time'">{{ value | dateHeader }}</template>
        <template v-else>{{ value }}</template>
      </template>
    </template>
  </span>
</template>

<script>
import _ from 'lodash';
import operations from '@/helpers/operations.json';

export default {
  props: ['value', 'path'],
  data() {
    return {
      username: this.$store.state.auth.username,
    };
  },
  computed: {
    schema() {
      return _.has(operations, this.path) ? _.get(operations, this.path) : {};
    },
  },
};
</script>
