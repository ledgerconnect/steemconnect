<template>
  <span>{{ formatValue(value) }}</span>
</template>

<script>
import { formatNumber, getVestsToSP } from '@/helpers/utils';

const VESTS_REGEX = /[0-9]+(?:\.[0-9]{1,6})? VESTS/;

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    vestToSP() {
      return getVestsToSP(this.$store.state.settings.properties);
    },
  },
  methods: {
    formatValue(value) {
      if (VESTS_REGEX.test(value)) {
        return `${formatNumber(parseFloat(value) * this.vestToSP)} SP`;
      }
      return value;
    },
  },
};
</script>
