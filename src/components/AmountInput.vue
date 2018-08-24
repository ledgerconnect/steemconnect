<template>
  <input
    v-model="amount"
    :id="id"
    :name="name"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
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
  methods: {
    handleBlur(e) {
      this.$emit('blur', e);
    },
    handleFocus(e) {
      this.$emit('focus', e);
    },
    handleChange(e) {
      this.$emit('change', e);
    },
  },
};
</script>
