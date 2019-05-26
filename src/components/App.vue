<template>
  <div class="text-center">
    <a @click="$emit('select')">
      <span class="mb-2 d-block">
        <Avatar :username="username" :size="60" />
      </span>
      {{ username }}
    </a>
  </div>
</template>

<script>
export default {
  props: ['username'],
};
</script>
