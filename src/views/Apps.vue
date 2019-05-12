<template>
  <div class="height-full text-center">
    <div class="apps">
      <div class="mx-auto py-5 container-sm">
        <router-link to="/">
          <span class="logo iconfont icon-steemconnect" />
        </router-link>
        <div class="mt-4 mb-7">
          <h1 class="mb-6">Explore apps</h1>
        </div>
      </div>
    </div>
    <div class="border-bottom">
      <Search v-model="search" class="container-sm" placeholder="Search for apps" />
    </div>
    <div class="container-sm p-4">
      <template v-if="search">
        <div class="mb-4">
          <p>
            <b>Search for "{{ search }}"</b>
          </p>
          {{ filteredApps.length }} apps
        </div>
        <div class="columns" v-if="filteredApps.length > 0">
          <App
            :app="app"
            :key="app"
            v-for="app in filteredApps.slice(0, 12)"
            class="column col-sm-3 col-6 mb-4"
          />
        </div>
        <p v-else>We didn’t find any apps for "{{ search }}"</p>
      </template>
      <template v-else>
        <p class="mb-4"><b>Recently created</b></p>
        <VueLoadingIndicator v-if="isLoading && apps.length === 0" class="big" />
        <div class="columns mb-4" v-else>
          <App
            :app="app"
            :key="app"
            v-for="app in apps.slice(0, 8)"
            class="column col-sm-3 col-6 mb-4"
          />
        </div>
      </template>
      <Footer class="my-4"/>
    </div>
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
      const apps = JSON.parse(JSON.stringify(this.apps));
      return apps.sort((a, b) => a.length - b.length)
        .filter(app => app
          .toLowerCase()
          .includes(this.search.toLowerCase())
        ,
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
  background-attachment: fixed;
}
</style>
