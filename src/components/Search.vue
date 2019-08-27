<template>
  <div class="search px-4">
    <span class="iconfont icon-search" />
    <input
      :value="value"
      :placeholder="placeholder"
      @input="handleInput"
      type="text"
      autocorrect="off"
      autocapitalize="none"
      class="px-4 py-3 border-0 input-lg"
    />
  </div>
</template>

<script>
export default {
  props: ['value', 'placeholder'],
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../vars';

.search {
  display: flex;
  align-items: center;

  & > .icon-search {
    color: @input-border-color;
    font-size: 20px;
  }

  & > input {
    flex: 1;
  }
}
</style>
