<template>
  <div class="input-popup-container">
    <input
      v-model="inputValue"
      ref="input"
      :id="id"
      class="form-control input-lg input-block mb-2"
      :class="{ 'input-open': open }"
      autocorrect="off"
      autocapitalize="none"
      autocomplete="off"
      v-on="restListeners"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeyDown"
    />
    <ul
      v-if="open"
      @mouseenter="ignoreBlur = true"
      @touchStart="ignoreBlur = true"
      @mouseleave="ignoreBlur = false"
      role="listbox"
      class="input-popup"
    >
      <li
        v-for="(option, id) in visibleOptions"
        :key="keyExtractor(option)"
        :class="{ 'active': id === selector }"
        @click="handleOptionClick(valueExtractor(option))"
      >
        <slot v-bind:option="option">
          {{ option }}
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
import { simpleSearch } from '@/helpers/utils';

export default {
  props: {
    value: String,
    id: String,
    values: {
      type: Array,
      default() {
        return [];
      },
    },
    keyExtractor: {
      type: Function,
      default: el => el,
    },
    valueExtractor: {
      type: Function,
      default: el => el,
    },
    termsExtractor: {
      type: Function,
      default: el => el,
    },
  },
  data() {
    return {
      ignoreBlur: false,
      open: false,
      inputValue: this.value,
      selector: 0,
    };
  },
  watch: {
    inputValue(newValue) {
      this.$emit('input', newValue);
    },
  },
  computed: {
    restListeners() {
      const {
        input,
        focus,
        blur,
        ...rest
      } = this.$listeners;

      return rest;
    },
    visibleOptions() {
      return simpleSearch(this.values, this.inputValue, this.termsExtractor).slice(0, 4);
    },
  },
  methods: {
    handleFocus(e) {
      this.open = true;
      this.$emit('focus', e);
    },
    handleBlur(e) {
      this.$emit('blur', e);

      if (this.ignoreBlur) {
        this.ignoreBlur = false;

        return;
      }

      this.open = false;
    },
    handleKeyDown(e) {
      switch (e.key) {
        case 'ArrowDown':
          if (this.selector < this.visibleOptions.length - 1) {
            this.selector += 1;
          }
          break;
        case 'ArrowUp':
          if (this.selector > 0) {
            this.selector -= 1;
          }
          break;
        case 'Enter':
          this.inputValue = this.valueExtractor(this.visibleOptions[this.selector]);

          this.open = false;
          break;
        default:
          this.selector = 0;
          this.open = true;
      }
    },
    handleOptionClick(option) {
      this.inputValue = option;

      this.open = false;
      this.ignoreBlur = true;
    },
  },
};
</script>


<style lang="less" scoped>
@import (reference) '../vars.less';

.input-popup-container {
  position: relative;

  & > input:focus {
    border-color: @input-border-color;
    box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
  }

  & > .input-open {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  & > .input-popup {
    z-index: 1;
    position: absolute;
    top: 28px;
    width: 100%;
    background: white;
    border: 1px solid @input-border-color;
    border-radius: 0 0 3px 3px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);

    & > li {
      cursor: pointer;
      list-style-type: none;

      &.active {
        background: @white-darker;
      }
    }
  }
}
</style>
