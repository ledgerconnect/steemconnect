<template>
  <div class="Box operation mb-4">
    <OperationHeader :operation="operation[0]" />
    <div class="Box-row">
      <div v-for="(value, key) in operation[1]" :key="key">
        <p>
          <b class="form-label v-align-top">{{ schema[key].name || key }}</b>
          <OperationValue :value="value" :path="operation[0] + '.schema.' + key" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { has, get } from 'lodash';
import operations from '@/helpers/operations.json';

export default {
  props: ['operation'],
  computed: {
    schema() {
      return has(operations, `${this.operation[0]}.schema`)
        ? get(operations, `${this.operation[0]}.schema`)
        : {};
    },
  },
};
</script>
