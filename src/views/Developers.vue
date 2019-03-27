<template>
  <div>
    <Header title="Developers" />
    <div class="p-4 after-header">
      <div class="container-sm mx-auto mb-4">
        <p class="mb-4">
          You’ve found the SteemConnect developer documentation! This page dedicated to showing you
          all the ways that you can use SteemConnect to make cool stuff.
        </p>
        <a @click="selectSection('new-app')" class="Box p-3 d-block overflow-hidden mb-3">
          <h4 class="m-0">Add new app</h4>
        </a>
        <div v-if="selectedSection === 'new-app'" class="mb-4">
          <div class="mb-3">
            <p>
              To create a new app on SteemConnect you need a Steem account for it. If you don't have
              one yet you can create one on
              <a href="https://signup.steemit.com" target="_blank">signup.steemit.com</a>. Once you
              have a Steem account for your app, click on the button below, log in with your app
              account and update your profile with "application" as account type.
            </p>
            <router-link to="/profile" class="btn btn-large">
              Enable app
            </router-link>
          </div>
          <p>
            If you would like to use the OAuth 2 API for posting with SteemConnect server you need
            to authorize the Steem account "steemconnect" to post on the behalf of your app account.
            <a href="https://steemconnect.com/authorize/@steemconnect" target="_blank"
              >Click here</a
            >
            to do this and sign with your app account.
          </p>
        </div>
        <a @click="selectSection('edit-app')" class="Box p-3 d-block overflow-hidden mb-3">
          <h4 class="m-0">Edit app settings</h4>
        </a>
        <div v-if="selectedSection === 'edit-app'" class="mb-4">
          <p>You can edit your app settings by updating your app account profile.</p>
          <router-link to="/profile" class="btn btn-large">
            Edit app settings
          </router-link>
        </div>
        <a @click="selectSection('sdk')" class="Box p-3 d-block overflow-hidden mb-3">
          <h4 class="m-0">SDK</h4>
        </a>
        <div v-if="selectedSection === 'sdk'" class="mb-4">
          <p>
            Get started integrating SteemConnect on your website with SteemConnect.js, the official
            JavaScript SDK.
          </p>
          <a href="https://github.com/steemscript/steemconnect.js" target="_blank"
            ><span class="iconfont icon-mark-github" /> SteemConnect.js</a
          >
        </div>
        <a @click="selectSection('demo')" class="Box p-3 d-block overflow-hidden mb-3">
          <h4 class="m-0">Demo</h4>
        </a>
        <div v-if="selectedSection === 'demo'" class="mb-4">
          <p class="mt-2">Checkout SteemConnect demo with Vue.js</p>
          <a href="https://demo.steemconnect.com" target="_blank" class="mr-2">Try demo</a>
          <a
            href="https://github.com/steemscript/steemconnect.js/blob/master/docs/index.html"
            target="_blank"
          >
            <span class="iconfont icon-mark-github" /> See on GitHub
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSection: false,
    };
  },
  methods: {
    selectSection(section) {
      this.selectedSection = this.selectedSection === section ? false : section;
    },
  },
};
</script>
