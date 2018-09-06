<template>
  <div>
    <Search v-model="search" />
    <template>
      <table class="table width-full">
        <thead>
        <tr class="border-bottom">
          <th>User</th>
          <th>What</th>
          <th/>
        </tr>
        </thead>
        <tbody>
          <tr v-if="contacts.length === 0">
            <td class="text-center" colspan="3">You don't have any contacts</td>
          </tr>
          <tr v-else-if="filteredContacts.length === 0">
            <td class="text-center" colspan="3">Nothing found</td>
          </tr>
          <tr v-for="contact in filteredContacts" class="border-bottom" :key="contact.username">
            <td>
              <Avatar :username="contact.username" />
              {{contact.username}}
            </td>
            <td>
              <span v-for="scope in contact.what" :key="scope" class="Label Label--outline mr-1">
                {{ scope }}
              </span>
            </td>
            <td class="text-right">
              <VueDropdown>
                <VueButton
                  slot="trigger"
                  class="icon-button flat"
                >
                  <span class="iconfont icon-kebab-vertical"/>
                </VueButton>
                <a
                  :href="'https://steemit.com/@' + contact.username"
                  target="_blank"
                  class="button-link vue-ui-button vue-ui-dropdown-button button"
                >
                  View profile <span class="iconfont icon-link-external"/>
                </a>
                <VueDropdownButton
                  @click="handleSendOpen(contact.username)"
                >
                  Send
                </VueDropdownButton>
                <VueDropdownButton disabled>Unfollow</VueDropdownButton>
              </VueDropdown>
          </td>
          </tr>
        </tbody>
      </table>
    </template>
    <ModalSend
      :open="sendModalOpen"
      :initialUsername="sendUsername"
      initialAsset="STEEM"
      @cancel="handleSendCancel"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      sendModalOpen: false,
      sendUsername: '',
    };
  },
  computed: {
    contacts() {
      return this.$store.state.auth.contacts;
    },
    filteredContacts() {
      if (this.search === '') return this.contacts;

      return this.contacts.filter(contact =>
        contact.username.indexOf(this.search.toLowerCase()) !== -1);
    },
  },
  methods: {
    handleSendOpen(username) {
      this.sendUsername = username;
      this.sendModalOpen = true;
    },
    handleSendCancel() {
      this.sendModalOpen = false;
    },
  },
};
</script>

<style scoped>
.avatar {
  margin-right: 8px;
}
</style>
