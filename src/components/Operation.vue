<template>
  <div class="Box mb-4">
    <OperationHeader :operation="operation[0]"/>
    <div class="Box-row">
      <div v-for="(value, key) in operation[1]" :key="key">
        <p>
          <b class="form-label">{{ key }}</b>
          <OperationValue :value="value" :path="operation[0] + '.schema.' + key"/>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['operation'],
};
</script>
