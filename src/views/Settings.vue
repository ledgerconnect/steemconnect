<template>
  <div>
    <Header title="Settings" />
    <div class="p-4 after-header">
      <div class="container-sm mx-auto">
        <div v-if="successVisible" class="flash flash-success mb-4">
          Settings has been saved.
        </div>
        <router-link to="/accounts" class="Box p-3 d-block border rounded-1 overflow-hidden mb-4">
          <h4 class="m-0">Accounts</h4>
        </router-link>
        <form @submit.prevent="handleSubmit" class="mb-4">
          <!--
          <label for="language">Language</label>
          <select
            v-model="language"
            id="language"
            class="form-select input-lg input-block mb-2"
            @blur="handleBlur('language')"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
          -->
          <label for="timeout">Session timeout in</label>
          <select
            v-model="timeout"
            id="timeout"
            class="form-select input-lg input-block mb-2"
            @blur="handleBlur('timeout')"
          >
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="20">20 minutes</option>
            <option value="40">40 minutes</option>
            <option value="60">1 hour</option>
          </select>
          <!--
          <label for="theme">Theme</label>
          <select
            v-model="theme"
            id="theme"
            class="form-select input-lg input-block mb-2"
            @blur="handleBlur('theme')"
          >
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
          -->
          <label for="address">Node address</label>
          <input
            v-model.trim="address"
            id="address"
            name="to"
            type="text"
            class="form-control input-lg input-block mb-4"
            autocorrect="off"
            autocapitalize="none"
            @blur="handleBlur('address')"
          />
          <button type="submit" class="btn btn-large btn-blue mb-2">
            Save
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      language: this.$store.state.settings.language,
      timeout: this.$store.state.settings.timeout,
      theme: this.$store.state.settings.theme,
      address: this.$store.state.settings.address,
      dirty: {
        language: false,
        timeout: false,
        theme: false,
        address: false,
      },
      saved: false,
    };
  },
  computed: {
    successVisible() {
      if (!this.saved) return false;
      return !(this.dirty.language || this.dirty.timeout || this.dirty.theme || this.dirty.address);
    },
  },
  methods: {
    ...mapActions(['saveSettings']),
    handleBlur(name) {
      this.dirty[name] = true;
    },
    handleSubmit() {
      this.saveSettings({
        language: this.language,
        timeout: this.timeout,
        theme: this.theme,
        address: this.address,
      });

      this.dirty = {
        language: false,
        timeout: false,
        theme: false,
        address: false,
      };
      this.saved = true;
    },
  },
};
</script>
