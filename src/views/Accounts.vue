<template>
  <div>
    <Header title="Accounts" />
    <div class="p-4 after-header">
      <div class="container-sm mx-auto">
        <div v-if="usernames.length > 0">
          <div
            v-for="user in usernames"
            :key="user"
            class="Box p-3 d-block border rounded-1 overflow-hidden mb-3"
          >
            <h4 class="m-0 d-inline-block">
              <Avatar :username="user" class="mr-2" />
              {{ user }}
            </h4>
            <span v-if="user === username">
              <span class="ml-3">Unlocked</span>
              <router-link class="ml-3" to="/auths">Auths</router-link>
              <a class="ml-3 text-red" @click="logout">Log out</a>
            </span>
            <span v-else>
              <router-link class="ml-3" to="/login">Unlock</router-link>
            </span>
            <a
              class="iconfont icon-trashcan float-right text-red p-1"
              @click="removeAccount(user)"
            />
          </div>
        </div>
        <div v-else>
          <p>
            There isn't any account stored on this computer,
            <router-link to="/import">click here</router-link>
            if you want to import an account.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { getKeychain, removeFromKeychain } from '@/helpers/keychain';

export default {
  data() {
    return {
      usernames: [],
    };
  },
  computed: {
    username() {
      return this.$store.state.auth.username;
    },
  },
  methods: {
    ...mapActions(['logout']),
    loadKeychain() {
      const keychain = getKeychain();
      this.usernames = Object.keys(keychain);
    },
    removeAccount(username) {
      removeFromKeychain(username);
      this.loadKeychain();
    },
  },
  created() {
    this.loadKeychain();
  },
};
</script>

<style scoped lang="less">
.icon-trashcan {
  font-size: 18px;
}
</style>
