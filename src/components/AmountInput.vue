<template>
  <input
    v-model="amount"
    :id="id"
    :name="name"
    v-on="restListeners"
    class="form-control input-lg input-block mb-2"
  />
</template>

<script>
export default {
  props: ['id', 'name', 'value', 'digits'],
  data() {
    return {
      amount: this.value,
    };
  },
  computed: {
    restListeners() {
      const { input, ...rest } = this.$listeners;

      return rest;
    },
    regex() {
      return new RegExp(`^[0-9]*[.]?[0-9]{0,${this.digits || 3}}$`);
    },
  },
  watch: {
    value(value) {
      this.amount = value;
    },
    amount(value, oldValue) {
      if (!this.regex.test(value)) {
        this.amount = oldValue;
      }

      this.$emit('input', this.amount);
    },
  },
};
</script>
