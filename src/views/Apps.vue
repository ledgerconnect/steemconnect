<template>
  <div class="height-full text-center">
    <div class="apps">
      <div class="mx-auto py-6 container-sm">
        <router-link to="/">
          <span class="logo iconfont icon-steemconnect" />
        </router-link>
        <div class="mt-4 mb-7">
          <h1 class="mb-6">App store</h1>
        </div>
      </div>
    </div>
    <div class="border-bottom">
      <Search v-model="search" class="container-sm" placeholder="Search for apps" />
    </div>
    <div class="container-sm my-4">
      <template v-if="search">
        <div class="mb-4">
          <p>
            <b>Search for "{{ search }}"</b>
          </p>
          {{ filteredApps.length }} apps
        </div>
        <div class="columns" v-if="filteredApps.length > 0">
          <div
            :key="app"
            v-for="app in filteredApps.slice(0, 12)"
            class="app-preview column col-md-3 col-4 mb-4"
          >
            <div class="mb-2">
              <Avatar :username="app" :size="60" />
            </div>
            {{ app }}
          </div>
        </div>
        <p v-else>We didn’t find any apps for "{{ search }}"</p>
      </template>
      <template v-else>
        <p class="mb-4"><b>Recently created</b></p>
        <VueLoadingIndicator v-if="isLoading && apps.length === 0" class="big" />
        <div class="columns">
          <div
            :key="app"
            v-for="app in apps.slice(0, 8)"
            class="app-preview column col-md-3 col-4 mb-4"
          >
            <div class="mb-2">
              <Avatar :username="app" :size="60" />
            </div>
            {{ app }}
          </div>
        </div>
      </template>
    </div>
    <Footer class="my-4" />
  </div>
</template>

<script>
import client from '@/helpers/client';

export default {
  data() {
    return {
      isLoading: false,
      search: null,
      apps: [],
    };
  },
  computed: {
    filteredApps() {
      return this.apps.filter(app =>
        JSON.stringify(app)
          .toLowerCase()
          .includes(this.search.toLowerCase()),
      );
    },
  },
  methods: {
    async loadApps() {
      this.isLoading = true;
      const username = 'steemscript';
      const step = 100;
      let follows = await client.call('follow_api', 'get_following', [username, '', 'blog', step]);
      this.apps = follows.map(follow => follow.following);
      while (follows.length === step) {
        const startFrom = this.apps[this.apps.length - 1];
        // eslint-disable-next-line
        follows = await client.call('follow_api', 'get_following', [username, startFrom, 'blog', step]);
        follows = follows.map(follow => follow.following);
        this.apps.push(...follows.slice(1));
      }
      this.isLoading = false;
    },
  },
  created() {
    this.loadApps();
  },
};
</script>

<style scoped lang="less">
@import '../vars';

h1,
h4 {
  color: @border-color;
}

.logo {
  color: @border-color;
}

.apps {
  color: @bg-color;
  background-color: @primary-color;
  background-image: url('../assets/img/shapes.svg');

  .app-preview {
    text-align: center;
  }
}
</style>
