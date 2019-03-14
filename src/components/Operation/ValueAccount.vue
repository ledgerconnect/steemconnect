<template>
  <a :href="'https://steemit.com/@' + value" target="_blank">
    <Avatar :username="value" :size="22" />
    {{ value }}
    <span class="iconfont icon-link-external"></span>
  </a>
</template>

<script>
export default {
  props: ['value'],
};
</script>
