<template>
  <div class="search border-bottom px-4">
      <span class="iconfont icon-search"/>
      <input
        :value="value"
        @input="handleInput"
        type="text"
        autocapitalize="off"
        class="px-4 py-3 border-0 input-lg"
      />
    </div>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) '../vars';

.search {
  display: flex;
  align-items: center;

  & > .icon-search {
    color: @border-color;
    font-size: 20px;
  }

  & > input {
    flex: 1;
  }
}
</style>
