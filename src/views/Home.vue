<template>
  <Login v-if="hasAccounts" />
  <Welcome v-else />
</template>

<script>
import { hasAccounts } from '@/helpers/keychain';
import Welcome from './Welcome.vue';
import Login from './Login.vue';

export default {
  computed: {
    hasAccounts() {
      return hasAccounts();
    },
  },
  components: { Login, Welcome },
};
</script>
